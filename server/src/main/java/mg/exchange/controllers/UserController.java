package mg.exchange.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.dto.SignInRequest;
import mg.exchange.models.Response;
import mg.exchange.models.SellOrder;
import mg.exchange.models.User;
import mg.exchange.services.SellOrderService;
import mg.exchange.services.UserService;
import mg.exchange.utils.ResponseUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired 
    private SellOrderService sellOrderService;
    
    @SuppressWarnings("unchecked")
    @PostMapping("/sign-in")
    public <T> ResponseEntity<Response<T>> signIn(@RequestBody SignInRequest user) { 
        try {

            if (user == null) {
                return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "User parameter is missing", null);
            }
    
            User logUser = userService.checkUserAlreadyExist(user);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "User signed in successfully", (T) logUser);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while attempting to sign in", (T)e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/{userId}/sell-orders")
    public <T> ResponseEntity<Response<T>> getUserSellOrders(@PathVariable Long userId, @RequestParam(required = false) String type){
        try {
            Optional<User> u = userService.getUserById(userId);
            if(u == null){
                throw new Exception("User not found for id : "+userId);
            }
            List<SellOrder> sellOrders;
            if (type != null) {
                if (type.trim().toLowerCase().equals("open")) {
                    sellOrders = sellOrderService.getOpenSellOrdersBySellerId(userId);
                } else {
                    throw new IllegalArgumentException("Unknown type of sell order: " + type);
                }
            } else {
                sellOrders = sellOrderService.getSellOrdersBySellerId(userId);
            } 
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Sell orders fetched successfully", (T) sellOrders);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while attempting to fetch sell orders for user "+userId, (T)e.getMessage());
        }
    }
}
 