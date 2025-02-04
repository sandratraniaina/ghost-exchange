package mg.exchange.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mg.exchange.models.Cryptocurrency;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResult {
    private Cryptocurrency cryptocurrency;
    private BigDecimal value;
}
