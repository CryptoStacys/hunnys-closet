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
import { generatePrivateKey } from 'viem/accounts'
import { privateKeyToAccount } from 'viem/accounts'
import { mintWithWeth } from "../../utils/eligibleTokens";

type ModalProps = {
  tokenId: string;
  mintPrice: string; // BigNumber converted to string for simplicity, adjust accordingly
  itemName: string;
  itemImage: string;
  // Since you're passing these in showModal call, they should be defined here
  totalCost: string;
  headline: string;
  description: string;
  gasFees: string;
  image: string | undefined;
  // Inclusion of onConfirm if actions are expected to be passed as well
  onConfirm?: () => void;
};
type MintButtonProps = {
  tokenId: string | undefined;
  mintPrice?: BigNumber;
  isEligibleForMinting?: boolean | string[];
  itemName: string; // Assume itemName is passed as a prop for modal use
  itemImage: string; // Assume itemImage is passed as a prop for modal use
  onMintSuccess: () => void;
  updateTraits: (userAddress: string) => void;
  userAddress: string | undefined;
  mintAction: () => Promise<void>;
  className?: string; // Add this line
  buttonText?: string;
  showModal: (modalProps: ModalProps) => void;
};

const MintButton: React.FC<MintButtonProps> = ({
  tokenId,
  mintPrice,
  itemName,
  itemImage,
  onMintSuccess,
  updateTraits,
  userAddress,
  mintAction,
  buttonText,
  showModal,
  className, 
}) => {
  const [isTransactionPending, setTransactionPending] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { isConnected } = useAccount();
  const expectedChainId = 137; // Polygon Chain ID
  const isCorrectNetwork = chain?.id === expectedChainId;
  const formattedPrice = mintPrice ? ethers.utils.formatEther(mintPrice) : "Unavailable";
  const hunnysClosetSalesAddress = "0x66923e2842da52b3e419fbbc79f07f1c8b0e908a" as const;
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

  const handleMint = async () => {
    
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as any
    );

    if (!isConnected && !address) {
      console.error("User is not connected to a wallet");
      return;
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
    
    const transactionDetails = {
      totalCost: formattedPrice,
      headline: `Purchase: ${itemName}`,
      description: 'Confirm your transaction to transfer this cute NFT into your realm!',
      image: itemImage,
      gasFees: '1',
    };
    // Trigger the modal with transaction details
    showModal({
      ...transactionDetails,
      onConfirm: () => performMintAction(),
      tokenId: "",
      mintPrice: "",
      itemName: "",
      itemImage: ""
    });

    const performMintAction = async () => {
    if (!isCorrectNetwork && switchChain) {
      try {
        switchChain({ chainId: expectedChainId });
        console.log("Successfully requested chain switch.");
        } catch (error) {
        console.error("Failed to switch chain:", error);
        alert("Please switch to the Polygon network in your wallet.");
        return;
      }
    }

    setTransactionPending(true);
    if (address) {
      return await mintWithWeth(userAddress!, address, tokenId!, mintPrice!, provider)
      }  
    try {
      await mintAction();
      onMintSuccess();
      updateTraits(userAddress!);
      alert("Purchase successful!");
    } catch (error) {
      console.error("Purchase error:", error);
      if (error instanceof Error) {
      alert(error.message || "Purchase failed.");
      } 
    } finally {
      setTransactionPending(false);
    }
    
  };
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
