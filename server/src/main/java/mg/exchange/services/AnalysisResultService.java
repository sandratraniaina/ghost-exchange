package mg.exchange.services;

import lombok.RequiredArgsConstructor;
import mg.exchange.dto.AnalysisResult;
import mg.exchange.models.Cryptocurrency;
import mg.exchange.repository.AnalysisResultRepository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import mg.exchange.dto.AnalysisResult;
import mg.exchange.models.Cryptocurrency;

@Service
@RequiredArgsConstructor
public class AnalysisResultService {
    private final AnalysisResultRepository analysisResultRepository;

    public List<AnalysisResult> getMaxValueCrypto(List<Cryptocurrency> cryptos, LocalDateTime start, LocalDateTime end) {
        return analysisResultRepository.getMaxForCryptos(cryptos, start, end);
    }

    public List<AnalysisResult> getMinValueCrypto(List<Cryptocurrency> cryptos, LocalDateTime start, LocalDateTime end) {
        return analysisResultRepository.getMinForCryptos(cryptos, start, end);
    }

    public List<AnalysisResult> getAverageValueCrypto(List<Cryptocurrency> cryptos, LocalDateTime start, LocalDateTime end) {
        return analysisResultRepository.getAverageForCryptos(cryptos, start, end);
    }

    public List<AnalysisResult> getFirstQuartileValueCrypto(List<Cryptocurrency> cryptos, LocalDateTime start, LocalDateTime end) {
        return analysisResultRepository.getFirstQuartile(cryptos, start, end);
    }

    public List<AnalysisResult> getStandardDeviationValueCrypto(List<Cryptocurrency> cryptos, LocalDateTime start, LocalDateTime end) {
        return analysisResultRepository.getStandardDeviation(cryptos, start, end);
    }
}
