// src/utils/mintDolly.ts
import { ethers } from 'ethers';
import closetABI from '../data/abi/HunnysCloset.json';
import { closetAddress } from '../data/config';

export async function mintNewDolly() {
    const ETHEREUM_MAINNET_CHAIN_ID = 1; // Ethereum Mainnet
    // Ensure window.ethereum is available
    if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum as any);
            const { chainId } = await provider.getNetwork();
        if (chainId !== ETHEREUM_MAINNET_CHAIN_ID) {
            console.error("Not on Ethereum Mainnet.");
            throw new Error("Please switch to Ethereum Mainnet to mint your Dolly.");
        }

        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const signer = provider.getSigner();

            // Connect to the contract
            const contract = new ethers.Contract(closetAddress, closetABI, signer);

            // Execute the mint function
            console.log("Attempting to write transaction...");
            const txResponse = await contract.mintPublic(1); // Adjust args as necessary
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
        console.error("Ethereum object doesn't exist!");
        throw new Error("Ethereum object doesn't exist!");
    }
}
