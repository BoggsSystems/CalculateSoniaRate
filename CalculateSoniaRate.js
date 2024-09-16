module.exports = async function (context, req) {
    context.log('CalculateSoniaRate function triggered');

    // Parse the request body
    const transactions = req.body;

    if (!transactions || !Array.isArray(transactions)) {
        context.res = {
            status: 400,
            body: "Invalid input. Please provide an array of transactions."
        };
        return;
    }

    try {
        // Calculate the SONIA interest rate using the SoniaCalculator
        const soniaRate = calculateSoniaInterestRate(transactions);
        
        // Return the result
        context.res = {
            status: 200,
            body: { SONIARate: soniaRate }
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: "An error occurred: " + error.message
        };
    }
};

// Function to calculate SONIA interest rate
function calculateSoniaInterestRate(transactions) {
    // Filter out anomalies (transactions that exceed a certain threshold)
    const validTransactions = filterAnomalies(transactions);

    // Calculate the volume-weighted average interest rate
    const totalVolume = validTransactions.reduce((sum, t) => sum + t.Amount, 0);
    const totalWeightedRate = validTransactions.reduce((sum, t) => sum + (t.Amount * t.InterestRate), 0);

    if (totalVolume === 0) {
        throw new Error("No valid transactions found.");
    }

    // Return the volume-weighted average interest rate
    return totalWeightedRate / totalVolume;
}

// Function to filter anomalies from the transactions
function filterAnomalies(transactions) {
    const threshold = 1000000; // Example threshold for anomaly
    return transactions.filter(t => t.Amount < threshold);
}
