package mg.exchange.repository;


import mg.exchange.dto.UserCryptoTransaction;
import mg.exchange.models.SellOrder;
import mg.exchange.models.Transaction;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t " +
        "JOIN CryptocurrencyWallet cw ON t.user.id = cw.user.id " +
        "WHERE (CAST(:cryptocurrencyId AS long) IS NULL OR cw.cryptocurrency.id = :cryptocurrencyId) " +
        "AND (CAST(:minDate AS timestamp) IS NULL OR t.timestamp >= :minDate) " +
        "AND (CAST(:maxDate AS timestamp) IS NULL OR t.timestamp <= :maxDate) " +
        "AND (CAST(:type AS string) IS NULL OR CAST(t.transactionType AS string) = :type)")
    List<Transaction> getHistoryTransaction(
        @Param("cryptocurrencyId") Long cryptocurrencyId,
        @Param("minDate") LocalDateTime minDate,
        @Param("maxDate") LocalDateTime maxDate,
        @Param("type") String type
    );

    @Query("SELECT t FROM Transaction t WHERE t.validation_timestamp IS NULL")
    List<Transaction> findOpenTransactions();
}