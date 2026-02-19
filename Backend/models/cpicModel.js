class CPICModel {
    static getRecommendation(drug, variants) {
        const drugName = drug.toUpperCase();
        
        // Example logic for the mandatory 6 genes
        const rules = {
            'CODEINE': { gene: 'CYP2D6', risk: 'Toxic', pheno: 'UM', action: 'Avoid use. High risk of morphine toxicity.' },
            'CLOPIDOGREL': { gene: 'CYP2C19', risk: 'Ineffective', pheno: 'PM', action: 'Use alternative antiplatelet (Prasugrel).' },
            'SIMVASTATIN': { gene: 'SLCO1B1', risk: 'Adjust Dosage', pheno: 'Decreased Function', action: 'Limit dose to 20mg daily.' },
            'WARFARIN': { gene: 'CYP2C9', risk: 'Adjust Dosage', pheno: 'IM', action: 'Reduce starting dose by 25%.' },
            'AZATHIOPRINE': { gene: 'TPMT', risk: 'Toxic', pheno: 'PM', action: 'Reduce dose by 10x or use alternative.' },
            'FLUOROURACIL': { gene: 'DPYD', risk: 'Toxic', pheno: 'PM', action: 'Avoid use. High risk of severe toxicity.' }
        };

        const rule = rules[drugName] || { risk: 'Unknown', pheno: 'Unknown', action: 'Consult CPIC guidelines.' };
        
        return {
            risk_label: rule.risk,
            severity: rule.risk === 'Toxic' ? 'critical' : 'moderate',
            primary_gene: rule.gene,
            phenotype: rule.pheno,
            action: rule.action
        };
    }
}
module.exports = CPICModel;