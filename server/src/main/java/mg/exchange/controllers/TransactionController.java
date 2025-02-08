package mg.exchange.controllers;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public <T> ResponseEntity<Response<T>> getAllTransactions(@RequestParam(required = false) String type){
        try {
            List<Transaction> transactions = null;
            if(type != null && type.equalsIgnoreCase("open")){
                transactions = transactionService.getAllOpenTransactions();
            }else if(type != null && !type.equalsIgnoreCase("open")){
                throw new Exception("Unknown type "+type+" for transactions");
            }else{
                transactions = transactionService.getAllTransactions();
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
            transaction.updateTimestamp();
            transaction = transactionService.createTransaction(transaction);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Transaction saved successfully", (T) transaction);
        }catch (RuntimeException re){
            return ResponseUtil.sendResponse(HttpStatus.OK, false, "Error while trying to save transaction", (T)re.getMessage());
        }
        catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while trying to save transaction", (T)e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/{transactionId}")
    public <T> ResponseEntity<Response<T>> getTransactionById(@PathVariable Long transactionId) {
        try {
            Transaction transaction = transactionService.getTransactionById(transactionId);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Transaction fetched successfully",(T)transaction);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false,"Error while fetching transaction : "+transactionId , (T)e.getMessage());
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

    @SuppressWarnings("unchecked")
    @DeleteMapping("/{transactionId}")
    public <T> ResponseEntity<Response<T>> deleteTransaction(@PathVariable Long transactionId) {
        try {
            transactionService.deleteTransaction(transactionId);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Transaction deleted successfully",null);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false,"Error while deleting transaction : "+transactionId , (T)e.getMessage());
        }
    }
}
