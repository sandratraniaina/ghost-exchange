package mg.exchange.services;

import lombok.RequiredArgsConstructor;
import mg.exchange.models.Transaction;
import mg.exchange.models.TransactionType;
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
    @Autowired
    private CryptocurrencyWalletService cryptocurrencyWalletService;


    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return transaction;
    }

    public Transaction createTransaction(Transaction transaction) {
        Transaction savedTransaction = null;

        User user = userService.getUserById(transaction.getUser().getId());
        transaction.setUser(user);
        if (transaction.getTransactionType() == TransactionType.WITHDRAW) {
            if (user.getFiatBalance().doubleValue() < transaction.getAmount().doubleValue()) {
                throw new RuntimeException("Solde insuffisant");
            }
        }
        savedTransaction = transactionRepository.save(transaction);
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

        //Udapte the balance of the user
        if (transaction.getTransactionType() == TransactionType.DEPOSIT) {
            User user = transaction.getUser();
            user.setFiatBalance(user.getFiatBalance().add(transaction.getAmount()));
            userRepository.save(user);
        } else if (transaction.getTransactionType() == TransactionType.WITHDRAW) {
            User user = transaction.getUser();
            user.setFiatBalance(user.getFiatBalance().subtract(transaction.getAmount()));
            userRepository.save(user);
        }
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
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transaction.setValidationTimestamp(LocalDateTime.now());
        String userToken = transaction.getUser().getFcmToken();
        transaction = updateTransaction(id, transaction);
        if (userToken != null && !userToken.isEmpty()) {
            try {
                String notificationTitle = "Transaction validée";
                String notificationBody = String.format(
                        "Votre %s a été validé par l'admin avec succès. Transaction N°%d",
                        transaction.getTransactionType().toString().toLowerCase(),
                        transaction.getId()
                );

                firebaseService.sendNotification(
                        notificationTitle,
                        notificationBody,
                        userToken
                );
                return transaction;
            } catch (FirebaseMessagingException e) {
                e.printStackTrace();
            }
        }
        return transaction;
    }

    public List<Transaction> getHistoryTransaction(Long cryptoId, LocalDateTime min, LocalDateTime max, String type) {
        return transactionRepository.getHistoryTransaction(cryptoId, min, max, type);
    }
}