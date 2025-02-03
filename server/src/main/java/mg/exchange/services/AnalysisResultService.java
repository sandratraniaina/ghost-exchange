package mg.exchange.services;

import lombok.RequiredArgsConstructor;
import mg.exchange.dto.AnalysisResult;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.repository.AnalysisResultRepsository;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.stereotype.Service;

import mg.exchange.dto.AnalysisResult;
import mg.exchange.models.Cryptocurrency;

@Service
@RequiredArgsConstructor
public class AnalysisResultService {
    private final AnalysisResultRepsository analysisResultRepository;

    public List<AnalysisResult> getMaxValueCrypto(List<Cryptocurrency> cryptos, Timestamp minTimestamp, Timestamp maxTimestamp) {
        return analysisResultRepository.getMaxForCryptos(cryptos, minTimestamp, maxTimestamp);
    }


}
