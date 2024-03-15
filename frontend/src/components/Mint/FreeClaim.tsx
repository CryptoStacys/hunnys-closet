import React, { useState } from 'react';
import { BigNumber } from 'ethers';
import { useAccount, useNetwork } from 'wagmi';
import newHunnysClosetShopABI from '../../data/abi/new-hunnys-closet-shop-abi.json'; // Adjust the path as necessary
import { Relayer, RelayerTransaction } from '@openzeppelin/defender-relay-client';
import { ethers } from 'ethers'
import { toViem } from "@coinbase/waas-sdk-viem";
import { polygon } from "viem/chains";
import { createWalletClient, http, parseEther, custom } from "viem";
import { useAtom } from "jotai";
import { userAtom, connectedAtom } from "../../data/store"; // Adjust the import path as necessary
import { User } from "../../data/global";

type FreeClaimProps = {
  tokenId: any;
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
  const [user, setUser] = useAtom(userAtom);
  const credentials = { apiKey: "9nvcqgREPR99qZnN9tPXsimrqARgATxk", apiSecret: "4TmDUwtfNDujJB1MPxnKEJDpUmWAQN7izdY8U2ptwsCzrFRC9XGxDx9ePWbSNhyT" as string };
  const relayer = new Relayer(credentials);
  const nftContractAddress = "0x11bc733e719198e2b3746f6841d2818ca87af6da";
  const relayerAddress = "0x5C7E0dA70267937bC12a02c21fD1543f8A165Ba3";

  // produce an ERC-191 signed message.
  


  const handleFreeClaim = async () => {
    setTransactionPending(true);
    let txReceipt: string | RelayerTransaction;
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
        txReceipt = await walletClient.sendTransaction({
          to: nftContractAddress,
          data: txData as any, // Casting txData to the expected type
          value: parseEther("0"),
        });
      } else {
        // Send transaction with traditional wallet via relayer
        txReceipt = await relayer.sendTransaction({
          to: nftContractAddress,
          data: txData,
          gasLimit: "100000",
          speed: "fast",
        });
      }
      //@ts-ignore
        console.log("Transaction sent:", txReceipt.hash);
  
      alert("Claim Successful!");
      onMintSuccess();
      //@ts-ignore
      updateTraits(userAddress);

    // Update claim status in database after successful mint
    const profileData = {
      action: "freeClaim", // Define your backend action
      wallet: user?.wallet,
      claimed: true,
      //@ts-ignore
      transactionhash: txReceipt.hash,
      tokenId: tokenId,
      dateOfClaim: new Date().toISOString(), // JavaScript way to get the current date/time
    };

    const response = await fetch(
      `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`, // Update to your real endpoint URL
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      }
    );

    const data = await response.json();
    if (data.success) {
      console.log("Claim updated successfully in database");
      // Update the userAtom directly with the new data
      setUser((prevUser) => {
        if (!prevUser || !prevUser.free_claim) return prevUser;

        // Construct the new claim
        const newClaim = {
          token_id: tokenId,
          claimed: true,
          date_claimed: new Date().toISOString(),
          //@ts-ignore
          transaction_hash: txReceipt.hash,
        };

        // Append new claim to the array, preserving its structure
        const updatedFreeClaims = [...prevUser.free_claim, newClaim];
        
        return {
          ...prevUser,
          free_claim: updatedFreeClaims,
        };
      });
    } else {
      console.error(data.message || "Failed to update claim in database");
    }

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
      className={`${className || ''} ${isTransactionPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isTransactionPending ? "Processing..." : (buttonText || "Claim for Free")}
    </button>
  );
};

export default FreeClaim;
