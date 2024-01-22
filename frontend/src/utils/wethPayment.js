// src/utils/wethPayment.js
import { ethers } from "ethers";
import { WETH_ADDRESS, WETH_ABI } from './wethInfo'; // Assuming you have WETH_ABI defined
import { SALES_CONTRACT_ADDRESS, SALES_CONTRACT_ABI } from './salesContractInfo';

export async function handleWethPayment(userAddress, tokenId, mintPrice, provider) {
  const signer = provider.getSigner();
  const wethContract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, signer);
  const salesContract = new ethers.Contract(SALES_CONTRACT_ADDRESS, SALES_CONTRACT_ABI, signer);

  const allowance = await wethContract.allowance(userAddress, SALES_CONTRACT_ADDRESS);
  if (allowance.lt(mintPrice)) {
    const approveTx = await wethContract.approve(SALES_CONTRACT_ADDRESS, mintPrice);
    await approveTx.wait();
  }

  // Add minting logic here or return to caller for further action
}
