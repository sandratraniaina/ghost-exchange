package mg.exchange.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.services.CryptocurrencyWalletService;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {
    
    @Autowired
    private CryptocurrencyWalletService walletService;

}
