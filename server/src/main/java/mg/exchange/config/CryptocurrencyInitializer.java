package mg.exchange.config;

import mg.exchange.models.Commission;
import mg.exchange.repository.CommissionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import mg.exchange.models.Cryptocurrency;
import mg.exchange.repository.CryptocurrencyRepository;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class CryptocurrencyInitializer implements CommandLineRunner {

    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final CommissionRepository commissionRepository;

    public CryptocurrencyInitializer(CryptocurrencyRepository cryptocurrencyRepository, CommissionRepository commissionRepository) {
        this.cryptocurrencyRepository = cryptocurrencyRepository;
        this.commissionRepository = commissionRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Check if the table is empty
        if (cryptocurrencyRepository.count() == 0) {
            List<Cryptocurrency> cryptocurrencies = Arrays.asList(
                    new Cryptocurrency(null, "Bitcoin", "BTC", BigDecimal.valueOf(42000)),
                    new Cryptocurrency(null, "Ethereum", "ETH", BigDecimal.valueOf(3000)),
                    new Cryptocurrency(null, "Binance Coin", "BNB", BigDecimal.valueOf(450)),
                    new Cryptocurrency(null, "Cardano", "ADA", BigDecimal.valueOf(1.20)),
                    new Cryptocurrency(null, "Solana", "SOL", BigDecimal.valueOf(100)),
                    new Cryptocurrency(null, "Ripple", "XRP", BigDecimal.valueOf(0.80)),
                    new Cryptocurrency(null, "Polkadot", "DOT", BigDecimal.valueOf(15)),
                    new Cryptocurrency(null, "Dogecoin", "DOG", BigDecimal.valueOf(0.15)),
                    new Cryptocurrency(null, "Litecoin", "LTC", BigDecimal.valueOf(120)),
                    new Cryptocurrency(null, "Chainlink", "LIN", BigDecimal.valueOf(20))
            );
            cryptocurrencyRepository.saveAll(cryptocurrencies);
            System.out.println("Cryptocurrencies initialized successfully!");
        } else {
            System.out.println("Cryptocurrencies already exist. Skipping initialization.");
        }
        if (commissionRepository.count() == 0) {
            commissionRepository.save(new Commission(1L, new BigDecimal(0.13), new BigDecimal(0.15)));
            System.out.println("Commissions initialized successfully!");
        } else {
            System.out.println("Commissions already exist. Skipping initialization.");
        }
    }
}