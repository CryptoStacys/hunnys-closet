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
  const nftContractAddress = "0x11bc733e719198e2b3746f6841d2818ca87af6da";
  const relayerAddress = "0x5C7E0dA70267937bC12a02c21fD1543f8A165Ba3";

  // produce an ERC-191 signed message.
  


  const handleFreeClaim = async () => {
    setTransactionPending(true);
    try {
      const contract = new ethers.Contract(nftContractAddress, newHunnysClosetShopABI, ethers.getDefaultProvider());
      const txData = contract.interface.encodeFunctionData("mint", [userAddress, tokenId, 1, "0x"]);
  
      // Determine if the user is using a WaaS wallet or a traditional wallet
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
        // Prepare the transaction data
        const transactionData = {
          to: nftContractAddress,
          data: txData,
          gasLimit: "100000", // Specify the gas limit for your transaction
          speed: "fast" // This is optional and depends on your implementation
        };

        // Send the transaction data to your /gasless endpoint
        const response = await fetch('https://staging-hunnys-closet-2-548f5ed67a1b.herokuapp.com/gasless', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const txReceipt = await response.json();
        console.log("Transaction sent via /gasless endpoint:", txReceipt.transactionHash);
      }

      alert("Claim Successful!");
      onMintSuccess();
      //@ts-ignore
      updateTraits(userAddress);

    // Update claim status in database after successful mint
    const profileData = {
      action: "freeClaim", // Define your backend action
      wallet: user?.wallet,
      claimed: true,
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
        const freeClaimsArray = Array.isArray(prevUser.free_claim) ? prevUser.free_claim : [];
        // Construct the new claim
        const newClaim = {
          token_id: tokenId,
          claimed: true,
          date_claimed: new Date().toISOString(),
          transaction_hash: data.transactionHash, // Ensure this is correctly populated
        };
      
        // Append new claim to the array, preserving its structure
        const updatedFreeClaims = [...freeClaimsArray, newClaim];
        
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
