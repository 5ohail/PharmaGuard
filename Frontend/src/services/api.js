import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3001/api/v1',
});

export const runPGxAnalysis = async (drug, vcfFile) => {
    const formData = new FormData();
    formData.append('drug', drug);
    formData.append('vcf', vcfFile);
    return instance.post('/analyze', formData);
};

export const analyzeGenomics = async (drug, vcfFile) => {
    const formData = new FormData();
    formData.append('drug', drug);
    formData.append('vcf', vcfFile);
    
    // We return the promise directly
    return instance.post('/analyze', formData);
};