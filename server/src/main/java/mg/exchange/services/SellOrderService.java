package mg.exchange.services;

import mg.exchange.models.Ledger;
import mg.exchange.models.SellOrder;
import mg.exchange.models.User;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.repository.SellOrderRepository;
import mg.exchange.repository.UserRepository;
import mg.exchange.repository.CryptocurrencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SellOrderService {

    private final SellOrderRepository sellOrderRepository;
    private final UserRepository userRepository;
    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final LedgerService ledgerService;

    public List<SellOrder> getAllSellOrders() {
        return sellOrderRepository.findAll();
    }

    public SellOrder getSellOrderById(Long id) {
        return sellOrderRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Sell Order not found with id: " + id));
    }

    public SellOrder createSellOrder(SellOrder sellOrder) {
        // Ensure the seller exists
        User seller = userRepository.findById(sellOrder.getSeller().getId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        // Ensure the cryptocurrency exists
        Cryptocurrency cryptocurrency = cryptocurrencyRepository.findById(sellOrder.getCryptocurrency().getId())
                .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));

        sellOrder.setSeller(seller);
        sellOrder.setCryptocurrency(cryptocurrency);
        return sellOrderRepository.save(sellOrder);
    }

    public SellOrder updateSellOrder(Long id, SellOrder sellOrderDetails) {
        SellOrder sellOrder = sellOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SellOrder not found"));

        // Update seller if provided
        if (sellOrderDetails.getSeller() != null) {
            User seller = userRepository.findById(sellOrderDetails.getSeller().getId())
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
            sellOrder.setSeller(seller);
        }

        // Update cryptocurrency if provided
        if (sellOrderDetails.getCryptocurrency() != null) {
            Cryptocurrency cryptocurrency = cryptocurrencyRepository.findById(sellOrderDetails.getCryptocurrency().getId())
                    .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));
            sellOrder.setCryptocurrency(cryptocurrency);
        }

        sellOrder.setAmount(sellOrderDetails.getAmount());
        sellOrder.setFiatPrice(sellOrderDetails.getFiatPrice());
        sellOrder.setTimestamp(sellOrderDetails.getTimestamp());
        sellOrder.setIsOpen(sellOrderDetails.getIsOpen());
        return sellOrderRepository.save(sellOrder);
    }

    
    @Transactional
    public void deleteSellOrder(Long sellOrderId) {
        sellOrderRepository.deleteById(sellOrderId);
    }
    

    public List<SellOrder> getOpenSellOrders() {
        return sellOrderRepository.findOpenSellOrders();
    }

    public List<SellOrder> getSellOrdersBySellerId(Long sellerId) {
        return sellOrderRepository.findSellOrdersBySellerId(sellerId);
    }

    public List<SellOrder> getOpenSellOrdersBySellerId(Long sellerId){
        return sellOrderRepository.findOpenSellOrdersBySellerId(sellerId);
    }

    @Transactional
    public void buyCrypto(SellOrder sellOrder, User buyer) {
        if (sellOrder == null || buyer == null) {
            throw new IllegalArgumentException("Sell order and buyer must not be null");
        }
        sellOrder.setIsOpen(false);
        sellOrderRepository.save(sellOrder);
        Ledger ledger = new Ledger();
        ledger.setSellOrder(sellOrder);
        ledger.setBuyer(buyer);
        ledger.setTimestamp(LocalDateTime.now()); 
        ledgerService.createLedger(ledger); 
    }

    @Transactional
    public  void cancelSellOrder(SellOrder sellOrder){
        sellOrder.setIsOpen(true);
        ledgerService.deleteBySellOrderId(sellOrder.getId());
        updateSellOrder(sellOrder.getId(),sellOrder);
    }
}