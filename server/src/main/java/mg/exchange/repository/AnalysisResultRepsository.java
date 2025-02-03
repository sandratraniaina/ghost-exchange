package mg.exchange.repository;

import mg.exchange.dto.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalysisResultRepsository extends JpaRepository<AnalysisResult ,Long > {

}
