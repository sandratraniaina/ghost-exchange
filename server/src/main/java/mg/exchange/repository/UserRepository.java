package mg.exchange.repository;


import mg.exchange.dto.UserTransactionSummary;
import mg.exchange.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsername(@Param("username") String username);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findUserByEmail(@Param("email") String email);

    @Query("SELECT new mg.exchange.dto.UserTransactionSummary(" +
        "a, " +
        "COALESCE(SUM(up.totalPurchase), 0), " +
        "COALESCE(SUM(us.totalSale), 0), " +
        "a.fiatBalance) " +
        "FROM User a " +
        "LEFT JOIN (SELECT l.buyer AS buyer, SUM(s.fiatPrice) AS totalPurchase " +
        "           FROM Ledger l " +
        "           JOIN l.sellOrder s " +
        "           WHERE (CAST(:min AS timestamp) IS NULL OR l.timestamp >= :min) " +
        "           AND (CAST(:max AS timestamp) IS NULL OR l.timestamp <= :max) " +
        "           GROUP BY l.buyer) up ON a.id = up.buyer.id " +
        "LEFT JOIN (SELECT s.seller AS seller, SUM(s.fiatPrice) AS totalSale " +
        "           FROM SellOrder s " +
        "           WHERE s.isOpen = FALSE " +
        "           AND (CAST(:min AS timestamp) IS NULL OR s.timestamp >= :min) " +
        "           AND (CAST(:max AS timestamp) IS NULL OR s.timestamp <= :max) " +
        "           GROUP BY s.seller) us ON a.id = us.seller.id " +
        "WHERE a.accountRole != 'ADMIN' " +
        "GROUP BY a.id")
    List<UserTransactionSummary> getUserTransactionSummary(
        @Param("min") LocalDateTime min, 
        @Param("max") LocalDateTime max
    );
}