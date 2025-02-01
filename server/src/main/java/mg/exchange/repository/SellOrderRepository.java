package mg.exchange.repository;

import mg.exchange.models.SellOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SellOrderRepository extends JpaRepository<SellOrder, Long> {
    @Query("SELECT so FROM SellOrder so WHERE so.isOpen = true")
    List<SellOrder> findOpenSellOrders();
}