package mg.exchange.services;

import lombok.RequiredArgsConstructor;
import mg.exchange.models.Transaction;
import mg.exchange.models.User;
import mg.exchange.repository.TransactionRepository;
import mg.exchange.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.firebase.messaging.FirebaseMessagingException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FirestoreService firestoreService;

    @Autowired
    private FirebaseService firebaseService;


    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return transaction;
    }

    public Transaction createTransaction(Transaction transaction) {
        // Ensure the user exists
        User user = userService.getUserById(transaction.getUser().getId());
        transaction.setUser(user);
        Transaction savedTransaction = transactionRepository.save(transaction);
        firestoreService.syncToFirestore(savedTransaction);
        return savedTransaction;
    }

    public Transaction updateTransaction(Long id, Transaction transactionDetails) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Update user if provided
        if (transactionDetails.getUser() != null) {
            User user = userService.getUserById(transactionDetails.getUser().getId());
            transaction.setUser(user);
        }

        transaction.setAmount(transactionDetails.getAmount());
        transaction.setTransactionType(transactionDetails.getTransactionType());
        transaction.setTimestamp(transactionDetails.getTimestamp());
        transaction.setValidationTimestamp(transactionDetails.getValidationTimestamp());
        firestoreService.syncToFirestore(transaction);
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        firestoreService.deleteFromFirestore(transaction);
        transactionRepository.deleteById(id);
    }

    public Transaction validateTransaction(Long id) throws Exception {
        // Find the transaction or throw exception if not found
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        // Set validation timestamp
        transaction.setValidationTimestamp(LocalDateTime.now());
        
        // // Get the user's FCM token from the transaction
        // String userToken = userRepository.findById(transaction.getUser().getId())
        //         .orElseThrow(() -> new RuntimeException("User not found"));
                
        // if (userToken == null || userToken.isEmpty()) {
        //     throw new RuntimeException("User FCM token not found");
        // }
        
        // try {
        //     // Update the transaction first
        //     transaction = updateTransaction(id, transaction);
            
        //     // Build notification message
        //     String notificationTitle = "Transaction validée";
        //     String notificationBody = String.format(
        //         "Votre %s a été validé par l'admin avec succès. Transaction N°%d",
        //         transaction.getTransactionType().toString().toLowerCase(),
        //         transaction.getId()
        //     );
            
        //     // Send notification
        //     firebaseService.sendNotification(
        //         notificationTitle,
        //         notificationBody,
        //         userToken
        //     );
            
            return transaction;
            
        // } catch (FirebaseMessagingException e) {
        //     return transaction;
        // } 
        // catch (Exception e) {
        //     // For other exceptions, rollback by throwing
        //     throw new RuntimeException("Failed to validate transaction: " + e.getMessage(), e);
        // }
    }

    public List<Transaction> getHistoryTransaction(Long cryptoId, LocalDateTime min, LocalDateTime max, String type){
        return transactionRepository.getHistoryTransaction(cryptoId,min,max,type);
    }
}