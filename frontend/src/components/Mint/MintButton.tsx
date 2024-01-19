// MintButton.tsx
import React, { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useAccount } from 'wagmi';
import salesABI from "../../../../backend/src/abis/hunnys-closet-sales-abi.json";

type MintButtonProps = {
  tokenId: string | undefined;
  mintPrice: BigNumber;
  onMintSuccess: () => void;
  updateTraits: (userAddress: string) => void;
  userAddress: string | undefined;
  mintAction: () => Promise<void>;
};

const MintButton: React.FC<MintButtonProps> = ({
  tokenId,
  mintPrice,
  onMintSuccess,
  updateTraits,
  userAddress,
  mintAction
}) => {
  const [isTransactionPending, setTransactionPending] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);
  const { isConnected } = useAccount();

  const hunnysClosetSalesAddress = "0xc451d87d41390b8a4e398a137209eed4475d4dd5";

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

    if (!tokenId || !userAddress) {
      console.error("Token ID or user address is undefined");
      return;
    }

    setTransactionPending(true);

    try {
      await mintAction();
      onMintSuccess();
      updateTraits(userAddress);
      alert("Purchase successful!");
    } catch (error) {
      console.error("Minting error:", error);
      alert("Minting failed.");
    } finally {
      setTransactionPending(false);
    }
  };

  return (
    <button
      onClick={handleMint}
      disabled={isTransactionPending}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isTransactionPending ? "opacity-50" : ""}`}
    >
      {isTransactionPending ? "Processing..." : "Buy"}
    </button>
  );
};

export default MintButton;
