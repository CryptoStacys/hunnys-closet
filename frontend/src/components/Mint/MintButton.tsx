// MintButton.tsx
import React, { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useAccount } from 'wagmi';
import salesABI from "../../../../backend/src/abis/hunnys-closet-sales-abi.json";
import { InjectedConnector } from 'wagmi/connectors/injected'


type MintButtonProps = {
    tokenId: string | undefined;
    mintPrice: BigNumber;
    onMintSuccess: () => void;
  };
  
  const MintButton: React.FC<MintButtonProps> = ({ tokenId, mintPrice, onMintSuccess }) => {
    const [isTransactionPending, setTransactionPending] = useState(false);
    const [discountRate, setDiscountRate] = useState(0);
    const { isConnected } = useAccount();
  
    const hunnysClosetSalesAddress = "0xedaa37b37146e2e09df90be6b25ab888a513352c";

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
      const connector = new InjectedConnector();
      try {
        await connector.getProvider();
      } catch (error) {
        console.error("Connection error:", error);
        return;
      }
      return;
    }

    if (!tokenId) {
        console.error("Token ID is undefined");
        return;
      }

    const discountedPrice = mintPrice.mul(100 - discountRate).div(100);

    try {
      if (!window.ethereum) {
        throw new Error("Ethereum provider is not available");
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum as any); // Type cast to 'any'
      const signer = provider.getSigner();
      const salesContract = new ethers.Contract(hunnysClosetSalesAddress, salesABI, signer);

      setTransactionPending(true);
      const tx = await salesContract.mintTokens(
        [tokenId],
        [1],
        discountedPrice,
        '0x',
        { 
          value: discountedPrice,
          gasLimit: ethers.utils.hexlify(1000000)
        }
      );
      await tx.wait();
        alert("Purchase successful!");
        setTransactionPending(false);
        onMintSuccess(); // Invoke the callback
    } catch (error) {
      console.error("Mint failed:", error);
      setTransactionPending(false);
      alert("Mint failed.");
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
