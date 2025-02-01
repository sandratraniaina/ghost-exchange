package mg.exchange.services;

import lombok.RequiredArgsConstructor;
import mg.exchange.models.Transaction;
import mg.exchange.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long id, Transaction transactionDetails) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transaction.setUserId(transactionDetails.getUserId());
        transaction.setAmount(transactionDetails.getAmount());
        transaction.setTransactionType(transactionDetails.getTransactionType());
        transaction.setTimestamp(transactionDetails.getTimestamp());
        transaction.setValidationTimestamp(transactionDetails.getValidationTimestamp());
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
