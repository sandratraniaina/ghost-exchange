package mg.exchange.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import mg.exchange.dto.SignInRequest;
import mg.exchange.models.AccountRole;
import mg.exchange.models.User;
import mg.exchange.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFiatBalance(userDetails.getFiatBalance());
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
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
        return existingUser.orElseGet(() -> createUser(new User(null, new BigDecimal("0"), user.getUsername(), user.getEmail(), AccountRole.CLIENT)));
    }

}