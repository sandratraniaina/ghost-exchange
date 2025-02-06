package mg.exchange.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.exchange.utils.FirestoreSyncable;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@Entity
@Table(name = "cryptocurrency_wallet")
public class CryptocurrencyWallet implements FirestoreSyncable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "cryptocurrency_id", nullable = false)
    private Cryptocurrency cryptocurrency;

    @Column(nullable = false, precision = 18, scale = 2, columnDefinition = "numeric(18, 2) DEFAULT 0")
    private BigDecimal balance;

    @Override
    public String getFirestoreCollectionName() {
        return "cryptocurrency_wallet";
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
public Map<String, Object> toFirestoreMap() {
    Map<String, Object> map = new HashMap<>();

    if (id != null) {
        map.put("id", id);
    }
    
    if (user != null) {
        map.put("user", user.toFirestoreMap());
    }
    
    if (cryptocurrency != null) {
        map.put("cryptocurrency", cryptocurrency.toFirestoreMap());
    }
    
    if (balance != null) {
        map.put("balance", balance);
    }

    return map;
}
}
