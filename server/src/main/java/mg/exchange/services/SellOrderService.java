package mg.exchange.services;

import mg.exchange.models.*;
import mg.exchange.repository.SellOrderRepository;
import mg.exchange.repository.UserRepository;
import mg.exchange.repository.CryptocurrencyRepository;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SellOrderService {

    private static final Logger logger = LoggerFactory.getLogger(SellOrderService.class);

    private final SellOrderRepository sellOrderRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final LedgerService ledgerService;
    private final CommissionService commissionService;
    private final CryptocurrencyWalletService cryptocurrencyWalletService;
    private final FirestoreService firestoreService;

    public List<SellOrder> getAllSellOrders() {
        return sellOrderRepository.findAll();
    }

    public SellOrder getSellOrderById(Long id) {
        return sellOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sell Order not found with id: " + id));
    }

    public SellOrder createSellOrder(SellOrder sellOrder) throws Exception {
        User seller = null;
        if (sellOrder.getSeller() != null && sellOrder.getSeller().getId() != null) {
            seller = userRepository.findById(sellOrder.getSeller().getId())
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
        }
        sellOrder.setSeller(seller);

        Cryptocurrency cryptocurrency = cryptocurrencyRepository.findById(sellOrder.getCryptocurrency().getId())
                .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));
        sellOrder.setCryptocurrency(cryptocurrency);

        if (seller != null) {
            Optional<CryptocurrencyWallet> walletOptional = cryptocurrencyWalletService
                    .getWalletByUserIdAndCrypotCurrencyId(seller.getId(), cryptocurrency.getId());

            if (walletOptional.isEmpty()) {
                throw new Exception("You don't have a wallet for that crypto to sell");
            }

            CryptocurrencyWallet wallet = walletOptional.get();
            if (wallet.getBalance().compareTo(sellOrder.getAmount()) < 0) {
                throw new Exception("You don't have enough crypto for the amount you want to sell");
            }

            BigDecimal newBalance = wallet.getBalance().subtract(sellOrder.getAmount());
            logger.info("balance : " + newBalance);
            wallet.setBalance(newBalance);
            cryptocurrencyWalletService.updateWallet(wallet.getId(), wallet);
        }
        Commission com = commissionService.getCommissionById(1L);
        sellOrder.setSalesCommission(com.getSalesCommission());

        SellOrder sellOrderSaved = sellOrderRepository.save(sellOrder);
        firestoreService.syncToFirestore(sellOrderSaved);
        return sellOrderSaved;
    }


    public SellOrder updateSellOrder(Long id, SellOrder sellOrderDetails) {
        SellOrder sellOrder = sellOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SellOrder not found"));

        // Update seller if provided
        if (sellOrderDetails.getSeller() != null && sellOrderDetails.getSeller().getId() != null) {
            User seller = userRepository.findById(sellOrderDetails.getSeller().getId())
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
            sellOrder.setSeller(seller);
        }

        // Update cryptocurrency if provided
        if (sellOrderDetails.getCryptocurrency() != null) {
            Cryptocurrency cryptocurrency = cryptocurrencyRepository
                    .findById(sellOrderDetails.getCryptocurrency().getId())
                    .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));
            sellOrder.setCryptocurrency(cryptocurrency);
        }

        sellOrder.setAmount(sellOrderDetails.getAmount());
        sellOrder.setFiatPrice(sellOrderDetails.getFiatPrice());
        sellOrder.setTimestamp(sellOrderDetails.getTimestamp());
        sellOrder.setIsOpen(sellOrderDetails.getIsOpen());
        firestoreService.syncToFirestore(sellOrder);
        SellOrder sellOrderSaved = sellOrderRepository.save(sellOrder);
        firestoreService.syncToFirestore(sellOrderSaved);
        return sellOrderSaved;
    }

    @Transactional
    public void deleteSellOrder(Long sellOrderId) {
        SellOrder sellOrder = sellOrderRepository.findById(sellOrderId)
                .orElseThrow(() -> new RuntimeException("Sell Order not found with id: " + sellOrderId));
        ledgerService.deleteBySellOrderId(sellOrderId);
        firestoreService.deleteFromFirestore(sellOrder);
        sellOrderRepository.deleteById(sellOrderId);
    }

    public List<SellOrder> getOpenSellOrders() {
        return sellOrderRepository.findOpenSellOrders();
    }

    public List<SellOrder> getSellOrdersBySellerId(Long sellerId) {
        return sellOrderRepository.findSellOrdersBySellerId(sellerId);
    }

    public List<SellOrder> getOpenSellOrdersBySellerId(Long sellerId) {
        return sellOrderRepository.findOpenSellOrdersBySellerId(sellerId);
    }

    @Transactional
    public void cancelSellOrder(SellOrder sellOrder) {
        sellOrder.setIsOpen(true);
        ledgerService.deleteBySellOrderId(sellOrder.getId());
        updateSellOrder(sellOrder.getId(), sellOrder);
        Ledger ledger = ledgerService.getLedgerBySellOrderId(sellOrder.getId())
                .orElseThrow(() -> new RuntimeException("Ledger not found for the SellOrder"));
        CryptocurrencyWallet sellerWallet = cryptocurrencyWalletService.getWalletByUserIdAndCrypotCurrencyId(
                sellOrder.getSeller().getId(), sellOrder.getCryptocurrency().getId()).get();
        sellerWallet.setBalance(sellerWallet.getBalance().add(sellOrder.getAmount()));
        CryptocurrencyWallet buyerWallet = cryptocurrencyWalletService
                .getWalletByUserIdAndCrypotCurrencyId(ledger.getBuyer().getId(), sellOrder.getCryptocurrency().getId())
                .get();
        buyerWallet.setBalance(buyerWallet.getBalance().subtract(sellOrder.getAmount()));
        cryptocurrencyWalletService.updateWallet(sellerWallet.getId(), sellerWallet);
        cryptocurrencyWalletService.updateWallet(buyerWallet.getId(), buyerWallet);
    }

    @Transactional
    public void buyCrypto(SellOrder sellOrder, User buyer) throws Exception {
        if (sellOrder == null) {
            throw new IllegalArgumentException("Sell order must not be null");
        }

        sellOrder.setIsOpen(false);
        sellOrderRepository.save(sellOrder);

        Commission commission = commissionService.getCommissionById(1L);

        Ledger ledger = new Ledger();
        ledger.setSellOrder(sellOrder);
        ledger.setTimestamp(LocalDateTime.now());
        ledger.setPurchasesCommission(commission.getPurchasesCommission());

        if (buyer != null) {
            if (buyer.getFiatBalance().compareTo(sellOrder.getFiatPrice()) < 0) {
                throw new RuntimeException("Solde insuffisant");
            }

            ledger.setBuyer(buyer);
            updateBuyerWallet(buyer, sellOrder);
            buyer.setFiatBalance(buyer.getFiatBalance().subtract(sellOrder.getFiatPrice()));
            userService.updateUser(buyer.getId(), buyer);
        } else {
            ledger.setBuyer(null);
        }

        if (sellOrder.getSeller() != null) {
            User seller = sellOrder.getSeller();
            seller.setFiatBalance(seller.getFiatBalance().add(sellOrder.getFiatPrice()));
            userService.updateUser(seller.getId(), seller);
        }

        ledgerService.createLedger(ledger);
    }

    public List<SellOrder> getSellOrderByCryptocurrencyId(Long cryproId) {
        return sellOrderRepository.findSellOrderByCryptocurrencyIdandIsOpen(cryproId);
    }

    private CryptocurrencyWallet createNewWallet(User buyer, Cryptocurrency cryptocurrency) {
        CryptocurrencyWallet newWallet = new CryptocurrencyWallet();
        newWallet.setUser(buyer);
        newWallet.setCryptocurrency(cryptocurrency);
        newWallet.setBalance(BigDecimal.ZERO);
        return cryptocurrencyWalletService.createWallet(newWallet);
    }

    private void updateBuyerWallet(User buyer, SellOrder sellOrder) {
        CryptocurrencyWallet buyerWallet = cryptocurrencyWalletService
                .getWalletByUserIdAndCrypotCurrencyId(buyer.getId(), sellOrder.getCryptocurrency().getId())
                .orElseGet(() -> createNewWallet(buyer, sellOrder.getCryptocurrency()));

        buyerWallet.setBalance(buyerWallet.getBalance().add(sellOrder.getAmount()));
        cryptocurrencyWalletService.updateWallet(buyerWallet.getId(), buyerWallet);
    }

}