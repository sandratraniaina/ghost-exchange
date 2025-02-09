package mg.exchange.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.exchange.utils.FirestoreSyncable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ledger")
public class Ledger implements FirestoreSyncable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sell_order_id", nullable = false)
    private SellOrder sellOrder;

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = true)
    private User buyer;

    @Column(nullable = false, columnDefinition = "timestamp DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime timestamp;

    @Column(name = "sales_commission", nullable = false, precision = 10, scale = 2)
    private BigDecimal salesCommission;

    @Column(name = "purchases_commission", nullable = false, precision = 10, scale = 2)
    private BigDecimal purchasesCommission;

    @Override
    public String getFirestoreCollectionName() {
        return "ledger";
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public Map<String, Object> toFirestoreMap() {
        Map<String, Object> map = new HashMap<>();

        if (id != null)
            map.put("id", id);
        if (sellOrder != null)
            map.put("sellOrder", sellOrder.toFirestoreMap());
        if (buyer != null)
            map.put("buyer", buyer.toFirestoreMap());
        if (timestamp != null)
            map.put("timestamp", timestamp.toString());
        if (salesCommission != null)
            map.put("salesCommission", salesCommission);
        if (purchasesCommission != null)
            map.put("purchasesCommission", purchasesCommission);

        return map;
    }
}