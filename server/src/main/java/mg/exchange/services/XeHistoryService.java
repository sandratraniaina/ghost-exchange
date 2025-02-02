package mg.exchange.services;

import mg.exchange.models.XeHistory;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.repository.XeHistoryRepository;
import mg.exchange.repository.CryptocurrencyRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class XeHistoryService {

    private final XeHistoryRepository xeHistoryRepository;
    private final CryptocurrencyRepository cryptocurrencyRepository;
    @Value("${cryptocurrency.price.min}")
    private double priceMin;

    @Value("${cryptocurrency.price.max}")
    private double priceMax;

    public List<XeHistory> getAllXeHistories() {
        return xeHistoryRepository.findAll();
    }

    public Optional<XeHistory> getXeHistoryById(Long id) {
        return xeHistoryRepository.findById(id);
    }

    public XeHistory createXeHistory(XeHistory xeHistory) {
        // Ensure the cryptocurrency exists
        Cryptocurrency cryptocurrency = cryptocurrencyRepository.findById(xeHistory.getCryptocurrency().getId())
                .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));
        xeHistory.setCryptocurrency(cryptocurrency);
        return xeHistoryRepository.save(xeHistory);
    }

    public XeHistory updateXeHistory(Long id, XeHistory xeHistoryDetails) {
        XeHistory xeHistory = xeHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("XeHistory not found"));

        // Update cryptocurrency if provided
        if (xeHistoryDetails.getCryptocurrency() != null) {
            Cryptocurrency cryptocurrency = cryptocurrencyRepository.findById(xeHistoryDetails.getCryptocurrency().getId())
                    .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));
            xeHistory.setCryptocurrency(cryptocurrency);
        }

        xeHistory.setFiatPrice(xeHistoryDetails.getFiatPrice());
        xeHistory.setTimestamp(xeHistoryDetails.getTimestamp());
        return xeHistoryRepository.save(xeHistory);
    }

    public void deleteXeHistory(Long id) {
        xeHistoryRepository.deleteById(id);
    }
}