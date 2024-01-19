// server-side function (e.g., an Express.js route or serverless function)
app.post('/signMintRequest', async (req, res) => {
    try {
      const { userAddress, tokenIds, amounts, totalExpectedPrice, nonce } = req.body;
      const privateKey = process.env.PRIVATE_KEY;
  
      // Perform the signing operation here
      const signature = signData({ userAddress, tokenIds, amounts, totalExpectedPrice, nonce }, privateKey);
  
      res.json({ signature });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  