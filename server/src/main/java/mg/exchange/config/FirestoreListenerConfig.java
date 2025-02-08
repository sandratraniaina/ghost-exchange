package mg.exchange.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;

import lombok.RequiredArgsConstructor;
import mg.exchange.services.FirestoreService;

@Configuration
@RequiredArgsConstructor
public class FirestoreListenerConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(FirestoreListenerConfig.class);
    
    private final FirestoreService firestoreService;
    
    @EventListener(ApplicationReadyEvent.class)
    public void initializeFirestoreListeners() {
        try {
            logger.info("Initializing Firestore listeners...");
            firestoreService.listenToFirestoreChanges();
            logger.info("Firestore listeners initialized successfully");
        } catch (Exception e) {
            logger.error("Failed to initialize Firestore listeners", e);
            throw new RuntimeException("Failed to initialize Firestore listeners", e);
        }
    }
}