package mg.exchange.controllers;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.dto.AnalysisResult;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.models.Response;
import mg.exchange.services.AnalysisResultService;
import mg.exchange.services.CryptocurrencyService;
import mg.exchange.utils.ResponseUtil;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {
    
    @Autowired
    private AnalysisResultService analysisService;

    @Autowired
    private CryptocurrencyService cryptocurrencyService;

    @SuppressWarnings("unchecked")
    @GetMapping
    public <T> ResponseEntity<Response<T>> analyse(
        @RequestParam(required = true) String type, 
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start, 
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            List<Cryptocurrency> cryptos = cryptocurrencyService.getAllCryptocurrencies();
            List<AnalysisResult> result = null;
            if (type.trim().equalsIgnoreCase("max")) {
                result = analysisService.getMaxValueCrypto(cryptos, start, end);
            }else if(type.trim().equalsIgnoreCase("min")){
                result = analysisService.getMinValueCrypto(cryptos, start, end);
            }else if(type.trim().equalsIgnoreCase("avg")){
                result = analysisService.getAverageValueCrypto(cryptos, start, end);
            }else if(type.trim().equalsIgnoreCase("1q")){
                result = analysisService.getFirstQuartileValueCrypto(cryptos, start, end);
            }
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Analyze "+ type+" done", (T) result);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while analyzing cryptos", (T) e.getMessage());
        }
    }
}
