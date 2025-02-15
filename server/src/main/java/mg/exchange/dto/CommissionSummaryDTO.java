package mg.exchange.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommissionSummaryDTO {
    private Long cryptocurrencyId;
    private BigDecimal totalSalesCommission;
    private BigDecimal totalPurchasesCommission;
}