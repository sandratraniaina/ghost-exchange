package mg.exchange.services;

import org.springframework.stereotype.Service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.CreateRequest;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

import lombok.RequiredArgsConstructor;
import mg.exchange.models.User;

@Service
@RequiredArgsConstructor
public class FirebaseService {

    private final FirebaseMessaging firebaseMessaging;
    private final FirebaseAuth firebaseAuth;

    public FirebaseAuth getFirebaseAuth() {
        return firebaseAuth;
    }

    public String insertUser(User u) throws Exception {
        CreateRequest request = new CreateRequest()
                .setEmail(u.getEmail())
                .setEmailVerified(true)
                .setPassword(u.getPassword()) 
                .setDisplayName(u.getUsername())
                .setDisabled(false);
        
        UserRecord userRecord = firebaseAuth.createUser(request);
        return userRecord.getUid();
    }

    public String sendNotification(String title, String body, String token) throws FirebaseMessagingException {
        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        Message message = Message.builder()
                .setToken(token)
                .setNotification(notification)
                .build();

        return firebaseMessaging.send(message);
    }
}
