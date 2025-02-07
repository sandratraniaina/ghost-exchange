package mg.exchange.services;

import mg.exchange.models.CryptocurrencyWallet;
import mg.exchange.models.User;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.repository.CryptocurrencyWalletRepository;
import mg.exchange.repository.UserRepository;
import mg.exchange.repository.CryptocurrencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CryptocurrencyWalletService {

    private final CryptocurrencyWalletRepository cryptocurrencyWalletRepository;
    private final UserRepository userRepository;
    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final FirestoreService firestoreService;

    public List<CryptocurrencyWallet> getAllWallets() {
        return cryptocurrencyWalletRepository.findAll();
    }

    public CryptocurrencyWallet getWalletById(Long id) {
        return cryptocurrencyWalletRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CryptocurrencyWallet not found with id: " + id));
    }

    public CryptocurrencyWallet createWallet(CryptocurrencyWallet wallet) {
        // Ensure the user exists
        User user = userRepository.findById(wallet.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure the cryptocurrency exists
        Cryptocurrency cryptocurrency = cryptocurrencyRepository.findById(wallet.getCryptocurrency().getId())
                .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));

        wallet.setUser(user);
        wallet.setCryptocurrency(cryptocurrency);
        CryptocurrencyWallet cryptocurrencyWalletSaved = cryptocurrencyWalletRepository.save(wallet);
        firestoreService.syncToFirestore(cryptocurrencyWalletSaved);
        return cryptocurrencyWalletSaved;
    }

    public CryptocurrencyWallet updateWallet(Long id, CryptocurrencyWallet walletDetails) {
        CryptocurrencyWallet wallet = cryptocurrencyWalletRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // Update user if provided
        if (walletDetails.getUser() != null) {
            User user = userRepository.findById(walletDetails.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            wallet.setUser(user);
        }

        // Update cryptocurrency if provided
        if (walletDetails.getCryptocurrency() != null) {
            Cryptocurrency cryptocurrency = cryptocurrencyRepository.findById(walletDetails.getCryptocurrency().getId())
                    .orElseThrow(() -> new RuntimeException("Cryptocurrency not found"));
            wallet.setCryptocurrency(cryptocurrency);
        }

        wallet.setBalance(walletDetails.getBalance());
        firestoreService.syncToFirestore(wallet);
        return cryptocurrencyWalletRepository.save(wallet);
    }

    public void deleteWallet(Long id) {
        CryptocurrencyWallet wallet = getWalletById(id);
        cryptocurrencyWalletRepository.deleteById(id);
        firestoreService.deleteFromFirestore(wallet);
    }

    public List<CryptocurrencyWallet> getWalletByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cryptocurrencyWalletRepository.findByUserId(userId);
    }

    public Optional<CryptocurrencyWallet> getWalletByUserIdAndCrypotCurrencyId(Long userId, Long cryptoId) {
        return cryptocurrencyWalletRepository.findByUuserIDAndCryptocurrencyId(cryptoId, userId);
    }
}