package mg.exchange.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import mg.exchange.repository.UserTransactionSummaryRepository;

@Service
@RequiredArgsConstructor
public class UserTransactionSummaryService {
    
    @Autowired
    private UserTransactionSummaryRepository userTransactionRepository;
}
