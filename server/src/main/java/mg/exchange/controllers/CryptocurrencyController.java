package mg.exchange.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.models.Cryptocurrency;
import mg.exchange.models.Response;
import mg.exchange.services.CryptocurrencyService;
import mg.exchange.utils.ResponseUtil;

@RestController
@RequestMapping("/api/cryptocurrencies")
public class CryptocurrencyController {
    
    @Autowired 
    private CryptocurrencyService cryptocurrencyService;

    @SuppressWarnings("unchecked")
    @GetMapping
    public <T> ResponseEntity<Response<T>> getAllCryptocurrencies(){
        try {
            List<Cryptocurrency> ls = cryptocurrencyService.getAllCryptocurrencies();
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Cryptocurrencies fetched successfully", (T)ls);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while attempting to fetch all cryptocurrencies", (T)e.getMessage());
        }
    }

}
