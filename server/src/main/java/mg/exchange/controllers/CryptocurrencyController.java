package mg.exchange.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.services.CryptocurrencyService;

@RestController
@RequestMapping("/api/cryptocurrencies")
public class CryptocurrencyController {
    
    @Autowired 
    private CryptocurrencyService cryptocurrencyService;

    
}
