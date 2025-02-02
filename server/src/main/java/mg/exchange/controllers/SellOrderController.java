package mg.exchange.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.models.Response;
import mg.exchange.models.SellOrder;
import mg.exchange.services.SellOrderService;
import mg.exchange.utils.ResponseUtil;

@RestController
@RequestMapping("/api/sell-orders")
public class SellOrderController {
    
    @Autowired
    private SellOrderService sellOrderService;

    @SuppressWarnings("unchecked")
    @GetMapping
    public <T> ResponseEntity<Response<T>> getSellOrders(@RequestParam(required = false) String type) {
        try {
            List<SellOrder> sellOrders;
            if (type != null) {
                if (type.equals("open")) {
                    sellOrders = sellOrderService.getOpenSellOrders();
                } else {
                    throw new IllegalArgumentException("Unknown type of sell order: " + type);
                }
            } else {
                sellOrders = sellOrderService.getAllSellOrders();
            }
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Sell orders fetched successfully", (T) sellOrders);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.INTERNAL_SERVER_ERROR, false, "Error while fetching sell orders", (T) e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @PostMapping
    public <T> ResponseEntity<Response<T>> createSellOrder(@RequestBody SellOrder sellOrder){
        try {
            if(sellOrder == null){
                throw new Exception("Cannot create a sell order of a value null");
            }
            sellOrder = sellOrderService.createSellOrder(sellOrder);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Sell order created successfully", (T) sellOrder);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while creating sell order", (T) e.getMessage());
        }
    }
    
}
