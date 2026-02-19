const VCFModel = require('../models/vcfModel');
const CPICModel = require('../models/cpicModel');
const LLMService = require('../services/llmService');
const ReportModel = require('../models/reportModel'); // Import the new model

exports.analyze = async (req, res) => {
    const startTime = Date.now();
    try {
        const { drug } = req.body; 
        
        // 1. Validate Input
        if (!req.file) throw new Error("VCF file is missing.");
        if (!drug) throw new Error("Drug name is required.");

        // 2. Parse Genetic Data (Model)
        const variants = await VCFModel.parseVCF(req.file.path);
        
        // 3. Get Clinical Recommendations (Model)
        const rec = CPICModel.getRecommendation(drug, variants);
        
        // 4. Generate AI Explanation (Service)
        const explanation = await LLMService.generateExplanation(
            drug, 
            rec.primary_gene, 
            rec.phenotype
        );

        // 5. Integrate ReportModel for Schema Compliance
        // We pass a flat object to the formatter to handle the structure
        const finalResponse = ReportModel.format({
            patientId: `PATIENT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            drug: drug,
            variants: variants,
            cpicRec: rec,
            llmExplanation: explanation,
            parsingSuccess: true,
            processingTime: Date.now() - startTime
        });

        // 6. Return Structured JSON
        res.status(200).json(finalResponse);

    } catch (err) {
        console.error("Analysis Error:", err.message);
        res.status(500).json({ 
            vcf_parsing_success: false, 
            error: err.message 
        });
    }
};