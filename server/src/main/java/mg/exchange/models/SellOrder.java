package mg.exchange.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.exchange.utils.FirestoreSyncable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@Entity
@Table(name = "sell_order")
public class SellOrder implements FirestoreSyncable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne
    @JoinColumn(name = "cryptocurrency_id", nullable = false)
    private Cryptocurrency cryptocurrency;

    @Column(nullable = false, precision = 18, scale = 12)
    private BigDecimal amount;

    @Column(name = "fiat_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal fiatPrice;

    @Column(nullable = false, columnDefinition = "timestamp DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime timestamp;

    @Column(name = "is_open", nullable = false, columnDefinition = "boolean DEFAULT true")
    private Boolean isOpen;

    @Override
    public String getFirestoreCollectionName() {
        return "sell_order";
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public Map<String, Object> toFirestoreMap() {
        Map<String, Object> map = new HashMap<>();
        
        if (id != null) map.put("id", id);
        if (seller != null) map.put("seller", seller.toFirestoreMap());
        if (cryptocurrency != null) map.put("cryptocurrency", cryptocurrency.toFirestoreMap());
        if (amount != null) map.put("amount", amount);
        if (fiatPrice != null) map.put("fiatPrice", fiatPrice);
        if (timestamp != null) map.put("timestamp", timestamp.toString());
        if (isOpen != null) map.put("isOpen", isOpen);
        
        return map;
    }
}