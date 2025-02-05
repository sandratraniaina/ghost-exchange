package mg.exchange.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.exchange.models.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTransactionSummary {
    private User user;
    private BigDecimal totalAchat;
    private BigDecimal totalVente;
    private BigDecimal valeurPortefeuille;
}