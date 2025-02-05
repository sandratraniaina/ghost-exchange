package mg.exchange.services;

import mg.exchange.models.Ledger;
import mg.exchange.models.SellOrder;
import mg.exchange.models.User;
import mg.exchange.repository.LedgerRepository;
import mg.exchange.repository.SellOrderRepository;
import mg.exchange.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LedgerService {

    private final LedgerRepository ledgerRepository;
    private final SellOrderRepository sellOrderRepository;
    private final UserRepository userRepository;

    public List<Ledger> getAllLedgers() {
        return ledgerRepository.findAll();
    }

    public Optional<Ledger> getLedgerById(Long id) {
        return ledgerRepository.findById(id);
    }

    public Ledger createLedger(Ledger ledger) {
        // Ensure the sell order exists
        SellOrder sellOrder = sellOrderRepository.findById(ledger.getSellOrder().getId())
                .orElseThrow(() -> new RuntimeException("SellOrder not found"));

        // Ensure the buyer exists
        User buyer = userRepository.findById(ledger.getBuyer().getId())
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        ledger.setSellOrder(sellOrder);
        ledger.setBuyer(buyer);
        return ledgerRepository.save(ledger);
    }

    public Ledger updateLedger(Long id, Ledger ledgerDetails) {
        Ledger ledger = ledgerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ledger not found"));

        // Update sell order if provided
        if (ledgerDetails.getSellOrder() != null) {
            SellOrder sellOrder = sellOrderRepository.findById(ledgerDetails.getSellOrder().getId())
                    .orElseThrow(() -> new RuntimeException("SellOrder not found"));
            ledger.setSellOrder(sellOrder);
        }

        // Update buyer if provided
        if (ledgerDetails.getBuyer() != null) {
            User buyer = userRepository.findById(ledgerDetails.getBuyer().getId())
                    .orElseThrow(() -> new RuntimeException("Buyer not found"));
            ledger.setBuyer(buyer);
        }

        ledger.setTimestamp(ledgerDetails.getTimestamp());
        return ledgerRepository.save(ledger);
    }

    public void deleteLedger(Long id) {
        ledgerRepository.deleteById(id);
    }

    public void deleteBySellOrderId(Long sellOrderId) {
        ledgerRepository.deleteBySellOrderId(sellOrderId);
    }

    public Optional<Ledger> getLedgerBySellOrderId(Long sellOrderId) {
        return ledgerRepository.findBySellOrderId(sellOrderId);
    }
}