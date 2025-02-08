package mg.exchange.repository;

import mg.exchange.dto.CommissionSummaryDTO;
import mg.exchange.models.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {
    @Query(value = """
            SELECT
                so.cryptocurrency_id AS cryptocurrency_id,
            
                -- Conditional SUM or AVG for sales commission
                CASE
                    WHEN :type_analyse = 'sum' THEN SUM(l.sales_commission * so.amount * so.fiat_price)
                    ELSE AVG(l.sales_commission * so.amount * so.fiat_price)
                    END AS total_sales_commission,
            
                -- Conditional SUM or AVG for purchases commission
                CASE
                    WHEN :type_analyse = 'sum' THEN SUM(l.purchases_commission * so.amount * so.fiat_price)
                    ELSE AVG(l.purchases_commission * so.amount * so.fiat_price)
                    END AS total_purchases_commission
            
            FROM ledger l
                     JOIN sell_order so ON l.sell_order_id = so.id
            WHERE (:cryptocurrency_id IS NULL OR so.cryptocurrency_id = :cryptocurrency_id)
              AND (CAST(:min AS TIMESTAMP) IS NULL OR so.timestamp >= :min)
              AND (CAST(:max AS TIMESTAMP) IS NULL OR so.timestamp <= :max)
            
            GROUP BY so.cryptocurrency_id;
            """, nativeQuery = true)
    CommissionSummaryDTO getCommissionSummarByCryptoCurrencyId(
            @Param("cryptocurrency_id") Long cryptocurrencyId,
            @Param("type_analyse") String type_analyse,
            @Param("min") Timestamp min,
            @Param("max") Timestamp max);

}