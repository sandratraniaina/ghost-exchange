package mg.exchange.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
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
    
    // @PostMapping("/sign-in")
    // public <T> ResponseEntity<Response<T>> signIn(@RequestParam String user){ 
    //     try {

    //         User logUser = userService.checkUserAlreadyExist(user);
            
    //         return ResponseUtil.sendResponse(HttpStatus.OK, true, "User sign in successfully", (T)logUser);
    //     } catch (Exception e) {
    //         ResponseUtil.sendResponse(
    //             HttpStatus.BAD_REQUEST, 
    //             false, 
    //             "Error while attnullempting to sign", 
    //             e.getMessage()
    //         );
    //     }
    //     return null;
    // }

     @PostMapping("/sign-in")
    public String signIn(@RequestParam String user){
        try {            
            return "Success login";
        } catch (Exception e) {
            return  e.getMessage();
        }
    }
}
 