package mg.exchange.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import mg.exchange.models.User;

@Repository
public interface UserTransactionSummaryRepository extends CrudRepository<User, Long> {

}
