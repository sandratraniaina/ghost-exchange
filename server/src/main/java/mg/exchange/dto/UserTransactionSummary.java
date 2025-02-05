package mg.exchange.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTransactionSummary {
    private String username;
    private BigDecimal totalAchat;
    private BigDecimal totalVente;
    private BigDecimal valeurPortefeuille;
}