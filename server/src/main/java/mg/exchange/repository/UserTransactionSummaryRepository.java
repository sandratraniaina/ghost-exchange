package mg.exchange.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import mg.exchange.dto.UserTransactionSummary;
import mg.exchange.models.User;

import java.util.List;

@Repository
public interface UserTransactionSummaryRepository extends CrudRepository<User, Long> {

    @Query(value = """
        WITH user_purchases AS (
            SELECT l.buyer_id AS user_id, SUM(s.fiat_price) AS total_achat
            FROM ledger l
            JOIN sell_order s ON l.sell_order_id = s.id
            GROUP BY l.buyer_id
        ),
        user_sales AS (
            SELECT s.seller_id AS user_id, SUM(s.fiat_price) AS total_vente
            FROM sell_order s
            WHERE s.is_open = FALSE
            GROUP BY s.seller_id
        ),
        user_portfolio AS (
            SELECT id AS user_id, fiat_balance AS valeur_portefeuille FROM account
        )
        SELECT 
            a.username,
            COALESCE(up.total_achat, 0) AS totalAchat,
            COALESCE(us.total_vente, 0) AS totalVente,
            COALESCE(uf.valeur_portefeuille, 0) AS valeurPortefeuille
        FROM account a
        LEFT JOIN user_purchases up ON a.id = up.user_id
        LEFT JOIN user_sales us ON a.id = us.user_id
        LEFT JOIN user_portfolio uf ON a.id = uf.user_id
        WHERE a.account_role != 'ADMIN'
    """, nativeQuery = true)
    List<UserTransactionSummary> getUserTransactionSummary();
}
