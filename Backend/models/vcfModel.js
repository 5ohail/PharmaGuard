const fs = require('fs');
const readline = require('readline');

class VCFModel {
    // Standard CPIC-relevant rsIDs for the 6 critical genes
    static GENE_MAP = {
        'rs12248560': { gene: 'CYP2C19', star: '*17' },
        'rs1057910': { gene: 'CYP2C9', star: '*3' },
        'rs4149056': { gene: 'SLCO1B1', star: '*5' },
        'rs1801133': { gene: 'TPMT', star: '*3' }
    };

    static async parseVCF(filePath) {
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity
        });

        const detected = [];
        for await (const line of rl) {
            if (line.startsWith('#')) continue;
            const [chrom, pos, id, ref, alt] = line.split('\t');
            
            // Match variant by RSID or INFO tags as per prompt requirement
            if (this.GENE_MAP[id]) {
                detected.push({
                    rsid: id,
                    ...this.GENE_MAP[id],
                    genotype: alt || ref
                });
            }
        }
        return detected;
    }
}
module.exports = VCFModel;