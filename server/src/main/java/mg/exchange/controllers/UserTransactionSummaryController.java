package mg.exchange.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.dto.UserTransactionSummary;
import mg.exchange.models.Response;
import mg.exchange.services.UserTransactionSummaryService;
import mg.exchange.utils.ResponseUtil;

@RestController
@RequestMapping("/api/users-transactions")
public class UserTransactionSummaryController {
    
    @Autowired
    private UserTransactionSummaryService userTransactionService;

    @SuppressWarnings("unchecked")
    @GetMapping("/summary")
    public <T> ResponseEntity<Response<T>> getUserTransactionSummary(@RequestParam(required = false)LocalDateTime min, @RequestParam(required = false)LocalDateTime max){
        try {
            List<UserTransactionSummary> list = userTransactionService.getUserTransactionSummary(min,max);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Users transaction fetched successufully", (T)list);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while attempting to fetch users transaction summary", (T)e.getMessage());
        }
    }
}
