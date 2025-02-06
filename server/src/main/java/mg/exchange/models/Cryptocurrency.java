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
@Table(name = "cryptocurrency")
public class Cryptocurrency implements FirestoreSyncable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "symbol", nullable = false, length = 3)
    private String symbol;

    @Column(name = "fiat_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal fiatPrice;

    @Override
    public String getFirestoreCollectionName() {
        return "cryptocurrency";
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
        if (name != null)
            map.put("name", name);
        if (symbol != null)
            map.put("symbol", symbol);
        if (fiatPrice != null)
            map.put("fiatPrice", fiatPrice);

        return map;
    }
}
