/**
 * ReportModel handles the final JSON construction and schema validation.
 */
class ReportModel {
  /**
   * Formats raw clinical data into the required competition schema.
   * @param {Object} data - The raw analysis data from the controller.
   * @returns {Object} - The strictly formatted JSON output.
   */
  static format(data) {
    const { 
      patientId, 
      drug, 
      variants, 
      cpicRec, 
      llmExplanation, 
      parsingSuccess,
      confidence // <--- ADD THIS: Pick up the score passed from the controller
    } = data;

    return {
      // 1. Identification & Meta
      patient_id: patientId || `PATIENT_${Math.random().toString(36).substring(7).toUpperCase()}`,
      drug: drug ? drug.toUpperCase() : "UNKNOWN",
      timestamp: new Date().toISOString(),

      // 2. Risk Assessment
      risk_assessment: {
        risk_label: cpicRec.risk_label || "Unknown",
        // FIX: Use the 'confidence' variable passed from the controller instead of cpicRec
        confidence_score: confidence || 0.0, 
        severity: cpicRec.severity || "none" 
      },

      // 3. Pharmacogenomic Profile
      pharmacogenomic_profile: {
        primary_gene: cpicRec.primary_gene || "Unknown",
        diplotype: cpicRec.diplotype || "*X/*Y",
        phenotype: cpicRec.phenotype || "Unknown",
        detected_variants: variants.map(v => ({
          rsid: v.rsid,
          genotype: v.genotype,
          impact: v.impact || "N/A"
        }))
      },

      // 4. Clinical Recommendation
      clinical_recommendation: {
        action: llmExplanation.clinical_action || cpicRec.action || "Consult with a healthcare professional.",
        alternatives: llmExplanation.alternatives || [], // ADDED: So your frontend can show alternative drugs
        guideline: "CPIC v4.2"
      },

      // 5. LLM Generated Explanation
      llm_generated_explanation: {
        summary: llmExplanation.summary || "No summary available.",
        // FIX: Mapping 'biological_mechanism' from the AI response
        biological_mechanism: llmExplanation.biological_mechanism || "Mechanism details pending."
      },

      // 6. Quality Metrics
      quality_metrics: {
        vcf_parsing_success: !!parsingSuccess,
        variant_count: variants.length,
        processing_time_ms: data.processingTime || 0
      }
    };
  }
}

module.exports = ReportModel;