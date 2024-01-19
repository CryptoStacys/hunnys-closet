// signingUtility.js
import { ethers } from 'ethers';

export const signData = (data, privateKey) => {
    const { userAddress, tokenIds, amounts, totalExpectedPrice, nonce } = data;

    // Construct the message or hash that you want to sign
    const message = ethers.utils.solidityKeccak256(
        ["address", "uint256[]", "uint256[]", "uint256", "uint256"],
        [userAddress, tokenIds, amounts, totalExpectedPrice, nonce]
    );

    // Sign the message
    const wallet = new ethers.Wallet(privateKey);
    const signature = wallet.signMessage(ethers.utils.arrayify(message));

    return signature;
};
