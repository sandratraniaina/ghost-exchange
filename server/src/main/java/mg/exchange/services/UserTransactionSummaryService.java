package mg.exchange.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import mg.exchange.dto.UserTransactionSummary;
import mg.exchange.repository.UserTransactionSummaryRepository;

@Service
@RequiredArgsConstructor
public class UserTransactionSummaryService {
    
    @Autowired
    private UserTransactionSummaryRepository userTransactionRepository;

    public List<UserTransactionSummary> getUserTransactionSummary(LocalDateTime min, LocalDateTime max) {
        return userTransactionRepository.getUserTransactionSummary(min, max);
    }

}
