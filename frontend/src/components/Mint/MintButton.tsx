// MintButton.tsx
import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { useAccount, useConfig, useSwitchChain } from "wagmi";
import salesABI from "../../../../backend/src/abis/hunnys-closet-sales-abi.json";
import { toViem } from "@coinbase/waas-sdk-viem";
import {
  Address,
  IProtocolFamily,
  ProtocolFamily,
} from "@coinbase/waas-sdk-web";
import { useEVMAddress, useFirstAddress, useWalletContext } from "@coinbase/waas-sdk-web-react";
import { createWalletClient, http, parseEther } from "viem"; 
import { polygon } from "viem/chains";

type MintButtonProps = {
  tokenId: string | undefined;
  mintPrice?: BigNumber;
  isEligibleForMinting?: boolean | string[];
  onMintSuccess: () => void;
  updateTraits: (userAddress: string) => void;
  userAddress: string | undefined;
  mintAction: () => Promise<void>;
  className?: string; // Add this line
  buttonText?: string;
};

const MintButton: React.FC<MintButtonProps> = ({
  tokenId,
  mintPrice,
  onMintSuccess,
  updateTraits,
  userAddress,
  mintAction,
  buttonText,
  className, // Add this line
}) => {
  const [isTransactionPending, setTransactionPending] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { isConnected } = useAccount();
  const expectedChainId = 137; // Polygon Chain ID
  const isCorrectNetwork = chain?.id === expectedChainId;
  const formattedPrice = mintPrice ? ethers.utils.formatEther(mintPrice) : "Unavailable";
  const dollysAddress = "0xC8465f21E35AfD1De06A81D932392C47b1BEA42A";
  const hunnysClosetSalesAddress = "0x66923e2842da52b3e419fbbc79f07f1c8b0e908a";
  const {
    waas,
    error,
    user: waasUser,
    wallet,
    isLoggingIn,
    isCreatingWallet,
  } = useWalletContext();
  const address = useEVMAddress(wallet);
  
  useEffect(() => {
    const fetchDiscountRate = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-mainnet.infura.io/v3/c6a0213e06df4189bbb84a64086a38ae"
      );
      const contract = new ethers.Contract(
        hunnysClosetSalesAddress,
        salesABI,
        provider
      );
      try {
        const rate = await contract.discountRate();
        setDiscountRate(Number(rate));
      } catch (error) {
        console.error("Error fetching discount rate:", error);
      }
    };

    fetchDiscountRate();
  }, []);

  const handleMintUsingWaaS = async () => {
    if (!address || !tokenId || !wallet || !mintPrice) {
      console.error("Missing vital information for minting");
      return;
    }
  
    try {
      const viemAccount = toViem(address);
      const walletClient = createWalletClient({
        account: viemAccount,
        chain: polygon,
        transport: http("https://polygon-mainnet.infura.io/v3/c6a0213e06df4189bbb84a64086a38ae"),
      });
  
      // Adjusting for the proper Ether value in wei and converting to BigInt as required by Viem
      // Ethers's parseUnits returns a BigNumber, which we convert to a string to BigInt
      const transactionValueInWei = ethers.utils.parseUnits(mintPrice.toString(), 'ether').toString();
      const valueAsBigInt = BigInt(transactionValueInWei);
  
      const transaction = {
        to: hunnysClosetSalesAddress,
        value: parseEther('0.00001'),
      };
  //@ts-ignore
      const hash = await walletClient.sendTransaction(transaction);
      console.log("Transaction hash:", hash);
  
      setTransactionPending(false);
      onMintSuccess();
    } catch (error) {
      console.error("An error occurred:", error);
      setTransactionPending(false);
    }
  };
  

  const handleMint = async () => {
    if (waas) {
      // Your logic utilizing the WaaS pathway goes here
      handleMintUsingWaaS(); // Assumes this is adapted accordingly
    } else {
    

    if (!isCorrectNetwork && switchChain) {
      try {
        await switchChain({ chainId: expectedChainId });
        console.log("Successfully requested chain switch.");
        // You might need to wait for the network switch to complete before continuing.
        // This could be done by listening to some event or re-checking the current network after a delay.
      } catch (error) {
        console.error("Failed to switch chain:", error);
        alert("Please switch to the Polygon network in your wallet.");
        return;
      }
    }

    if (!tokenId || !userAddress) {
      console.error("Token ID or user address is undefined");
      return;
    }

    if (!mintPrice) {
      console.error("Mint price is undefined");
      alert("Mint price not available.");
      return;
    }

    // Convert mintPrice to BigNumber if it's not already
    let safeMintPrice = BigNumber.isBigNumber(mintPrice)
      ? mintPrice
      : BigNumber.from(mintPrice);

      if (!isConnected) {
        console.error("User is not connected to a wallet");
        return;
      }
      
    if (isCorrectNetwork) {
      try {
        setTransactionPending(true);
        await mintAction();
        onMintSuccess();
        updateTraits(userAddress);
        alert("Purchase successful!");
      } catch (error) {
        console.error("Purchase error:", error);
        if (error instanceof Error) {
          alert(error.message || "Purchase failed.");
        } else {
          alert("Purchase failed due to an unexpected error.");
        }
      } finally {
        setTransactionPending(false);
      }
    }
  }
  };

  // Compute the original price if there's a discount
  const originalPrice =
    discountRate > 0 && mintPrice
      ? mintPrice.mul(100).div(100 - discountRate)
      : mintPrice;
  const formattedOriginalPrice = originalPrice
    ? ethers.utils.formatUnits(originalPrice, "ether")
    : null;

  // Determine the base class for the button
  const baseButtonClass = "mint-btn text-white font-bold py-2 px-4 rounded";
  // Determine additional classes based on state and props
  const additionalClasses = `${className || ""} ${
    isTransactionPending ? "opacity-50" : ""
  } ${
    isTransactionPending
      ? "bg-gray-500"
      : "bg-[#7B2BFF] hover:bg-[#9e63ff] rounded-full"
  }`;

  return (
    <button
      onClick={handleMint}
      disabled={isTransactionPending || !mintPrice}
      className={`${baseButtonClass} ${additionalClasses}`}
    >
      {isTransactionPending
        ? "Processing..."
        : buttonText || (
            <>
              {mintPrice ? `Ξ ${formattedPrice}` : "Price Unavailable"}
              {className === "discounted-mint-btn" && (
                <span className="discount-badge shadow-lg">-10%</span>
              )}
            </>
          )}
    </button>
  );
};

export default MintButton;
