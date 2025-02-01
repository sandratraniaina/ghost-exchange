package mg.exchange.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Entity
@Table(name = "cryptocurrency_wallet")
public class CryptocurrencyWallet {

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
}