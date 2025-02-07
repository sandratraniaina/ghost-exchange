package mg.exchange.services;


import lombok.RequiredArgsConstructor;
import mg.exchange.models.CryptocurrencyFavorite;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.models.User;
import mg.exchange.repository.CryptocurrencyFavoriteRepository;
import mg.exchange.repository.CryptocurrencyRepository;
import mg.exchange.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CryptocurrencyFavoriteService {

    private final CryptocurrencyFavoriteRepository cryptocurrencyFavoriteRepository;
    private final UserRepository userRepository;
    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final FirestoreService firestoreService;

    public List<CryptocurrencyFavorite> getAllFavorites() {
        return cryptocurrencyFavoriteRepository.findAll();
    }

    public Optional<CryptocurrencyFavorite> getFavoriteById(Long id) {
        return cryptocurrencyFavoriteRepository.findById(id);
    }

    public List<CryptocurrencyFavorite> getFavoritesByAccountId(Long accountId) {
        return cryptocurrencyFavoriteRepository.findByAccountId(accountId);
    }

    public Optional<CryptocurrencyFavorite> getFavoriteByAccountIdAndCryptocurrencyId(Long accountId, Long cryptoId) {
        return cryptocurrencyFavoriteRepository.findByAccountIdAndCryptocurrencyId(accountId, cryptoId);
    }

    public CryptocurrencyFavorite createFavorite(CryptocurrencyFavorite favorite) {
        User account = userRepository.findById(favorite.getAccount().getId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Cryptocurrency cryptocurrency = cryptocurrencyRepository.findById(favorite.getCryptocurrency().getId())
                .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));

        favorite.setAccount(account);
        favorite.setCryptocurrency(cryptocurrency);

        CryptocurrencyFavorite savedFavorite = cryptocurrencyFavoriteRepository.save(favorite);
        firestoreService.syncToFirestore(savedFavorite);
        return savedFavorite;
    }

    public CryptocurrencyFavorite updateFavorite(Long id, CryptocurrencyFavorite favoriteDetails) {
        CryptocurrencyFavorite favorite = cryptocurrencyFavoriteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CryptocurrencyFavorite not found"));

        if (favoriteDetails.getAccount() != null) {
            User account = userRepository.findById(favoriteDetails.getAccount().getId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            favorite.setAccount(account);
        }

        if (favoriteDetails.getCryptocurrency() != null) {
            Cryptocurrency cryptocurrency = cryptocurrencyRepository.findById(favoriteDetails.getCryptocurrency().getId())
                    .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));
            favorite.setCryptocurrency(cryptocurrency);
        }

        favorite.setAddTimestamp(favoriteDetails.getAddTimestamp());
        firestoreService.syncToFirestore(favorite);
        return cryptocurrencyFavoriteRepository.save(favorite);
    }

    public void deleteFavorite(Long id) {
        CryptocurrencyFavorite favorite = cryptocurrencyFavoriteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CryptocurrencyFavorite not found"));
        firestoreService.deleteFromFirestore(favorite);
        cryptocurrencyFavoriteRepository.deleteById(id);
    }
}