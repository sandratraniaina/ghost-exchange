package mg.exchange.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.exchange.utils.FirestoreSyncable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Data
@NoArgsConstructor
@Entity
@Table(name = "xe_history")
public class XeHistory implements FirestoreSyncable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cryptocurrency_id", nullable = false)
    private Cryptocurrency cryptocurrency;

    @Column(name = "fiat_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal fiatPrice;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Override
    public String getFirestoreCollectionName() {
        return "xe_history";
    }

    @Version
    @Column(nullable = false)
    private Long version = 0L;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public Map<String, Object> toFirestoreMap() {
        Map<String, Object> map = new HashMap<>();
        
        if (id != null) map.put("id", id);
        if (cryptocurrency != null) map.put("cryptocurrency", cryptocurrency.toFirestoreMap());
        if (fiatPrice != null) map.put("fiatPrice", fiatPrice);
        if (timestamp != null) map.put("timestamp", timestamp.toString());
        
        return map;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof XeHistory)) return false;
        XeHistory xeHistory = (XeHistory) o;
        return Objects.equals(id, xeHistory.id) &&
               Objects.equals(timestamp, xeHistory.timestamp) &&
               Objects.equals(fiatPrice, xeHistory.fiatPrice) &&
               Objects.equals(version, xeHistory.version);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, timestamp, fiatPrice, version);
    }
}