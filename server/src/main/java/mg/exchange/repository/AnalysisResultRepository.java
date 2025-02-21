package mg.exchange.repository;

import mg.exchange.dto.AnalysisResult;
import mg.exchange.models.Cryptocurrency;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalysisResultRepository extends JpaRepository<Cryptocurrency, Long> { 

    @Query("SELECT new mg.exchange.dto.AnalysisResult(c, MAX(x.fiatPrice)) " +
        "FROM Cryptocurrency c " +
        "JOIN XeHistory x ON c.id = x.cryptocurrency.id " +
        "WHERE c IN :cryptos " +
        "AND (cast(:min as timestamp) IS NULL OR x.timestamp >= :min) " +
        "AND (cast(:max as timestamp) IS NULL OR x.timestamp <= :max) " +
        "GROUP BY c")
    List<AnalysisResult> getMaxForCryptos(
        @Param("cryptos") List<Cryptocurrency> cryptos,
        @Param("min") LocalDateTime min,
        @Param("max") LocalDateTime max);

    @Query("SELECT new mg.exchange.dto.AnalysisResult(c, MIN(x.fiatPrice)) " +
        "FROM Cryptocurrency c " +
        "JOIN XeHistory x ON c.id = x.cryptocurrency.id " +
        "WHERE c IN :cryptos " +
        "AND (cast(:min as timestamp) IS NULL OR x.timestamp >= :min) " +
        "AND (cast(:max as timestamp) IS NULL OR x.timestamp <= :max) " +
        "GROUP BY c")
    List<AnalysisResult> getMinForCryptos(
        @Param("cryptos") List<Cryptocurrency> cryptos,
        @Param("min") LocalDateTime min,
        @Param("max") LocalDateTime max);

    @Query("SELECT new mg.exchange.dto.AnalysisResult(c, CAST(AVG(x.fiatPrice) AS big_decimal)) " +
        "FROM Cryptocurrency c " +
        "JOIN XeHistory x ON c.id = x.cryptocurrency.id " +
        "WHERE c IN :cryptos " +
        "AND (cast(:min as timestamp) IS NULL OR x.timestamp >= :min) " +
        "AND (cast(:max as timestamp) IS NULL OR x.timestamp <= :max) " +
        "GROUP BY c")
    List<AnalysisResult> getAverageForCryptos(
        @Param("cryptos") List<Cryptocurrency> cryptos,
        @Param("min") LocalDateTime min,
        @Param("max") LocalDateTime max);

    @Query("SELECT new mg.exchange.dto.AnalysisResult(c, PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY x.fiatPrice)) " +
        "FROM Cryptocurrency c " +
        "JOIN XeHistory x ON c.id = x.cryptocurrency.id " +
        "WHERE c IN :cryptos " +
        "AND (cast(:min as timestamp) IS NULL OR x.timestamp >= :min) " +
        "AND (cast(:max as timestamp) IS NULL OR x.timestamp <= :max) " +
        "GROUP BY c")
    List<AnalysisResult> getFirstQuartile(
        @Param("cryptos") List<Cryptocurrency> cryptos,
        @Param("min") LocalDateTime min,
        @Param("max") LocalDateTime max);

    @Query("SELECT new mg.exchange.dto.AnalysisResult(c, CAST(SQRT(VARIANCE(x.fiatPrice)) AS big_decimal)) " +
        "FROM Cryptocurrency c " +
        "JOIN XeHistory x ON c.id = x.cryptocurrency.id " +
        "WHERE c IN :cryptos " +
        "AND (cast(:min as timestamp) IS NULL OR x.timestamp >= :min) " +
        "AND (cast(:max as timestamp) IS NULL OR x.timestamp <= :max) " +
        "GROUP BY c")
    List<AnalysisResult> getStandardDeviation(
        @Param("cryptos") List<Cryptocurrency> cryptos,
        @Param("min") LocalDateTime min,
        @Param("max") LocalDateTime max);
  
}

