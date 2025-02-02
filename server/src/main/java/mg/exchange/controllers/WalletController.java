package mg.exchange.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.models.CryptocurrencyWallet;
import mg.exchange.models.Response;
import mg.exchange.services.CryptocurrencyWalletService;
import mg.exchange.utils.ResponseUtil;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {
    
    @Autowired
    private CryptocurrencyWalletService walletService;

    @SuppressWarnings("unchecked")
    @GetMapping
    public <T> ResponseEntity<Response<T>> getWalletByUserId(@RequestParam Long userId){
        try {
            Optional<CryptocurrencyWallet> wallets = walletService.getWalletByUserId(userId);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Wallet fetched successfully", (T)wallets);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while retrieving wallet for user "+userId, (T)e.getMessage());
        }
    }
}
