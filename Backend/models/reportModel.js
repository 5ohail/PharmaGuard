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
      parsingSuccess 
    } = data;

    return {
      // 1. Identification & Meta
      patient_id: patientId || `PATIENT_${Math.random().toString(36).substring(7).toUpperCase()}`,
      drug: drug ? drug.toUpperCase() : "UNKNOWN",
      timestamp: new Date().toISOString(),

      // 2. Risk Assessment
      risk_assessment: {
        risk_label: cpicRec.risk_label || "Unknown", // Safe|Adjust Dosage|Toxic|...
        confidence_score: cpicRec.confidence_score || 0.0,
        severity: cpicRec.severity || "none" // none|low|moderate|high|critical
      },

      // 3. Pharmacogenomic Profile
      pharmacogenomic_profile: {
        primary_gene: cpicRec.primary_gene || "Unknown",
        diplotype: cpicRec.diplotype || "*X/*Y",
        phenotype: cpicRec.phenotype || "Unknown", // PM|IM|NM|RM|URM|Unknown
        detected_variants: variants.map(v => ({
          rsid: v.rsid,
          genotype: v.genotype,
          impact: v.impact || "N/A"
        }))
      },

      // 4. Clinical Recommendation
      clinical_recommendation: {
        action: cpicRec.action || "Consult with a healthcare professional.",
        guideline: "CPIC v4.2"
      },

      // 5. LLM Generated Explanation
      llm_generated_explanation: {
        summary: llmExplanation.summary || "No summary available.",
        biological_mechanism: llmExplanation.mechanism || "Mechanism details pending."
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