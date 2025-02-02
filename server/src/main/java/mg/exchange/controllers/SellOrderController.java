package mg.exchange.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.services.SellOrderService;

@RestController
@RequestMapping("/api/sell-orders")
public class SellOrderController {
    
    @Autowired
    private SellOrderService SellOrderService;

    
}
