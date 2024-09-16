# CalculateSoniaRate
This repository contains an Azure Function that calculates the Sterling Overnight Index Average (SONIA) rate. It accepts JSON or CSV input, filters anomalous transactions, and computes the rate using the median of valid transactions. Includes Node.js implementation and a sample dataset of 100 transactions for testing.

# **SONIA Rate Calculator**

This Azure Function calculates the **Sterling Overnight Index Average (SONIA)** rate based on transaction data provided in JSON format. The function filters out anomalies and calculates the median of valid transactions to return the SONIA rate.

## **How to Use**

1. Send an HTTP POST request to the following URL:
   
   ```
   https://soniaratefunctionapp.azurewebsites.net/api/CalculateSoniaRate?code=qcyamHqRJjMchVHL4xvuSFZICvm6cCibEbpq7ubjtbdZAzFu_G_2Jg%3D%3D
   ```

2. The body of the request should be in **JSON format**. Here is an example:

   ```json
   [
     {
       "Amount": 500000,
       "Timestamp": "2024-09-10T14:30:00",
       "Counterparty": "Bank A",
       "Currency": "GBP"
     },
     {
       "Amount": 800000,
       "Timestamp": "2024-09-10T15:00:00",
       "Counterparty": "Bank B",
       "Currency": "GBP"
     },
     {
       "Amount": 2000000,
       "Timestamp": "2024-09-10T15:30:00",
       "Counterparty": "Bank C",
       "Currency": "GBP"
     }
   ]
   ```

3. The function will return the SONIA rate in the following format:

   ```json
   {
     "SONIARate": 650000
   }
   ```

In this case, the SONIA rate is calculated as the median of the valid transactions (excluding any transaction exceeding £1,000,000).

License

This project is licensed under the MIT License.

