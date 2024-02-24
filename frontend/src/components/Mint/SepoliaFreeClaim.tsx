import React, { useState } from 'react';
import { BigNumber } from 'ethers';
import sepoliaTestClaim from '../../data/abi/sepolia-test-claim-abi.json'; // Adjust the path as necessary
import { Relayer } from '@openzeppelin/defender-relay-client';
import { ethers } from 'ethers'
import { toViem } from "@coinbase/waas-sdk-viem";
import { createWalletClient, http, parseEther } from "viem";
import { baseSepolia } from "viem/chains";
import { Address } from "@coinbase/waas-sdk-web";
import { useAccount, useNetwork } from 'wagmi';

type SepoliaFreeClaimProps = {
  tokenId: string | undefined;
  onMintSuccess: () => void;
  updateTraits: (userAddress: string) => void;
  userAddress: string | undefined;
  className?: string;
  buttonText?: string;
};

const SepoliaFreeClaim: React.FC<SepoliaFreeClaimProps> = ({
  tokenId,
  onMintSuccess,
  updateTraits,
  userAddress,
  className,
  buttonText,
}) => {
  const [isTransactionPending, setTransactionPending] = useState(false);
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const credentials = { apiKey: process.env.NEXT_PUBLIC_RELAYER_API_KEY as string, apiSecret: process.env.NEXT_PUBLIC_RELAYER_API_SECRET as string };
  const relayer = new Relayer(credentials);
  const nftContractAddress = "0x65f575A3C3cf16AB9a97eBF9ef1b29d6cE3Ed4dC";
  const relayerAddress = "0xA3E569da4f24DD8c70D1Cb8c970D75A1f3bE5aa1";

  const handleSepoliaFreeClaim = async () => {
    if (!isConnected || !userAddress || !tokenId) {
      console.error("Wallet not connected or missing parameters.");
      alert("Please connect your wallet and ensure all required fields are filled.");
      return;
    }

    if (chain?.id !== 84532) { // Ensure we're on Polygon
      alert("Please switch to the Polygon network.");
      return;
    }

    setTransactionPending(true);

    try {
        const contract = new ethers.Contract(nftContractAddress, sepoliaTestClaim, ethers.getDefaultProvider());
        const txData = contract.interface.encodeFunctionData("mintTo", [userAddress, tokenId, "", 1]);
  
        const tx = await relayer.sendTransaction({
          to: nftContractAddress,
          data: txData,
          gasLimit: "100000", // Set an appropriate gas limit
          speed: "fast"
        });
  
        console.log("Transaction sent:", tx.hash);
        alert("Mint successful! Transaction hash: " + tx.hash);
        onMintSuccess();
        updateTraits(userAddress);
      } catch (error) {
        console.error("Error during free claim:", error);
        alert("Failed to claim the NFT. Please try again.");
      } finally {
        setTransactionPending(false);
      }
    };
  

  return (
    <button
      onClick={handleSepoliaFreeClaim}
      disabled={isTransactionPending}
      className={`${className || ''} ${isTransactionPending ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'}`}
    >
      {isTransactionPending ? "Processing..." : (buttonText || "Claim for Free")}
    </button>
  );
};

export default SepoliaFreeClaim;
