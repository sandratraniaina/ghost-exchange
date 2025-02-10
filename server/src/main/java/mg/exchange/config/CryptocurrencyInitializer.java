package mg.exchange.config;

import mg.exchange.dto.SignInRequest;
import mg.exchange.models.Commission;
import mg.exchange.repository.CommissionRepository;
import mg.exchange.services.CommissionService;
import mg.exchange.services.CryptocurrencyService;
import mg.exchange.services.UserService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import mg.exchange.models.Cryptocurrency;
import mg.exchange.models.SellOrder;
import mg.exchange.repository.CryptocurrencyRepository;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class CryptocurrencyInitializer implements CommandLineRunner {

    private final CommissionService commissionService;
    private final CryptocurrencyService cryptocurrencyService;
    private final UserService userService;

    public CryptocurrencyInitializer(CommissionService commissionService, CryptocurrencyService cryptocurrencyService,
            UserService userService) {

        this.commissionService = commissionService;
        this.cryptocurrencyService = cryptocurrencyService;
        this.userService = userService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Check if the table is empty
        if (cryptocurrencyService.getAllCryptocurrencies().size() == 0) {
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
                    new Cryptocurrency(null, "Chainlink", "LIN", BigDecimal.valueOf(20)));
            for (Cryptocurrency cryptocurrency : cryptocurrencies) {
                cryptocurrencyService.createCryptocurrency(cryptocurrency);
            }
            System.out.println("Cryptocurrencies initialized successfully!");
        } else {
            System.out.println("Cryptocurrencies already exist. Skipping initialization.");
        }

        if (commissionService.getAllCommissions().size() == 0) {
            Commission commission = new Commission(null, new BigDecimal(0.13), new BigDecimal(0.15));
            commissionService.createCommission(commission);
        }

        if (userService.getAllUsers().size() == 0) {
            List<SignInRequest> users = Arrays.asList(
                    new SignInRequest("john", "john.doe@example.com", "password123"),
                    new SignInRequest("jane", "jane.smith@example.com", "securepwd456"),
                    new SignInRequest("alice", "alice.wonder@example.com", "alicepwd789"),
                    new SignInRequest("bob", "bob.builder@example.com", "bobpwd101"),
                    new SignInRequest("charlie", "charlie.brown@example.com", "charliepwd202"),
                    new SignInRequest("diana", "diana.prince@example.com", "dianapwd303"),
                    new SignInRequest("edward", "edward.elric@example.com", "edwardpwd404"),
                    new SignInRequest("fiona", "fiona.gallagher@example.com", "fionapwd505"),
                    new SignInRequest("george", "george.orwell@example.com", "georgepwd606"),
                    new SignInRequest("hannah", "hannah.montana@example.com", "hannahpwd707"));

            for (SignInRequest user : users) {
                try {
                    userService.checkUserAlreadyExist(user);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}