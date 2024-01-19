import express from 'express';
import { signData } from './signingUtility';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { userAddress, tokenIds, amounts, totalExpectedPrice, nonce } = req.body;
        const privateKey = process.env.PRIVATE_KEY;

        // Perform the signing operation here
        // Make sure signData is a function that exists and returns the signature
        const signature = signData({ userAddress, tokenIds, amounts, totalExpectedPrice, nonce }, privateKey);

        res.json({ signature });
    } catch (error) {
        console.error('Error signing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the router
export default router;
