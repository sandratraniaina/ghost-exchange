package mg.exchange.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.models.Response;
import mg.exchange.models.User;
import mg.exchange.services.UserService;
import mg.exchange.utils.ResponseUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @PostMapping("/sign-in")
    public <T> ResponseEntity<Response<T>> signIn(@RequestBody Map<String, String> body) { 
        try {
            String user = body.get("user");
    
            if (user == null || user.isEmpty()) {
                return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "User parameter is missing", null);
            }
    
            User logUser = userService.checkUserAlreadyExist(user);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "User signed in successfully", (T) logUser);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error while attempting to sign in", null);
        }
    }
    

}
 