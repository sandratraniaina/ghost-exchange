package mg.exchange.repository;

import mg.exchange.models.CryptocurrencyWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CryptocurrencyWalletRepository extends JpaRepository<CryptocurrencyWallet, Long> {
}