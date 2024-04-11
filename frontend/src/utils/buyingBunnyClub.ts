// src/utils/buyingBunnyClub.js
import { ethers } from "ethers";
import { WaasEthersSigner } from "@coinbase/waas-sdk-ethers";
import { Address } from "@coinbase/waas-sdk-web";
import {
  Account,
  WalletClient,
  createPublicClient,
  createWalletClient,
  getContract,
} from "viem";
import { abi as bunnyClubAbi } from "./bunnyClubAbi";
import { base } from "viem/chains";
import { http } from "viem";
import { toViem } from "@coinbase/waas-sdk-viem";

export type EligibleToken = {
  token_id: string;
  price: ethers.BigNumber;
  origin_ids: number[];
};

const bunnyClubAddress = "0xeac27e57547835cee0e56eb11dc3684ea6c6d756";

const publicBaseClient = createPublicClient({
  chain: base,
  transport: http(
    "https://base-mainnet.g.alchemy.com/v2/Y9AirihU_kvzbWDOO7RPs68bSH5DtFTG"
  ), 
});

export async function mintBunnyClubMembership(months: number, value: string) {
  const BASE_CHAIN_ID = 8453; // Ethereum Mainnet
  // Ensure window.ethereum is available
  if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum as any);
          const { chainId } = await provider.getNetwork();
      if (chainId !== BASE_CHAIN_ID) {
          console.error("Not on Ethereum Mainnet.");
          throw new Error("Please switch to Ethereum Mainnet to mint your Dolly.");
      }

      try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const signer = provider.getSigner();

          // Connect to the contract
          const contract = new ethers.Contract(bunnyClubAddress, bunnyClubAbi, signer);

          // Execute the mint function
          console.log("Attempting to write transaction...");
          const txResponse = await contract.mintMembership(months, { value }); // Adjust args as necessary
          console.log("Transaction response:", txResponse);

          // Wait for the transaction to be mined
          const receipt = await txResponse.wait();
          console.log('Transaction confirmed:', receipt);

          // Return the hash of the transaction
          return { hash: txResponse.hash };
      } catch (error) {
          console.error("Transaction failed or was rejected:", error);
          throw error; // Ensure the error is caught by the caller
      }
  } else {
      console.error("Base object doesn't exist!");
      throw new Error("Base object doesn't exist!");
  }
}
