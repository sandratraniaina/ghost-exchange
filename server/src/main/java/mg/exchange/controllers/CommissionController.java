package mg.exchange.controllers;

import mg.exchange.dto.CommissionSummaryDTO;
import mg.exchange.models.Commission;
import mg.exchange.models.Response;
import mg.exchange.services.CommissionService;
import mg.exchange.utils.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

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

    @PostMapping("/search")
    public <T> ResponseEntity<Response<T>> getCommissionSummary(
            @RequestParam(required = false) Long cryptoId,
            @RequestParam String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime min,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime max) {
        try {
            Timestamp minTimestamp = (min != null) ? Timestamp.valueOf(min) : null;
            Timestamp maxTimestamp = (max != null) ? Timestamp.valueOf(max) : null;
            List<CommissionSummaryDTO> summary = commissionService.getCommissionSummary(cryptoId, type, minTimestamp, maxTimestamp);
            return ResponseUtil.sendResponse(HttpStatus.OK, true, "Commission summary retrieved successfully", (T) summary);
        } catch (Exception e) {
            return ResponseUtil.sendResponse(HttpStatus.BAD_REQUEST, false, "Error retrieving commission summary", (T) e.getMessage());
        }
    }
}
