import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount, useSwitchChain } from "wagmi";
import { base } from "@wagmi/core/chains";
import { abi as BunnyClubAbi } from "../../utils/bunnyClubAbi";
import { config } from "../../utils/wagmiConfig";
import { fetchBalances } from "../../utils/fetchBalances";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";

const bunnyClubContractAddress = "0x95c1ab4c5ba7f583abb211239d3dd1beae806a11";

interface BunnyClubBuyProps {
  months: string;
  price: string;
  ethPrice: number;
  className?: string; // Add this line
  mintPrice?: BigNumber;
  baseBalance: string;
}

const BunnyClubBuy: React.FC<BunnyClubBuyProps> = ({
  months,
  price,
  ethPrice,
  className,
  baseBalance,
}) => {
  const { chain, isConnected } = useAccount();
  const [isTransactionPending, setTransactionPending] = useState(false);
  const { chains, switchChain } = useSwitchChain();
  const BASE_CHAIN_ID = base.id; // Base chain ID
  const [user] = useAtom(userAtom);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // Calculate membership cost in ETH
  const membershipCostInEth = (parseFloat(price) / ethPrice).toFixed(5);  

  const handleMint = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    if (chain?.id === 1 || chain?.id !== BASE_CHAIN_ID && switchChain) {
        switchChain({ chainId: BASE_CHAIN_ID });
        return;
      }

    setTransactionPending(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request access
    const signer = provider.getSigner();

    try {
      const monthsNum = parseInt(months, 10);
      if (isNaN(monthsNum)) {
        throw new Error("Invalid months parameter");
      }
      if (!ethers.utils.isAddress(bunnyClubContractAddress)) {
        throw new Error("Invalid contract address");
      }

      const contract = new ethers.Contract(
        bunnyClubContractAddress,
        BunnyClubAbi,
        signer
      );

      const usdPrice = parseFloat(price);
      const ethEquivalentPrice = usdPrice / ethPrice;
      const ethEquivalentPriceStr = ethEquivalentPrice.toFixed(5);
      const ethRequired = ethers.utils.parseUnits(
        ethEquivalentPriceStr,
        "ether"
      );

      const transaction = await contract.mintMembership(monthsNum, {
        value: ethRequired,
      });
      console.log("Minting transaction sent:", transaction.hash);
      await transaction.wait();
      alert("Membership minted successfully!");
    } catch (error) {
      console.error("Error minting membership:", error);
      alert("Failed to purchase membership. Check your current balance.");
    } finally {
      setTransactionPending(false);
    }
  };

  const baseButtonClass = "mint-btn text-white font-bold py-2 px-4 rounded";
  const additionalClasses = `${className || ""} ${
    isTransactionPending || isButtonDisabled ? "opacity-50" : ""
  } ${
    isTransactionPending || isButtonDisabled
      ? "bg-gray-500"
      : "bg-[#7B2BFF] hover:bg-[#9e63ff] rounded-full"
  }`;

  return (
    <button
      onClick={handleMint}
      disabled={isTransactionPending || isButtonDisabled}
      className={`${baseButtonClass} ${additionalClasses}`}
    >
      Ξ{membershipCostInEth}
    </button>
  );
};

export default BunnyClubBuy;
