// Backend/analysisService.js
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CLINICAL_FALLBACK = {
    'CODEINE': { 
        alt: ['Morphine', 'NSAIDs'], 
        msg: "CYP2D6 variant detected. Risk of morphine toxicity." 
    },
    'CLOPIDOGREL': { 
        alt: ['Prasugrel', 'Ticagrelor'], 
        msg: "CYP2C19 variant reduces drug activation." 
    }
};

// FIX: Updated parameters to match what the Controller passes
exports.generateExplanation = async (drug, gene, phenotype, confidence, variants = []) => {
    
    const prompt = `
  SYSTEM: You are a Senior Pharmacogenomics Specialist. 
  DATA:
  - Drug: ${drug}
  - Gene: ${gene}
  - Phenotype: ${phenotype} (Note: UM = Ultra-rapid, PM = Poor, IM = Intermediate, EM = Normal)
  - Confidence: ${confidence}%
  - Variants: ${JSON.stringify(variants)}

  TASK:
  1. Explain the biological mechanism. 
  2. Provide a 1-sentence clinical action.
  3. Suggest 2 safer alternative drugs.
  
  CRITICAL RULE: If Phenotype is UM for Codeine, emphasize Morphine TOXICITY. If PM, emphasize lack of EFFICACY.
  
  RETURN JSON ONLY:
  {
    "summary": "...",
    "biological_mechanism": "...",
    "clinical_action": "...",
    "alternatives": ["Drug A", "Drug B"]
  }
`;

    try {
        const chat = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });
        
        // Parse the AI response
        const aiResult = JSON.parse(chat.choices[0].message.content);
        
        // Return the clean object
        return aiResult;

    } catch (e) {
        console.error("Groq API Error, using fallback:", e.message);
        const drugData = CLINICAL_FALLBACK[drug.toUpperCase()] || { alt: [], msg: "Generic alert." };
        return {
            summary: "Clinical Fallback Activated.",
            biological_mechanism: drugData.msg, // Changed 'mechanism' to match the JSON key
            clinical_action: "Consult clinical pharmacist for alternative dosing.",
            alternatives: drugData.alt
        };
    }
};