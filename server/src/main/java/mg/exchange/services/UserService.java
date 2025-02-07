package mg.exchange.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import mg.exchange.dto.SignInRequest;
import mg.exchange.dto.UserTransactionSummary;
import mg.exchange.models.AccountRole;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.models.CryptocurrencyFavorite;
import mg.exchange.models.User;
import mg.exchange.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FirestoreService firestoreService;

    @Autowired
    private CryptocurrencyFavoriteService cryptocurrencyFavoriteService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found for ID : " + id));
    }

    public User createUser(User user) {
        User savedUser = userRepository.save(user);
        firestoreService.syncToFirestore(savedUser);
        return savedUser;
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFiatBalance(userDetails.getFiatBalance());
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setAccountRole(userDetails.getAccountRole());
        firestoreService.syncToFirestore(user);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) throws Exception {
        User userToDelete = userRepository.findById(id)
                .orElseThrow(() -> new Exception("Utilisateur non trouvé avec l'id: " + id));
        userRepository.deleteById(id);
        firestoreService.deleteFromFirestore(userToDelete);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User convertJsonToUser(String json) {
        try {
            return objectMapper.readValue(json, User.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert JSON to User", e);
        }
    }

    public User checkUserAlreadyExist(SignInRequest user) {
        Optional<User> existingUser = getUserByUsername(user.getUsername());
        return existingUser.orElseGet(() -> createUser(
                new User(null, new BigDecimal("0"), user.getUsername(), user.getEmail(), AccountRole.CLIENT,user.getPwd())));
    }

    public List<UserTransactionSummary> getUserTransactionSummary(LocalDateTime min, LocalDateTime max) {
        return userRepository.getUserTransactionSummary(min, max);
    }

    public List<Cryptocurrency> getFavoriteCryptocurrency(User u){
        List<CryptocurrencyFavorite> favorites = cryptocurrencyFavoriteService.getFavoritesByAccountId(u.getId());
        List<Cryptocurrency> results = new ArrayList<>();
        for(CryptocurrencyFavorite fav : favorites){
            results.add(fav.getCryptocurrency());
        }
        return results;
    }

}