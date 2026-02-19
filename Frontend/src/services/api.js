import axios from 'axios';

const ENV =  'production';
const BASE_URL = ENV === 'production' ? 'https://pharmaguard-y6gy.onrender.com/api/v1' : 'http://localhost:5000/api/v1';

const instance = axios.create({
    baseURL: BASE_URL,
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