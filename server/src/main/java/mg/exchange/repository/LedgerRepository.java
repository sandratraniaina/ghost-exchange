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
           "    WHEN l.buyer = :user THEN 'BUY' " +
           "    WHEN so.seller = :user THEN 'SELL' " +
           "END) " +
           "FROM Ledger l " +
           "JOIN l.sellOrder so " +
           "WHERE (:cryptocurrency IS NULL OR so.cryptocurrency = :cryptocurrency) " +
           "AND (:user IS NULL OR l.buyer = :user OR so.seller = :user) " +
           "AND (:minDate IS NULL OR l.timestamp >= :minDate) " +
           "AND (:maxDate IS NULL OR l.timestamp <= :maxDate) " +
           "AND (:type IS NULL OR " +
           "    ((:type = 'BUY' AND l.buyer = :user) OR " +
           "     (:type = 'SELL' AND so.seller = :user))) " +
           "ORDER BY l.timestamp DESC")
    List<UserCryptoTransaction> getHistoryCryptoTransaction(
        @Param("cryptocurrency") Cryptocurrency cryptocurrency,
        @Param("user") User user,
        @Param("minDate") LocalDateTime minDate,
        @Param("maxDate") LocalDateTime maxDate,
        @Param("type") String type
    );
}