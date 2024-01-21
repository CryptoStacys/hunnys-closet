// src/utils/eligibleTokens.js
import { ethers } from "ethers";
import salesABI from "../../../backend/src/abis/hunnys-closet-sales-abi.json";
export const WETH_ADDRESS = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; // WETH Address on Polygon
import WETH_ABI from "../../../backend/src/abis/weth-abi.json";
const salesContractAddress = "0x66923e2842da52b3e419fbbc79f07f1c8b0e908a"; // Update with your sales contract address
const nftContractAddress = "0x11bc733e719198e2b3746f6841d2818ca87af6da";

export type EligibleToken = {
  token_id: string;
  price: ethers.BigNumber;
  origin_ids: number[];
};

// Define your Bunny Club members list and discount rate
const bunnyClubMembers = ["0xa7758394D8f7fD23b0d9F13E02427B514687394B", "0xd3500e2F117cE1e46812C870cB343268EC9f005a", "0xAddress3"]; // Replace with actual addresses
const bunnyClubDiscount = 10; // 10% discount

export const eligibleTokenIds: EligibleToken[] = [
  { token_id: '0', price: ethers.utils.parseUnits("0.01", "ether"), origin_ids: [7, 9] },
  { token_id: '2', price: ethers.utils.parseUnits("0.0125", "ether"), origin_ids: [7, 9] },
  { token_id: '3', price: ethers.utils.parseUnits("0.01", "ether"), origin_ids: [7, 9] },
  { token_id: '4', price: ethers.utils.parseUnits("0.028", "ether"), origin_ids: [7, 9] },
  { token_id: '5', price: ethers.utils.parseUnits("0.03", "ether"), origin_ids: [7, 9] },
  { token_id: '6', price: ethers.utils.parseUnits("0.002", "ether"), origin_ids: [7, 9] },
  { token_id: '7', price: ethers.utils.parseUnits("0.0012", "ether"), origin_ids: [7, 9] },
  { token_id: '8', price: ethers.utils.parseUnits("0.018", "ether"), origin_ids: [7, 9] },
  { token_id: '9', price: ethers.utils.parseUnits("0.003", "ether"), origin_ids: [7, 9] },
  { token_id: '10', price: ethers.utils.parseUnits("0.00002", "ether"), origin_ids: [7, 9] },
  { token_id: '11', price: ethers.utils.parseUnits("0.008", "ether"), origin_ids: [7, 9] },
  { token_id: '46', price: ethers.utils.parseUnits("0.05", "ether"), origin_ids: [7, 9] },
  { token_id: '47', price: ethers.utils.parseUnits("0.05", "ether"), origin_ids: [7, 9] },
  { token_id: '48', price: ethers.utils.parseUnits("0.013", "ether"), origin_ids: [7, 9] },
  { token_id: '49', price: ethers.utils.parseUnits("0.0", "ether"), origin_ids: [7, 9] },
  { token_id: '50', price: ethers.utils.parseUnits("0.003", "ether"), origin_ids: [7, 9] },
  { token_id: '51', price: ethers.utils.parseUnits("0.007", "ether"), origin_ids: [7, 9] },
  { token_id: '52', price: ethers.utils.parseUnits("0.003", "ether"), origin_ids: [7, 9] },
  { token_id: '53', price: ethers.utils.parseUnits("0.003", "ether"), origin_ids: [7, 9] },
  { token_id: '54', price: ethers.utils.parseUnits("0.003", "ether"), origin_ids: [7, 9] },
  { token_id: '55', price: ethers.utils.parseUnits("0.01", "ether"), origin_ids: [7, 9] },
  { token_id: '56', price: ethers.utils.parseUnits("0.015", "ether"), origin_ids: [7, 9] },
  { token_id: '57', price: ethers.utils.parseUnits("0.015", "ether"), origin_ids: [7, 9] },
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
    console.log("Received signature response:", data);
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

    // Check WETH allowance
    const allowance = await wethContract.allowance(userAddress, salesContractAddress);
    console.log(`Current allowance: ${allowance.toString()}`);

    // Check if user is a Bunny Club member and apply discount
    if (bunnyClubMembers.includes(userAddress.toLowerCase())) {
      const discount = mintPrice.mul(bunnyClubDiscount).div(100);
      mintPrice = mintPrice.sub(discount);
    }
    
    // Only request new approval if mintPrice is greater than current allowance
    if (allowance.lt(mintPrice)) {
      const approveTx = await wethContract.approve(salesContractAddress, ethers.constants.MaxUint256);
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

    console.log("User Address: ", userAddress);
    console.log("Token ID: ", tokenId);
    console.log("Mint Price: ", mintPrice.toString());
    console.log("Nonce: ", nonce);
    console.log("Signature: ", signature);
    
    const mintRequest = {
      tokenIds: [tokenId],
      amounts: [1],
      totalExpectedPrice: mintPrice,
      data: '0x',
      nonce: nonce,
      signature: signature
    };
    
    console.log("Mint Request: ", mintRequest);
    console.log("Final Mint Request:", mintRequest);

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