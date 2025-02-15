package mg.exchange.services;

import java.io.FileInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;

import javax.annotation.PostConstruct;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import mg.exchange.models.*;
import mg.exchange.models.Transaction;
import mg.exchange.repository.*;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.messaging.FirebaseMessaging;

import mg.exchange.utils.FirestoreSyncable;
import mg.exchange.utils.FirestoreTimeConverter;

import org.slf4j.Logger;

@Service
public class FirestoreService {
    private static final Logger logger = LoggerFactory.getLogger(FirestoreService.class);

    private final Firestore db;

    @Autowired
    private CryptocurrencyRepository cryptocurrencyRepository;
    @Autowired
    private XeHistoryRepository xeHistoryRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private SellOrderRepository sellOrderRepository;
    @Autowired
    private CommissionRepository commissionRepository;
    @Autowired
    private CryptocurrencyWalletRepository cryptocurrencyWalletRepository;
    @Autowired
    private LedgerRepository ledgerRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    public FirestoreService(Firestore db) {
        this.db = db;
    }

    public <T extends FirestoreSyncable> void syncToFirestore(T entity) {
        try {
            db.collection(entity.getFirestoreCollectionName())
                    .document(String.valueOf(entity.getId()))
                    .set(entity.toFirestoreMap())
                    .get();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public <T extends FirestoreSyncable> void deleteFromFirestore(T entity) {
        try {
            db.collection(entity.getFirestoreCollectionName())
                    .document(String.valueOf(entity.getId()))
                    .delete()
                    .get();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete from Firestore", e);
        }
    }

    public void listenToFirestoreChanges() {
        listenToCollectionChanges("cryptocurrency", Cryptocurrency.class, cryptocurrencyRepository);
        listenToCollectionChanges("xe_history", XeHistory.class, xeHistoryRepository);
        listenToCollectionChanges("transaction", Transaction.class, transactionRepository);
        listenToCollectionChanges("sell_order", SellOrder.class, sellOrderRepository);
        listenToCollectionChanges("commission", Commission.class, commissionRepository);
        listenToCollectionChanges("cryptocurrency_wallet", CryptocurrencyWallet.class, cryptocurrencyWalletRepository);
        listenToCollectionChanges("ledger", Ledger.class, ledgerRepository);
        listenToCollectionChanges("account", User.class, userRepository);
    }

    private <T> void listenToCollectionChanges(String collectionName, Class<T> entityClass,
            JpaRepository<T, Long> repository) {
        db.collection(collectionName).addSnapshotListener((snapshots, e) -> {
            if (e != null) {
                logger.error("Listen failed for collection: " + collectionName, e);
                return;
            }

            for (DocumentChange dc : snapshots.getDocumentChanges()) {
                switch (dc.getType()) {
                    case ADDED:
                        handleDocumentAdded(dc.getDocument(), entityClass, repository);
                        break;
                    case MODIFIED:
                        handleDocumentModified(dc.getDocument(), entityClass, repository);
                        break;
                    case REMOVED:
                        handleDocumentRemoved(dc.getDocument(), repository);
                        break;
                }
            }
        });
    }

    private <T> void handleDocumentAdded(DocumentSnapshot document, Class<T> entityClass,
            JpaRepository<T, Long> repository) {
        try {
            Map<String, Object> data = document.getData();
            if (data != null) {
                Long id = Long.parseLong(document.getId());
                Optional<T> existingEntity = repository.findById(id);
                if (existingEntity.isPresent()) {
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.registerModule(new JavaTimeModule());
                    objectMapper.updateValue(existingEntity.get(), data);
                    repository.save(existingEntity.get());
                } else {
                    data.put("version", 0L);
                    if (data.containsKey("timestamp")) {
                        Object timestampObj = data.get("timestamp");
                        LocalDateTime localDateTime = convertToLocalDateTime(timestampObj);
                        data.put("timestamp", localDateTime);
                    }
                    if (data.containsKey("validationTimestamp")) {
                        Object validationTimestampObj = data.get("validationTimestamp");
                        LocalDateTime validationDateTime = convertToLocalDateTime(validationTimestampObj);
                        data.put("validationTimestamp", validationDateTime);
                    }

                    T entity = createEntityFromMap(data, entityClass);
                    repository.save(entity);
                }

                logger.info("Document processed successfully: " + document.getId());
            }
        } catch (Exception e) {
            logger.error("Failed to handle document added: " + document.getId() + " - " + e.getMessage());
        }
    }

    private LocalDateTime convertToLocalDateTime(Object timestampObj) {
        LocalDateTime result = null;
        try {
            if (timestampObj instanceof Timestamp) {
                logger.info("Converting Timestamp to LocalDateTime");
                result = FirestoreTimeConverter.toLocalDateTime((Timestamp) timestampObj);
            } else if (timestampObj instanceof String) {
                logger.info("Converting String to LocalDateTime");
                LocalDateTime parsed = LocalDateTime.parse((String) timestampObj);
                result = parsed.truncatedTo(ChronoUnit.MICROS);
            }
            if (result == null) {
                logger.error("Error of type timestamp", new IllegalArgumentException("Unknown timestamp format: " + timestampObj));
            }
        } catch (Exception e) {
            logger.error("Error converting timestamp: " + timestampObj, e);
        }
        return result;
    }

    private <T> T createEntityFromMap(Map<String, Object> data, Class<T> entityClass) throws Exception {
        logger.info("Data from Firestore: " + data);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        T entity = objectMapper.convertValue(data, entityClass);
        logger.info("Entity created: " + entity);
        return entity;
    }

    private <T> void handleDocumentModified(DocumentSnapshot document, Class<T> entityClass,
            JpaRepository<T, Long> repository) {
        try {
            Map<String, Object> data = document.getData();

            if (data != null) {
                if (data.containsKey("timestamp")) {
                    Object timestampObj = data.get("timestamp");
                    LocalDateTime localDateTime = convertToLocalDateTime(timestampObj);
                    data.put("timestamp", localDateTime);
                }
                if (data.containsKey("validationTimestamp")) {
                    Object validationTimestampObj = data.get("validationTimestamp");
                    LocalDateTime validationDateTime = convertToLocalDateTime(validationTimestampObj);
                    data.put("validationTimestamp", validationDateTime);
                }
            }
            T entity = createEntityFromMap(data, entityClass);
            repository.save(entity);
            logger.info("Document modified: " + document.getId());
        } catch (Exception e) {
            logger.error("Failed to handle document modified: " + document.getId(), e);
        }
    }

    private <T> void handleDocumentRemoved(DocumentSnapshot document, JpaRepository<T, Long> repository) {
        try {
            Long id = document.getLong("id");
            repository.deleteById(id);
            logger.info("Document removed: " + document.getId());
        } catch (Exception e) {
            logger.error("Failed to handle document removed: " + document.getId(), e);
        }
    }
}