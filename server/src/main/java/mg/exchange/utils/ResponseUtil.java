package mg.exchange.utils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import mg.exchange.models.Response;

public class ResponseUtil {
    
    public static <T> ResponseEntity<Response<T>> sendResponse(HttpStatus status, boolean success, String message, T data) {
        Response<T> response = new Response<>(status.value(), success, message, data);
        return new ResponseEntity<>(response, status);
    }
    
}
