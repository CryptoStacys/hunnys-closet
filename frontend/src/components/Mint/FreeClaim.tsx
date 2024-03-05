import React, { useState } from 'react';
import { BigNumber } from 'ethers';
import { useAccount, useNetwork } from 'wagmi';
import newHunnysClosetShopABI from '../../data/abi/new-hunnys-closet-shop-abi.json'; // Adjust the path as necessary
import { Relayer } from '@openzeppelin/defender-relay-client';
import { ethers } from 'ethers'
import { toViem } from "@coinbase/waas-sdk-viem";
import { polygon } from "viem/chains";
import { createWalletClient, http, parseEther, custom } from "viem";
import { useAtom } from "jotai";
import { userAtom, connectedAtom } from "../../data/store"; // Adjust the import path as necessary
import { User } from "../../data/global";

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
  const [user] = useAtom(userAtom);
  const credentials = { apiKey: process.env.NEXT_PUBLIC_RELAYER_API_KEY as string, apiSecret: process.env.NEXT_PUBLIC_RELAYER_API_SECRET as string };
  const relayer = new Relayer(credentials);
  const nftContractAddress = "0x11bc733e719198e2b3746f6841d2818ca87af6da";
  const relayerAddress = "0x5C7E0dA70267937bC12a02c21fD1543f8A165Ba3";

  // produce an ERC-191 signed message.
  


  const handleFreeClaim = async () => {
  
    if (chain?.id !== 137) { // Ensure we're on Polygon
      alert("Please switch to the Polygon network.");
      return;
    }
  
    setTransactionPending(true);
  
    try {
      const contract = new ethers.Contract(nftContractAddress, newHunnysClosetShopABI, ethers.getDefaultProvider());
      const txData = contract.interface.encodeFunctionData("mint", [userAddress, tokenId, 1, "0x"]);
  
      if (user?.wallet_type === "waas") {
        if (!userAddress) {
          console.error("User address is undefined for WaaS wallet.");
          return;
        }
  
        const viemAccount = toViem(userAddress as any); // Casting userAddress to the expected type
        const walletClient = createWalletClient({
          account: viemAccount,
          chain: polygon,
          transport: http("https://polygon-mainnet.infura.io/v3/c6a0213e06df4189bbb84a64086a38ae"),
        });
        // Send transaction with WaaS wallet
        const txReceipt = await walletClient.sendTransaction({
          to: nftContractAddress,
          data: txData as any, // Casting txData to the expected type
          value: parseEther("0"),
        });
      } else {
        // Send transaction with traditional wallet via relayer
        const txReceipt = await relayer.sendTransaction({
          to: nftContractAddress,
          data: txData,
          gasLimit: "100000",
          speed: "fast",
        });
        console.log("Transaction sent:", txReceipt.hash);
      }
  
      alert("Mint successful! Check the console for transaction hash.");
      onMintSuccess();
      //@ts-ignore
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
