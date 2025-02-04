package mg.exchange.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CommissionSummaryDTO {
    private Long cryptocurrencyId;
    private BigDecimal totalSalesCommission;
    private BigDecimal totalPurchasesCommission;
}