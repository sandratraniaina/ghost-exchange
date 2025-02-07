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
    private final FirestoreService firestoreService;

    public List<Commission> getAllCommissions() {
        return commissionRepository.findAll();
    }

    public Commission getCommissionById(Long id) {
        return commissionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Commission not found"));

    }

    public Commission createCommission(Commission commission) {
        Commission commissionSaved = commissionRepository.save(commission);
        firestoreService.syncToFirestore(commissionSaved);
        return commissionSaved;
    }

    public Commission updateCommission(Long id, Commission commissionDetails) {
        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission not found"));

        commission.setSalesCommission(commissionDetails.getSalesCommission());
        commission.setPurchasesCommission(commissionDetails.getPurchasesCommission());
        firestoreService.syncToFirestore(commission);
        return commissionRepository.save(commission);
    }

    public void deleteCommission(Long id) {
        Commission commissionToDelete = commissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission not found"));
        commissionRepository.deleteById(id);
        firestoreService.deleteFromFirestore(commissionToDelete);
    }

    public List<CommissionSummaryDTO> getCommissionSummary(Long cryptocurrency_id, String typeAnalyse, Timestamp min, Timestamp max) {
        return commissionRepository.getCommissionSummary(cryptocurrency_id, typeAnalyse, min, max);
    }
}