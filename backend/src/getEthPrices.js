import express from 'express';
import axios from "axios";
const router = express.Router();

// Endpoint to get ETH prices
router.get('/', async (req, res) => {
  const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH";
  const headers = {
    "X-CMC_PRO_API_KEY": "1f7f3068-4f15-489e-899c-201076fa1308", // Use your actual API key
    Accept: "application/json",
  };

  try {
    const response = await axios.get(url, { headers });
    const ethPriceInUsd = response.data.data.ETH.quote.USD.price;
    res.json({ ethPriceInUsd });
  } catch (error) {
    console.error("Failed to fetch ETH price:", error);
    res.status(500).send('Error fetching ETH price');
  }
});

// Export the router
export default router;
