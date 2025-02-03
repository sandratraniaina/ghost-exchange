package mg.exchange.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mg.exchange.services.AnalysisResultService;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {
    
    @Autowired
    private AnalysisResultService analysisService;
}
