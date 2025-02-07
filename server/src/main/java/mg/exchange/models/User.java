package mg.exchange.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.exchange.utils.FirestoreSyncable;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "account")
public class User implements FirestoreSyncable {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fiat_balance", nullable = false, precision = 18, scale = 2)
    private BigDecimal fiatBalance;

    @Column(name = "username", nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_role", nullable = false)
    private AccountRole accountRole;
    
    @Column(name = "pwd", nullable = false, length = 256)
    @JsonIgnore
    private String password;

    // @Column(name = "fcm_token")
    // private String fcmToken;
    
    
    @Override
    public String getFirestoreCollectionName() {
        return "account";
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public Map<String, Object> toFirestoreMap() {
        Map<String, Object> map = new HashMap<>();
        
        // Add fields only if they are not null
        if (id != null) map.put("id", id);
        if (fiatBalance != null) map.put("fiatBalance", fiatBalance);
        if (username != null) map.put("username", username);
        if (email != null) map.put("email", email);
        if (accountRole != null) map.put("accountRole", accountRole.name());
        // if (fcmToken != null) map.put("fcmToken", fcmToken);
        
        return map;
    }
}