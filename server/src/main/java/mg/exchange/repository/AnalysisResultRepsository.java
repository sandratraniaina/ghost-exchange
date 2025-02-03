package mg.exchange.repository;

import mg.exchange.dto.AnalysisResult;
import mg.exchange.models.Cryptocurrency;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalysisResultRepsository extends JpaRepository<AnalysisResult ,Long > {

    @Query("""
        SELECT 
            new mg.dto.AnalysisResult(
                c, 
                MAX(x.fiatPrice), 
                MAX(x.timestamp)
            )
        FROM 
            Cryptocurrency c
        JOIN 
            XeHistory x ON c.id = x.cryptocurrency.id
        WHERE 
            c IN (:cryptos)
            AND (:min IS NULL OR x.timestamp >= :min)
            AND (:max IS NULL OR x.timestamp <= :max)
        GROUP BY 
            c
        """)
    List<AnalysisResult> getMaxForCryptos(
        @Param("cryptos") List<Cryptocurrency> cryptos,
        @Param("min") Timestamp min, 
        @Param("max") Timestamp max
    );  
}
