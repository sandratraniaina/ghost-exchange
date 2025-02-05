package mg.exchange.repository;

import mg.exchange.models.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface LedgerRepository extends JpaRepository<Ledger, Long> {
    @Modifying
    @Query("DELETE FROM Ledger l WHERE l.sellOrder.id = :sellOrderId")
    void deleteBySellOrderId(Long sellOrderId);

    @Query("SELECT l from Ledger l where  l.sellOrder.id = :sellOrderId ")
    Optional<Ledger> findBySellOrderId(Long sellOrderId);
}