package mg.exchange.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.dto.SignInRequest;
import mg.exchange.dto.UserCryptoTransaction;
import mg.exchange.dto.UserTransactionSummary;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.models.CryptocurrencyWallet;
import mg.exchange.models.Response;
import mg.exchange.models.SellOrder;
import mg.exchange.models.Transaction;
import mg.exchange.models.User;
import mg.exchange.services.CryptocurrencyWalletService;
import mg.exchange.services.LedgerService;
import mg.exchange.services.SellOrderService;
import mg.exchange.services.TransactionService;
import mg.exchange.services.UserService;
import mg.exchange.utils.ResponseUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private SellOrderService sellOrderService;

    @Autowired 
    private LedgerService ledgerService;

    @Autowired 
    private TransactionService transactionService;

    @Autowired
    private CryptocurrencyWalletService walletService;

    @SuppressWarnings("unchecked")
    @PostMapping("/sign-in")
    public <T> ResponseEntity<Response<T>> signIn(@RequestBody SignInRequest user) {
        try {

            if (user == null) {
                return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "User parameter is missing", null);
            }

            User logUser = userService.checkUserAlreadyExist(user);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "User signed in successfully", (T) logUser);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while attempting to sign in",
                    (T) e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/{userId}/sell-orders")
    public <T> ResponseEntity<Response<T>> getUserSellOrders(@PathVariable Long userId,
            @RequestParam(required = false) String type) {
        try {
            User u = userService.getUserById(userId);
            List<SellOrder> sellOrders;
            if (type != null) {
                if (type.trim().toLowerCase().equals("open")) {
                    sellOrders = sellOrderService.getOpenSellOrdersBySellerId(userId);
                } else {
                    throw new IllegalArgumentException("Unknown type of sell order: " + type);
                }
            } else {
                sellOrders = sellOrderService.getSellOrdersBySellerId(userId);
            }
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Sell orders fetched successfully", (T) sellOrders);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false,
                    "Error while attempting to fetch sell orders for user " + userId, (T) e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/transactions/summary")
    public <T> ResponseEntity<Response<T>> getUserTransactionSummary(@RequestParam(required = false) LocalDateTime min,
            @RequestParam(required = false) LocalDateTime max) {
        try {
            List<UserTransactionSummary> list = userService.getUserTransactionSummary(min, max);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Users transaction fetched successufully", (T) list);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false,
                    "Error while attempting to fetch users transaction summary", (T) e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/{userId}/wallets")
    public <T> ResponseEntity<Response<T>> getWalletByUserId(@PathVariable Long userId) {
        try {
            List<CryptocurrencyWallet> wallets = walletService.getWalletByUserId(userId);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Wallet fetched successfully", (T) wallets);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false,
                    "Error while retrieving wallet for user " + userId, (T) e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/crypto-transactions")
    public <T> ResponseEntity<Response<T>> getUserCryptoTransactions(
        @RequestParam(required = false) Long cryptoId, 
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime min, 
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime max, 
        @RequestParam(required = false) String type
    ) {
        try {
            List<UserCryptoTransaction> transactions = ledgerService.getUserCryptoTransactions(cryptoId, min, max, type);

            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Crypto transactions fetched successfully", (T)transactions);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while retrieving crypto transaction for user", (T)e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/transactions")
    public <T> ResponseEntity<Response<T>> getHistoryTransaction(
        @RequestParam(required = false) Long cryptoId, 
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime min, 
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime max, 
        @RequestParam(required = false) String type
    ) {
        try {
            List<Transaction> transactions = transactionService.getHistoryTransaction(cryptoId, min, max, type);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Transactions fetched successfully", (T)transactions);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while retrieving transaction history for user", (T)e.getMessage());
        }
    }


    @PostMapping("/balances")
    public <T> ResponseEntity<Response<T>> getUserBalance(@RequestParam("userId") Long userId) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseUtil.sendResponse(HttpStatus.NOT_FOUND, false, "User not found", null);
            }
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "User balance fetched successfully", (T)user.getFiatBalance());
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while retrieving user balance", null);
        }
   }
  
    @SuppressWarnings("unchecked")
    @GetMapping
    public <T> ResponseEntity<Response<T>> getUserByEmail(@RequestParam(required = false) String email){
        try {
            Optional<User> user = userService.getUserByEmail(email);
            if(user == null){
                throw new Exception("No user found for email : "+email);
            }
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "User fetched successfully" , (T)user.get());
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while retrieving user for email "+email , (T)e.getMessage());
        }
    }
}
