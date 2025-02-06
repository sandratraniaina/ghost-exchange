package mg.exchange.services;

import mg.exchange.models.XeHistory;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.repository.XeHistoryRepository;
import mg.exchange.repository.CryptocurrencyRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class XeHistoryService {

    private final XeHistoryRepository xeHistoryRepository;
    private final CryptocurrencyRepository cryptocurrencyRepository;
    @Value("${cryptocurrency.price.min}")
    private double priceMin;

    @Value("${cryptocurrency.price.max}")
    private double priceMax;

    @Value("${cryptocurrency.schedule.interval}")
    private long scheduleInterval;

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

    @Transactional
    @Scheduled(fixedRateString = "${cryptocurrency.schedule.interval}")
    public void generateNewExchanges() {
        List<Cryptocurrency> cryptocurrencies = cryptocurrencyRepository.findAll();
        Random random = new Random();
        for (Cryptocurrency cryptocurrency : cryptocurrencies) {
            double randomPriceValue = priceMin + (priceMax - priceMin) * random.nextDouble();
            BigDecimal randomPrice = new BigDecimal(randomPriceValue)
                    .setScale(2, RoundingMode.HALF_UP);
            XeHistory xeHistory = new XeHistory();
            xeHistory.setCryptocurrency(cryptocurrency);
            xeHistory.setFiatPrice(randomPrice);
            xeHistory.setTimestamp(LocalDateTime.now());
            xeHistoryRepository.save(xeHistory);
        }
    }

    public List<XeHistory> getHistory(List<Cryptocurrency> cryptos, Integer interval){
        return xeHistoryRepository.getHistory(cryptos, interval);
    }
}