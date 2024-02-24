import React, { useState } from 'react';
import { BigNumber } from 'ethers';
import { useAccount, useNetwork } from 'wagmi';
import newHunnysClosetShopABI from '../../data/abi/new-hunnys-closet-shop-abi.json'; // Adjust the path as necessary
import { Relayer } from '@openzeppelin/defender-relay-client';
import { ethers } from 'ethers'

type FreeClaimProps = {
  tokenId: string | undefined;
  onMintSuccess: () => void;
  updateTraits: (userAddress: string) => void;
  userAddress: string | undefined;
  className?: string;
  buttonText?: string;
};

const FreeClaim: React.FC<FreeClaimProps> = ({
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
  const nftContractAddress = "0x11bc733e719198e2b3746f6841d2818ca87af6da";
  const relayerAddress = "0x5C7E0dA70267937bC12a02c21fD1543f8A165Ba3";

  const handleFreeClaim = async () => {
    if (!isConnected || !userAddress || !tokenId) {
      console.error("Wallet not connected or missing parameters.");
      alert("Please connect your wallet and ensure all required fields are filled.");
      return;
    }
  
    if (chain?.id !== 137) { // Ensure we're on Polygon
      alert("Please switch to the Polygon network.");
      return;
    }
  
    setTransactionPending(true);
  
    try {
      const contract = new ethers.Contract(nftContractAddress, newHunnysClosetShopABI, ethers.getDefaultProvider());
      const txData = contract.interface.encodeFunctionData("mint", [userAddress, tokenId, 1, "0x"]);
  
      // Replace this URL with your Autotask's webhook URL
      const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL as string;
  
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: nftContractAddress,
          data: txData,
          gasLimit: "100000", // Adjust as needed
          speed: "fast",
          // Include any other necessary parameters
        }),
      });
  
      const txRes = await response.json();
  
      console.log("Transaction sent:", txRes.hash);
      alert("Mint successful! Transaction hash: " + txRes.hash);
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
      onClick={handleFreeClaim}
      disabled={isTransactionPending}
      className={`${className || ''} ${isTransactionPending ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'}`}
    >
      {isTransactionPending ? "Processing..." : (buttonText || "Claim for Free")}
    </button>
  );
};

export default FreeClaim;
