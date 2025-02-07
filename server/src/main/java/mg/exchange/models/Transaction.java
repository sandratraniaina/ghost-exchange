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
@Table(name = "transaction")
public class Transaction implements FirestoreSyncable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime timestamp;

    @Column(name = "validation_timestamp")
    private LocalDateTime validationTimestamp;

    @Override
    public String getFirestoreCollectionName() {
        return "transaction";
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public Map<String, Object> toFirestoreMap() {
        Map<String, Object> map = new HashMap<>();

        if (id != null) map.put("id", id);
        if (user != null) map.put("user", user.toFirestoreMap());
        if (amount != null) map.put("amount", amount);
        if (transactionType != null) map.put("transactionType", transactionType.name());
        if (timestamp != null) map.put("timestamp", timestamp.toString());
        if (validationTimestamp != null) map.put("validationTimestamp", validationTimestamp.toString());

        return map;
    }
}