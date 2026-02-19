const Groq = require('groq-sdk');

// Ensure your GROQ_API_KEY is in your .env file
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 1. Clinical Fallback Engine (Scoped correctly)
const getFallbackExplanation = (drug, gene, phenotype) => {
    const fallbacks = {
        'CODEINE': "The CYP2D6 variant results in rapid conversion to morphine, increasing respiratory depression risk.",
        'CLOPIDOGREL': "CYP2C19 variant reduces prodrug activation, increasing cardiovascular event risk.",
        'WARFARIN': "CYP2C9 variants decrease clearance, increasing bleeding risk at standard doses.",
        'SIMVASTATIN': "SLCO1B1 variants decrease hepatic uptake, increasing risk of myopathy.",
        'AZATHIOPRINE': "TPMT/NUDT15 variants lead to excessive TGN metabolite accumulation.",
        'FLUOROURACIL': "DPYD deficiency leads to reduced clearance of 5-FU, significantly increasing systemic toxicity risk."
    };

    return {
        summary: `Genetic variation in ${gene} alters ${drug} metabolism (${phenotype}).`,
        mechanism: fallbacks[drug.toUpperCase()] || "Genotype indicates non-standard metabolism. Adjust dosage per CPIC guidelines."
    };
};

// 2. Main Analysis Function
exports.generateExplanation = async (drug, gene, phenotype) => {
    const prompt = `Explain why a patient with ${gene} ${phenotype} phenotype has altered risk for ${drug}. 
    Focus on biological mechanism and CPIC guidelines. 
    Return JSON only with 'summary' and 'mechanism' keys.`;

    try {
        console.log(`⚡ Analyzing ${drug} with Groq (Llama-3.1)...`);
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: "llama-3.1-8b-instant", // The correct stable model for 2026
            response_format: { type: "json_object" }
        });

        // Parse and return the AI response
        const result = JSON.parse(chatCompletion.choices[0].message.content);
        return result;

    } catch (error) {
        console.error("❌ Groq API Error:", error.message);
        
        // Final Failsafe: Use hardcoded medical data if API is down or limited
        console.log("🛡️ Deploying Clinical Fallback Engine.");
        return getFallbackExplanation(drug, gene, phenotype);
    }
};