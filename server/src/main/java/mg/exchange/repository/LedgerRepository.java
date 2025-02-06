package mg.exchange.repository;

import mg.exchange.dto.UserCryptoTransaction;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.models.Ledger;
import mg.exchange.models.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LedgerRepository extends JpaRepository<Ledger, Long> {
    @Modifying
    @Query("DELETE FROM Ledger l WHERE l.sellOrder.id = :sellOrderId")
    void deleteBySellOrderId(Long sellOrderId);

    @Query("SELECT l from Ledger l where  l.sellOrder.id = :sellOrderId ")
    Optional<Ledger> findBySellOrderId(Long sellOrderId);

    @Query("SELECT new mg.exchange.dto.UserCryptoTransaction(" +
        "l, " +
        "CASE " +
        "    WHEN a.id = l.buyer.id THEN 'BUY' " +
        "    WHEN a.id = so.seller.id THEN 'SELL' " +
        "    ELSE NULL " +
        "END) " +
        "FROM Ledger l " +
        "JOIN l.sellOrder so " +
        "JOIN User a ON a.id = l.buyer.id OR a.id = so.seller.id " +
        "WHERE (:cryptocurrencyId IS NULL OR so.cryptocurrency.id = :cryptocurrencyId) " +
        "AND (CAST(:minDate AS timestamp) IS NULL OR l.timestamp >= :minDate) " +
        "AND (CAST(:maxDate AS timestamp) IS NULL OR l.timestamp <= :maxDate) " +
        "AND (:type IS NULL OR " +
        "    (:type = 'BUY' AND a.id = l.buyer.id) OR " +
        "    (:type = 'SELL' AND a.id = so.seller.id)) " +
        "ORDER BY l.timestamp DESC")
    List<UserCryptoTransaction> getHistoryCryptoTransaction(
        @Param("cryptocurrencyId") Long cryptocurrencyId,
        @Param("minDate") LocalDateTime minDate,
        @Param("maxDate") LocalDateTime maxDate,
        @Param("type") String type
    );
}