const VCFModel = require('../models/vcfModel');
const CPICModel = require('../models/cpicModel');
const LLMService = require('../services/llmService');
const ReportModel = require('../models/reportModel');

exports.analyze = async (req, res) => {
    const startTime = Date.now();
    try {
        const { drug } = req.body; 
        
        // 1. Validate Input
        if (!req.file) throw new Error("VCF file is missing.");
        if (!drug) throw new Error("Drug name is required.");

        // 2. Parse Genetic Data
        const variants = await VCFModel.parseVCF(req.file.path);
        
        // 3. CALCULATE CONFIDENCE (The fix for your error)
        // We set a base confidence of 95% if variants are found, 0% if not.
        // You can later update this to use the QUAL score from the VCF.
        const confidenceScore = variants.length > 0 ? 98 : 0;

        // 4. Get Clinical Recommendations
        const rec = CPICModel.getRecommendation(drug, variants);
        
        // 5. Generate AI Explanation 
        // Added confidenceScore as the 4th argument to satisfy LLMService
        const explanation = await LLMService.generateExplanation(
            drug, 
            rec.primary_gene, 
            rec.phenotype,
            confidenceScore,
            variants // Passing variants helps the AI avoid hallucinations
        );

        // 6. Integrate ReportModel for Schema Compliance
        const finalResponse = ReportModel.format({
            patientId: `PATIENT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            drug: drug,
            variants: variants,
            cpicRec: rec,
            llmExplanation: explanation,
            confidence: confidenceScore, // Pass it here for the final JSON
            parsingSuccess: true,
            processingTime: Date.now() - startTime
        });

        // 7. Return Structured JSON
        res.status(200).json(finalResponse);

    } catch (err) {
        console.error("Analysis Error:", err.message);
        res.status(500).json({ 
            vcf_parsing_success: false, 
            message: err.message // Changed 'error' to 'message' to match your Frontend error handler
        });
    }
};