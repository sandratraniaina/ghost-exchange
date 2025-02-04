package mg.exchange.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Entity
@Table(name = "commission")
public class Commission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sales_commission", nullable = false, precision = 10, scale = 2)
    private BigDecimal salesCommission;

    @Column(name = "purchases_commission", nullable = false, precision = 10, scale = 2)
    private BigDecimal purchasesCommission;
}