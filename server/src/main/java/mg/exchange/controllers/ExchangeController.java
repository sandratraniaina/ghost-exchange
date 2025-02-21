package mg.exchange.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.models.Cryptocurrency;
import mg.exchange.models.Response;
import mg.exchange.models.XeHistory;
import mg.exchange.services.CryptocurrencyService;
import mg.exchange.services.XeHistoryService;
import mg.exchange.utils.ResponseUtil;

@RestController
@RequestMapping("/api/exchanges")
public class ExchangeController {
    
    @Autowired
    private XeHistoryService exchangeService;

    @Autowired 
    private CryptocurrencyService cryptocurrencyService; 

    @SuppressWarnings("unchecked")
    @PostMapping
    public <T> ResponseEntity<Response<T>> getHistory(@RequestBody(required = false) List<Cryptocurrency> cryptos, @RequestParam(required = false) Integer interval){
        try {
            if(cryptos == null){
                cryptos = cryptocurrencyService.getAllCryptocurrencies();
            }
            List<XeHistory> exchanges = exchangeService.getHistory(cryptos,interval);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Exchanges history fetched successfully", (T)exchanges);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.INTERNAL_SERVER_ERROR, false, "Error while fetching exchanges", (T) e.getMessage());
        }
    }
}
