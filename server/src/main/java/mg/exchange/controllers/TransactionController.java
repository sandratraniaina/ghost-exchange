package mg.exchange.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @SuppressWarnings("unchecked")
    @PostMapping
    public <T> ResponseEntity<Response<T>> saveTransaction(@RequestBody Transaction transaction) {
        try {
            if (transaction == null) {
                throw new Exception("Cannot save a transaction of a value null");
            }
            transaction = transactionService.createTransaction(transaction);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Transaction saved successfully", (T) transaction);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while trying to save transaction", (T)e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/{transactionId}")
    public <T> ResponseEntity<Response<T>> validateTransaction(@PathVariable Long transactionId) {
        try {
            Transaction transaction =  transactionService.validateTransaction(transactionId);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Transaction validated successfully", (T) transaction);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false,"Error while validating transaction : "+transactionId , (T)e.getMessage());
        }
    }
}
