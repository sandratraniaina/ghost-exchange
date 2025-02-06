package mg.exchange.repository;

import mg.exchange.models.Cryptocurrency;
import mg.exchange.models.XeHistory;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface XeHistoryRepository extends JpaRepository<XeHistory, Long> {

    @Query("SELECT xh FROM XeHistory xh " +
           "WHERE xh.cryptocurrency IN :cryptocurrencies " +
           "AND xh.timestamp BETWEEN :startTime AND :endTime " +
           "ORDER BY xh.timestamp DESC") 
    List<XeHistory> findByCryptocurrencyInAndTimestampBetween(
        @Param("cryptocurrencies") List<Cryptocurrency> cryptocurrencies,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
}