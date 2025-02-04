package mg.exchange.controllers;

import mg.exchange.models.Commission;
import mg.exchange.models.Response;
import mg.exchange.services.CommissionService;
import mg.exchange.utils.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/commissions")
public class CommissionController {

    @Autowired
    private CommissionService commissionService;

    @PutMapping("/{id}")
    public<T> ResponseEntity<Response<T>> updateCommission(
            @PathVariable Long id,
            @RequestBody Commission commissionDetails) {
        try {
            Commission updatedCommission = commissionService.updateCommission(id, commissionDetails);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Commission updated successfully", (T) updatedCommission);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error updating commission", (T) e.getMessage());
        }
    }
}
