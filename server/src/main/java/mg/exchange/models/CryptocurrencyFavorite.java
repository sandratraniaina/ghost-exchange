package mg.exchange.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.exchange.utils.FirestoreSyncable;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@Entity
@Table(name = "cryptocurrency_favorite")
public class CryptocurrencyFavorite implements FirestoreSyncable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private User account;

    @ManyToOne
    @JoinColumn(name = "cryptocurrency_id", nullable = false)
    private Cryptocurrency cryptocurrency;

    @Column(name = "add_timestamp")
    private LocalDateTime addTimestamp;

    @Override
    public String getFirestoreCollectionName() {
        return "cryptocurrency_favorite";
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public Map<String, Object> toFirestoreMap() {
        Map<String, Object> map = new HashMap<>();

        if (id != null) map.put("id", id);
        if (account != null) map.put("account", account.toFirestoreMap());
        if (cryptocurrency != null) map.put("cryptocurrency", cryptocurrency.toFirestoreMap());
        if (addTimestamp != null) map.put("addTimestamp", addTimestamp.toString());

        return map;
    }
}