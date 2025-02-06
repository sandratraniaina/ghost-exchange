package mg.exchange.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.exchange.models.Ledger;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCryptoTransaction {
    private Ledger ledger;
    private String typeTransaction;
}
