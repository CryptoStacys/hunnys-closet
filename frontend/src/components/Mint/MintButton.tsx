// MintButton.tsx
import React, { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import salesABI from "../../../../backend/src/abis/hunnys-closet-sales-abi.json";

type MintButtonProps = {
  tokenId: string | undefined;
  mintPrice?: BigNumber;
  isEligibleForMinting?: boolean | string[];
  onMintSuccess: () => void;
  updateTraits: (userAddress: string) => void;
  userAddress: string | undefined;
  mintAction: () => Promise<void>;
  className?: string; // Add this line
};


const MintButton: React.FC<MintButtonProps> = ({
  tokenId,
  mintPrice,
  onMintSuccess,
  updateTraits,
  userAddress,
  mintAction,
  className // Add this line
}) => {
  const [isTransactionPending, setTransactionPending] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);
  const { chain: currentChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { isConnected } = useAccount();
  const formattedPrice = mintPrice ? ethers.utils.formatUnits(mintPrice, "ether") : "Unavailable";
  const dollysAddress = "0xC8465f21E35AfD1De06A81D932392C47b1BEA42A";
  const hunnysClosetSalesAddress = "0x66923e2842da52b3e419fbbc79f07f1c8b0e908a";
  const expectedChainId = 137; // Polygon Chain ID
  useEffect(() => {
    const fetchDiscountRate = async () => {
      const provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/c6a0213e06df4189bbb84a64086a38ae");
      const contract = new ethers.Contract(hunnysClosetSalesAddress, salesABI, provider);
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
    if (!isConnected) {
      console.error("User is not connected to a wallet");
      return;
    }

    if (currentChain?.id !== expectedChainId) {
      // Prompt the user to switch to the correct chain
      switchNetwork && switchNetwork(expectedChainId);
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

    setTransactionPending(true);

    try {
      await mintAction();
      onMintSuccess();
      updateTraits(userAddress);
      alert("Purchase successful!");
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Purchase failed.");
    } finally {
      setTransactionPending(false);
    }
  };

// Compute the original price if there's a discount
const originalPrice = discountRate > 0 && mintPrice
? mintPrice.mul(100).div(100 - discountRate)
: mintPrice;
const formattedOriginalPrice = originalPrice
? ethers.utils.formatUnits(originalPrice, "ether")
: null;

// Determine the base class for the button
const baseButtonClass = "mint-btn text-white font-bold py-2 px-4 rounded";
// Determine additional classes based on state and props
const additionalClasses = `${className || ''} ${isTransactionPending ? "opacity-50" : ""} ${isTransactionPending ? 'bg-gray-500' : 'bg-[#7B2BFF] hover:bg-[#9e63ff] rounded-full'}`;

return (
<button
  onClick={handleMint}
  disabled={isTransactionPending || !mintPrice}
  className={`${baseButtonClass} ${additionalClasses}`}
  
>
  {isTransactionPending ? "Processing..." : (
    <>
      
      {mintPrice ? `Ξ ${formattedPrice}` : "Price Unavailable"}
      {className === 'discounted-mint-btn' && (
        <span className="discount-badge shadow-lg">-10%</span>
      )}
    </>
  )}
</button>
);
};

export default MintButton;
