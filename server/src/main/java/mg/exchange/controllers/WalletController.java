package mg.exchange.controllers;

import java.util.List;
import java.util.Optional;

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
            List<CryptocurrencyWallet> wallets = walletService.getWalletByUserId(userId);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Wallet fetched successfully", (T)wallets);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while retrieving wallet for user "+userId, (T)e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @PostMapping
    public <T> ResponseEntity<Response<T>> createWallet(@RequestBody CryptocurrencyWallet wallet){
        try {
            CryptocurrencyWallet createdWallet = walletService.createWallet(wallet);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Wallet created successfully", (T)createdWallet);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while creating wallet for user "+wallet.getUser().getId(), (T)e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/{walletId}")
    public <T> ResponseEntity<Response<T>> getWalletById(@PathVariable Long walletId){
        try {
            CryptocurrencyWallet wallet = walletService.getWalletById(walletId);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Wallet fetched successfully", (T)wallet);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while fetching wallet  "+walletId, (T)e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @DeleteMapping("/{walletId}")
    public <T> ResponseEntity<Response<T>> deleteWalletById(@PathVariable Long walletId){
        try {
            walletService.deleteWallet(walletId);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Wallet deleted successfully", null);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while deleting wallet  "+walletId, (T)e.getMessage());
        }
    }

}
