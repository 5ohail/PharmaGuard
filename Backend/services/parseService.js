// Backend/parserService.js
exports.parseVCF = (fileBuffer) => {
    const lines = fileBuffer.toString().split('\n');
    const results = [];

    for (const line of lines) {
        if (line.startsWith('#') || !line.trim()) continue;

        const [chrom, pos, id, ref, alt, qual, filter, info, format, sample] = line.split('\t');
        
        // Extract Genotype (GT) from Sample column
        const genotype = sample ? sample.split(':')[0] : "0/0";
        
        // Calculate Confidence based on QUAL column
        const phred = parseFloat(qual);
        const confidence = !isNaN(phred) ? (1 - Math.pow(10, -(phred / 10))) * 100 : 85.0;

        results.push({
            rsid: id,
            genotype: genotype,
            confidence: confidence.toFixed(2),
            rawLine: line
        });
    }
    return results;
};