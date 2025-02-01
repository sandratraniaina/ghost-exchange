package mg.exchange.repository;

import mg.exchange.models.CryptocurrencyWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CryptocurrencyWalletRepository extends JpaRepository<CryptocurrencyWallet, Long> {

    @Query("SELECT cw FROM CryptocurrencyWallet cw WHERE cw.user.id = :userId")
    Optional<CryptocurrencyWallet> findByUserId(Long userId);
}