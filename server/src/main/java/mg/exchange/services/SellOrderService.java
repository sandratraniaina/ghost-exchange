package mg.exchange.services;

import mg.exchange.models.SellOrder;
import mg.exchange.models.User;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.repository.SellOrderRepository;
import mg.exchange.repository.UserRepository;
import mg.exchange.repository.CryptocurrencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SellOrderService {

    private final SellOrderRepository sellOrderRepository;
    private final UserRepository userRepository;
    private final CryptocurrencyRepository cryptocurrencyRepository;

    public List<SellOrder> getAllSellOrders() {
        return sellOrderRepository.findAll();
    }

    public Optional<SellOrder> getSellOrderById(Long id) {
        return sellOrderRepository.findById(id);
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

    public void deleteSellOrder(Long id) {
        sellOrderRepository.deleteById(id);
    }
}