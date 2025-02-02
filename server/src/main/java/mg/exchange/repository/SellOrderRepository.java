package mg.exchange.repository;

import mg.exchange.models.SellOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SellOrderRepository extends JpaRepository<SellOrder, Long> {
    @Query("SELECT so FROM SellOrder so WHERE so.isOpen = true")
    List<SellOrder> findOpenSellOrders();

    @Query("SELECT so FROM SellOrder so WHERE so.seller.id = :sellerId")
    List<SellOrder> findSellOrdersBySellerId( @Param("sellerId") Long sellerId);

    @Query("SELECT so FROM SellOrder so WHERE so.seller.id = :sellerId AND so.isOpen = true")
    List<SellOrder> findOpenSellOrdersBySellerId( @Param("sellerId") Long sellerId);

}