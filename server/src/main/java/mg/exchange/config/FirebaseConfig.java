package mg.exchange.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.messaging.FirebaseMessaging;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import mg.exchange.services.FirestoreService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);
    
    @Value("${firebase.config.path}")
    private String configPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        checkFirestoreConnectivity();
        
        if (FirebaseApp.getApps().isEmpty()) {
            FileInputStream serviceAccount = new FileInputStream(configPath);
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp app = FirebaseApp.initializeApp(options);
            logger.info("Firebase Application has been initialized");
            return app;
        } else {
            logger.info("Firebase Application is already initialized");
            return FirebaseApp.getInstance();
        }
    }

    private void checkFirestoreConnectivity() {
        try {
            InetAddress.getAllByName("firestore.googleapis.com");
            logger.info("Successfully resolved Firestore host");
        } catch (UnknownHostException e) {
            logger.error("Failed to resolve Firestore host. Please check your network connection and DNS settings", e);
            throw new RuntimeException("Unable to connect to Firestore. Network connectivity issue detected", e);
        }
    }

    @Bean
    public FirebaseMessaging firebaseMessaging(FirebaseApp firebaseApp) {
        return FirebaseMessaging.getInstance(firebaseApp);
    }

    @Bean
    public Firestore firestore(FirebaseApp firebaseApp) {
        return FirestoreClient.getFirestore(firebaseApp);
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}
