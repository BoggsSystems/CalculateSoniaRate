const csv = require('csv-parser');
const { Readable } = require('stream');

module.exports = async function (context, req) {
    context.log('CalculateSoniaRate function triggered with a CSV file');

    // Check if a file is uploaded
    if (!req.body || !req.headers['content-type'].includes('multipart/form-data')) {
        context.res = {
            status: 400,
            body: "Please upload a CSV file."
        };
        return;
    }

    try {
        const csvData = await parseCSV(req.body);
        
        if (!csvData || csvData.length === 0) {
            context.res = {
                status: 400,
                body: "The CSV file is empty or invalid."
            };
            return;
        }

        // Process the parsed CSV data and calculate the SONIA rate
        const soniaRate = calculateSoniaRate(csvData);
        
        // Return the calculated SONIA rate
        context.res = {
            status: 200,
            body: { SONIARate: soniaRate }
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `An error occurred while processing the CSV file: ${error.message}`
        };
    }
};

// Helper function to parse the CSV data
async function parseCSV(fileBuffer) {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = Readable.from(fileBuffer);

        stream.pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

// Function to calculate SONIA rate
function calculateSoniaRate(transactions) {
    // Convert CSV row data to numbers and filter anomalies
    const validTransactions = transactions
        .map(t => ({ ...t, Amount: parseFloat(t.Amount) }))
        .filter(t => t.Amount < 1000000);  // Filtering logic for anomalies

    // Calculate the median of valid transaction amounts
    const amounts = validTransactions.map(t => t.Amount);
    return median(amounts);
}

// Helper function to calculate the median
function median(arr) {
    if (arr.length === 0) throw new Error("No valid transactions to calculate the rate.");
    
    const sorted = arr.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    return (sorted.length % 2 === 0) ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
