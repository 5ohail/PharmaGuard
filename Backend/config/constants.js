module.exports = {
  SUPPORTED_GENES: ['CYP2D6', 'CYP2C19', 'CYP2C9', 'SLCO1B1', 'TPMT', 'DPYD'],
  CPIC_GUIDELINES: {
    'CODEINE': { gene: 'CYP2D6', action: 'Avoid use in Ultra-rapid Metabolizers due to toxicity.' },
    'CLOPIDOGREL': { gene: 'CYP2C19', action: 'Consider alternative in Poor Metabolizers.' },
    'WARFARIN': { gene: 'CYP2C9', action: 'Reduce starting dose based on genotype.' },
    'SIMVASTATIN': { gene: 'SLCO1B1', action: 'Limit dose to 20mg if decreased function detected.' },
    'AZATHIOPRINE': { gene: 'TPMT', action: 'Reduce dose by 10-fold in Poor Metabolizers.' },
    'FLUOROURACIL': { gene: 'DPYD', action: 'Avoid or significantly reduce dose to prevent toxicity.' }
  }
};