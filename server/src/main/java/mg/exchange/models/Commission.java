package mg.exchange.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.exchange.utils.FirestoreSyncable;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "commission")
public class Commission implements FirestoreSyncable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sales_commission", nullable = false, precision = 10, scale = 2)
    private BigDecimal salesCommission;

    @Column(name = "purchases_commission", nullable = false, precision = 10, scale = 2)
    private BigDecimal purchasesCommission;

    @Override
    public String getFirestoreCollectionName() {
        return "commission";
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
        if (salesCommission != null)
            map.put("salesCommission", salesCommission);
        if (purchasesCommission != null)
            map.put("purchasesCommission", purchasesCommission);

        return map;
    }
}
