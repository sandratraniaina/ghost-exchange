package mg.exchange.services;

import mg.exchange.dto.CommissionSummaryDTO;
import mg.exchange.models.Commission;
import mg.exchange.repository.CommissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionRepository commissionRepository;

    public List<Commission> getAllCommissions() {
        return commissionRepository.findAll();
    }

    public Optional<Commission> getCommissionById(Long id) {
        return commissionRepository.findById(id);
    }

    public Commission createCommission(Commission commission) {
        return commissionRepository.save(commission);
    }

    public Commission updateCommission(Long id, Commission commissionDetails) {
        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission not found"));

        commission.setSalesCommission(commissionDetails.getSalesCommission());
        commission.setPurchasesCommission(commissionDetails.getPurchasesCommission());
        return commissionRepository.save(commission);
    }

    public void deleteCommission(Long id) {
        commissionRepository.deleteById(id);
    }

    public List<CommissionSummaryDTO> getCommissionSummary(Long cryptocurrency_id, String typeAnalyse, Timestamp min, Timestamp max) {
        return commissionRepository.getCommissionSummary(cryptocurrency_id, typeAnalyse, min, max);
    }
}