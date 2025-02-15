package mg.exchange.services;

import mg.exchange.models.Cryptocurrency;
import mg.exchange.repository.CryptocurrencyRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CryptocurrencyService {

    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final FirestoreService firestoreService;

    @Autowired
    public CryptocurrencyService(CryptocurrencyRepository cryptocurrencyRepository, FirestoreService firestoreService) {
        this.cryptocurrencyRepository = cryptocurrencyRepository;
        this.firestoreService = firestoreService;
    }

    

    public List<Cryptocurrency> getAllCryptocurrencies() {
        return cryptocurrencyRepository.findAll();
    }

    public Optional<Cryptocurrency> getCryptocurrencyById(Long id) {
        return cryptocurrencyRepository.findById(id);
    }

    public Cryptocurrency createCryptocurrency(Cryptocurrency cryptocurrency) {
        Cryptocurrency cryptocurrencySaved = cryptocurrencyRepository.save(cryptocurrency);
        firestoreService.syncToFirestore(cryptocurrencySaved);
        return cryptocurrencySaved;
    }

    public Cryptocurrency updateCryptocurrency(Long id, Cryptocurrency cryptocurrencyDetails) {
        Cryptocurrency cryptocurrency = cryptocurrencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));
        cryptocurrency.setName(cryptocurrencyDetails.getName());
        cryptocurrency.setSymbol(cryptocurrencyDetails.getSymbol());
        cryptocurrency.setFiatPrice(cryptocurrencyDetails.getFiatPrice());
        firestoreService.syncToFirestore(cryptocurrency);
        return cryptocurrencyRepository.save(cryptocurrency);
    }

    public void deleteCryptocurrency(Long id) {
        Cryptocurrency cryptocurrencyToDelete = cryptocurrencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));
        cryptocurrencyRepository.deleteById(id);
        firestoreService.deleteFromFirestore(cryptocurrencyToDelete);
    }
}