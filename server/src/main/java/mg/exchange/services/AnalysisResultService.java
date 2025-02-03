package mg.exchange.services;

import lombok.RequiredArgsConstructor;
import mg.exchange.repository.AnalysisResultRepsository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalysisResultService {
    private final AnalysisResultRepsository analysisResultRepository;
}
