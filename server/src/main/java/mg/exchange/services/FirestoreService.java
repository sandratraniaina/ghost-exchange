package mg.exchange.services;

import java.io.FileInputStream;
import java.io.IOException;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

import mg.exchange.utils.FirestoreSyncable;

@Service
public class FirestoreService {
    private Firestore db;
    @Value("${firebase.serviceAccountKey}")
    private String serviceAccountKey;

    @PostConstruct
    public void initialize() {
        try {
            FileInputStream serviceAccount = new FileInputStream(serviceAccountKey);
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);
            db = FirestoreClient.getFirestore();
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

}