// src/utils/eligibleTokens.js
import { ethers } from "ethers";
import salesABI from "../../../backend/src/abis/hunnys-closet-sales-abi.json";
export const WETH_ADDRESS = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; // WETH Address on Polygon
import WETH_ABI from "../../../backend/src/abis/weth-abi.json";
const salesContractAddress = "0xc451d87d41390b8a4e398a137209eed4475d4dd5"; // Update with your sales contract address
const nftContractAddress = "0x11bc733e719198e2b3746f6841d2818ca87af6da";

export type EligibleToken = {
  token_id: string;
  price: ethers.BigNumber;
  origin_ids: number[];
};

export const eligibleTokenIds: EligibleToken[] = [
  { token_id: '55', price: ethers.utils.parseUnits("0.00001", "ether"), origin_ids: [7, 9] },
  // ... more tokens
];

// Add this function to make a request to your server for signing
const requestSignature = async (userAddress: string, tokenId: string | number, mintPrice: ethers.BigNumber, nonce: number) => {
  try {
    const response = await fetch('https://staging-hunnys-closet-2-548f5ed67a1b.herokuapp.com/signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAddress,
        tokenIds: [tokenId],
        amounts: [1],
        totalExpectedPrice: mintPrice,
        nonce
      })
    });
    const data = await response.json();
    return data.signature;
  } catch (error) {
    console.error('Error requesting signature:', error);
    throw error;
  }
};

// Function to handle WETH payment
export const mintWithWeth = async (
  userAddress: string,
  tokenId: string | number,
  mintPrice: ethers.BigNumber,
  provider: ethers.providers.Web3Provider
) => {
  try {
    const signer = provider.getSigner();
    const wethContract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, signer);
    const salesContract = new ethers.Contract(salesContractAddress, salesABI, signer);

    // Check and request WETH allowance if needed
    const allowance = await wethContract.allowance(userAddress, salesContractAddress);
    if (allowance.lt(mintPrice)) {
      const approveTx = await wethContract.approve(salesContractAddress, mintPrice);
      await approveTx.wait();
    }

    const nonce = await findUnusedNonce(salesContract, userAddress);
   // const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

    // Data package for signing
    const dataToSign = ethers.utils.solidityKeccak256(
      ["address", "uint256[]", "uint256[]", "uint256", "uint256"],
      [userAddress, [tokenId], [1], mintPrice, nonce]
    );

    // Requesting signature from user's wallet
    const signature = await requestSignature(userAddress, tokenId, mintPrice, nonce);

    console.log("Data to Sign: ", dataToSign);
    console.log("Nonce: ", nonce);
    console.log("Signature: ", signature);

    // MintRequest object with signature and nonce
    const mintRequest = {
      tokenIds: [tokenId],
      amounts: [1],
      totalExpectedPrice: mintPrice,
      data: '0x',
      nonce: nonce,
      signature: signature
    };

    // Minting process
    const mintTx = await salesContract.mintTokens(nftContractAddress, mintRequest);
    await mintTx.wait();
    return "Mint successful";
  } catch (error) {
    console.error("Minting with WETH failed:", error);
    throw error;
  }
};

async function findUnusedNonce(salesContract: ethers.Contract, userAddress: string) {
  let nonce = 0;
  while (true) {
    const isUsed = await salesContract.usedNonces(userAddress, nonce);
    if (!isUsed) {
      return nonce;
    }
    nonce++;
  }
}