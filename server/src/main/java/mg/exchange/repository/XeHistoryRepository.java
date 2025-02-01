package mg.exchange.repository;

import mg.exchange.models.XeHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface XeHistoryRepository extends JpaRepository<XeHistory, Long> {
}