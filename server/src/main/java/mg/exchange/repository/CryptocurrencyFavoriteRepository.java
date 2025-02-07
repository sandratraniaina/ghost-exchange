package mg.exchange.repository;


import mg.exchange.models.CryptocurrencyFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CryptocurrencyFavoriteRepository extends JpaRepository<CryptocurrencyFavorite, Long> {

    @Query("SELECT cf FROM CryptocurrencyFavorite cf WHERE cf.account.id = :accountId")
    List<CryptocurrencyFavorite> findByAccountId(@Param("accountId") Long accountId);

    @Query("SELECT cf FROM CryptocurrencyFavorite cf WHERE cf.account.id = :accountId AND cf.cryptocurrency.id = :cryptoId")
    Optional<CryptocurrencyFavorite> findByAccountIdAndCryptocurrencyId(
            @Param("accountId") Long accountId,
            @Param("cryptoId") Long cryptoId);
}
