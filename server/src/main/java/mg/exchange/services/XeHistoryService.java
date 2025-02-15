package mg.exchange.services;

import mg.exchange.models.XeHistory;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.repository.XeHistoryRepository;
import mg.exchange.repository.CryptocurrencyRepository;
import lombok.RequiredArgsConstructor;

import org.hibernate.StaleObjectStateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class XeHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(XeHistoryService.class);

    private final FirestoreService firestoreService;
    int DEFAULT_INTERVAL = 3;

    private final XeHistoryRepository xeHistoryRepository;
    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final CryptocurrencyService cryptocurrencyService;
    @Value("${cryptocurrency.price.min}")
    private double min;

    @Value("${cryptocurrency.price.max}")
    private double max;

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
        XeHistory xeHistorySaved = xeHistoryRepository.save(xeHistory);
        firestoreService.syncToFirestore(xeHistorySaved);
        return xeHistorySaved;
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
        firestoreService.syncToFirestore(xeHistory);
        return xeHistoryRepository.save(xeHistory);
    }

    public void deleteXeHistory(Long id) {
        XeHistory xeHistory = xeHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("XeHistory not found"));
        firestoreService.deleteFromFirestore(xeHistory);
        xeHistoryRepository.deleteById(id);
    }

    @Transactional
    @Scheduled(fixedRateString = "${cryptocurrency.schedule.interval}")
    public void generateNewExchanges() {
        List<Cryptocurrency> cryptocurrencies = cryptocurrencyRepository.findAll();
        Random random = new Random();

        for (Cryptocurrency cryptocurrency : cryptocurrencies) {
            try {
                BigDecimal lastPrice = cryptocurrency.getFiatPrice();
                double percentageChange = min + (max - min) * random.nextDouble();
                BigDecimal newPrice = lastPrice.multiply(BigDecimal.ONE.add(BigDecimal.valueOf(percentageChange / 100)))
                                            .setScale(2, RoundingMode.HALF_UP);
                XeHistory xeHistory = new XeHistory();
                xeHistory.setCryptocurrency(cryptocurrency);
                xeHistory.setFiatPrice(newPrice);
                xeHistory.setTimestamp(LocalDateTime.now());
                cryptocurrency.setFiatPrice(newPrice);
                cryptocurrencyService.updateCryptocurrency(cryptocurrency.getId(), cryptocurrency);
                createXeHistory(xeHistory);

            } catch (StaleObjectStateException e) {
                // Log the error and retry or skip
                logger.error("Conflict detected for cryptocurrency: " + cryptocurrency.getId());
                // Optionally, refresh the entity and retry
            }
        }
    }

    public List<XeHistory> findHistory(List<Cryptocurrency> cryptocurrencies, Integer interval) {
        int actualInterval = interval != null ? interval : DEFAULT_INTERVAL;
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime = endTime.minusHours(actualInterval);
        
        return xeHistoryRepository.findByCryptocurrencyInAndTimestampBetween(cryptocurrencies,startTime,endTime);
    }



    public List<XeHistory> getHistory(List<Cryptocurrency> cryptos, Integer interval){
        return findHistory(cryptos, interval);
    }
}