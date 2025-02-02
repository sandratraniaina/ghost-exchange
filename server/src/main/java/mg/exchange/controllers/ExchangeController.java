package mg.exchange.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.services.XeHistoryService;

@RestController
@RequestMapping("/api/exchanges")
public class ExchangeController {
    
    @Autowired
    private XeHistoryService exchangeService;
    
}
