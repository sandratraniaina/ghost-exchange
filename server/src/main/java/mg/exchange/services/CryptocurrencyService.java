package mg.exchange.services;

import mg.exchange.models.Cryptocurrency;
import mg.exchange.repository.CryptocurrencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CryptocurrencyService {

    private final CryptocurrencyRepository cryptocurrencyRepository;

    public List<Cryptocurrency> getAllCryptocurrencies() {
        return cryptocurrencyRepository.findAll();
    }

    public Optional<Cryptocurrency> getCryptocurrencyById(Long id) {
        return cryptocurrencyRepository.findById(id);
    }

    public Cryptocurrency createCryptocurrency(Cryptocurrency cryptocurrency) {
        return cryptocurrencyRepository.save(cryptocurrency);
    }

    public Cryptocurrency updateCryptocurrency(Long id, Cryptocurrency cryptocurrencyDetails) {
        Cryptocurrency cryptocurrency = cryptocurrencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));
        cryptocurrency.setName(cryptocurrencyDetails.getName());
        cryptocurrency.setSymbol(cryptocurrencyDetails.getSymbol());
        cryptocurrency.setFiatPrice(cryptocurrencyDetails.getFiatPrice());
        return cryptocurrencyRepository.save(cryptocurrency);
    }

    public void deleteCryptocurrency(Long id) {
        cryptocurrencyRepository.deleteById(id);
    }
}