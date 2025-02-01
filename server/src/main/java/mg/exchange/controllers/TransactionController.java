package mg.exchange.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.models.Response;
import mg.exchange.models.Transaction;
import mg.exchange.services.TransactionService;
import mg.exchange.utils.ResponseUtil;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;

    @SuppressWarnings("unchecked")
    @GetMapping
    public <T> ResponseEntity<Response<T>> getAllTransactions(){
        try {
            List<Transaction> transactions = transactionService.getAllTransactions();
            if(transactions.size() == 0){
                return ResponseUtil.sendResponse(HttpStatus.OK, true, "List of transaction fetched successfully but empty", (T) transactions);
            }
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "List of transactions fetched successfully", (T)transactions);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while fetching transactions data", (T)e.getMessage());
        }
    }
}
