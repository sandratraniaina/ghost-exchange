package mg.exchange.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.services.UserTransactionSummaryService;

@RestController
@RequestMapping("/api/users-transactions")
public class UserTransactionSummaryController {
    
    @Autowired
    private UserTransactionSummaryService userTransactionService;
}
