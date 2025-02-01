package mg.exchange.services;

import lombok.RequiredArgsConstructor;
import mg.exchange.models.Transaction;
import mg.exchange.models.User;
import mg.exchange.repository.TransactionRepository;
import mg.exchange.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    @Autowired
    private UserService userService;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public Transaction createTransaction(Transaction transaction) {
        // Ensure the user exists
        User user = userService.getUserById(transaction.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long id, Transaction transactionDetails) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Update user if provided
        if (transactionDetails.getUser() != null) {
            User user = userService.getUserById(transactionDetails.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            transaction.setUser(user);
        }

        transaction.setAmount(transactionDetails.getAmount());
        transaction.setTransactionType(transactionDetails.getTransactionType());
        transaction.setTimestamp(transactionDetails.getTimestamp());
        transaction.setValidationTimestamp(transactionDetails.getValidationTimestamp());
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transactionRepository.deleteById(id);
    }

    public Transaction validateTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transaction.setValidationTimestamp(LocalDate.now().atStartOfDay());
        updateTransaction(id, transaction);
        return transaction;
    }
}