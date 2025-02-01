package mg.exchange.models;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Entity
@Table(name = "cryptocurrency")
public class Cryptocurrency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "symbol", nullable = false, length = 3)
    private String symbol;

    @Column(name = "fiat_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal fiatPrice;
}