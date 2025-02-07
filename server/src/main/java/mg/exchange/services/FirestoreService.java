package mg.exchange.services;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Map;

import javax.annotation.PostConstruct;

import mg.exchange.models.*;
import mg.exchange.models.Transaction;
import mg.exchange.repository.*;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

import mg.exchange.utils.FirestoreSyncable;
import mg.exchange.utils.FirestoreTimeConverter;

import org.slf4j.Logger;

@Service
public class FirestoreService {
    private static final Logger logger = LoggerFactory.getLogger(FirestoreService.class);

    private Firestore db;
    @Value("${firebase.serviceAccountKey}")
    private String serviceAccountKey;

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

    @PostConstruct
    public void initialize() {
        try {
            FileInputStream serviceAccount = new FileInputStream(serviceAccountKey);
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);
            db = FirestoreClient.getFirestore();
            listenToFirestoreChanges();
        } catch (IOException e) {
            e.printStackTrace();
        }
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

    private void listenToFirestoreChanges() {
        listenToCollectionChanges("cryptocurrency", Cryptocurrency.class, cryptocurrencyRepository);
        listenToCollectionChanges("xe_history", XeHistory.class, xeHistoryRepository);
        listenToCollectionChanges("transaction", Transaction.class, transactionRepository);
        listenToCollectionChanges("sell_order", SellOrder.class, sellOrderRepository);
        listenToCollectionChanges("commission", Commission.class, commissionRepository);
        listenToCollectionChanges("cryptocurrency_wallet", CryptocurrencyWallet.class, cryptocurrencyWalletRepository);
        listenToCollectionChanges("ledger", Ledger.class, ledgerRepository);
        listenToCollectionChanges("user", User.class, userRepository);
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
            if (data != null && data.containsKey("timestamp")) {
                Timestamp timestamp = document.get("timestamp", Timestamp.class);
                data.put("timestamp", FirestoreTimeConverter.toLocalDateTime(timestamp));
            }
            if (data != null && data.containsKey("validationTimestamp")) {
                Timestamp validationTimestamp = document.get("validationTimestamp", Timestamp.class);
                data.put("validationTimestamp", FirestoreTimeConverter.toLocalDateTime(validationTimestamp));
            }
            // Créer l'objet avec les données converties
            T entity = document.toObject(entityClass);
            repository.save(entity);
            logger.info("Document added: " + document.getId());
        } catch (Exception e) {
            logger.error("Failed to handle document added: " + document.getId(), e);
        }
    }

    private <T> void handleDocumentModified(DocumentSnapshot document, Class<T> entityClass,
            JpaRepository<T, Long> repository) {
        try {
            Map<String, Object> data = document.getData();
            if (data != null && data.containsKey("timestamp")) {
                Timestamp timestamp = document.get("timestamp", Timestamp.class);
                data.put("timestamp", FirestoreTimeConverter.toLocalDateTime(timestamp));
            }
            if (data != null && data.containsKey("validationTimestamp")) {
                Timestamp validationTimestamp = document.get("validationTimestamp", Timestamp.class);
                data.put("validationTimestamp", FirestoreTimeConverter.toLocalDateTime(validationTimestamp));
            }
            // Créer l'objet avec les données converties
            T entity = document.toObject(entityClass);
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