import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useConnectModal } from "@rainbow-me/rainbowkit";
import salesABI from "../../backend/src/abis/hunnys-closet-sales-abi.json"; // Make sure this ABI is for HunnysClosetSales contract

const Achievements: React.FC = () => {
  const hunnysClosetSales = "0xedaa37b37146e2e09df90be6b25ab888a513352c";
  const tokenIds = [52];
  const amounts = [1];
  const basePrice = ethers.utils.parseUnits("0.002", "ether"); // Base price before discount

  const [discountRate, setDiscountRate] = useState<number>(0);
  const [isTransactionPending, setTransactionPending] = useState<boolean>(false);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    // Fetch the current discount rate
    const fetchDiscountRate = async () => {
      const provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/c6a0213e06df4189bbb84a64086a38ae");
      const contract = new ethers.Contract(hunnysClosetSales, salesABI, provider);
      const rate = await contract.discountRate();
      setDiscountRate(Number(rate));
    };

    fetchDiscountRate();
  }, []);
  
  // Initialize the InjectedConnector
  const connector = new InjectedConnector();

  const handleMint = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
  
    const discountedPrice = basePrice.mul(100 - discountRate).div(100); // Apply discount

    try {
      if (!connector) {
        throw new Error("Wallet connector is not available");
      }
      const provider = await connector.getProvider();
      if (!provider) {
        throw new Error("Ethereum provider is not available");
      }
  
      const ethersProvider = new ethers.providers.Web3Provider(provider as any);
      const signer = ethersProvider.getSigner();
      const salesContract = new ethers.Contract(hunnysClosetSales, salesABI, signer);
  
      setTransactionPending(true);
      const tx = await salesContract.mintTokens(
        tokenIds,
        amounts,
        discountedPrice, // Use discounted price here
        '0x',
        { 
          value: discountedPrice,
          gasLimit: ethers.utils.hexlify(1000000)
        }
      );
      await tx.wait();
      setTransactionPending(false);
      alert("Mint successful!");
    } catch (error) {
      console.error("Mint failed:", error);
      setTransactionPending(false);
      alert("Mint failed.");
    }
  };
  
  return (
    <div className="flex flex-col justify-center items-center w-full px-6 mx-auto">
      <h1>Mint Tokens</h1>
      <button
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isTransactionPending ? "opacity-50" : ""}`}
        onClick={handleMint}
        disabled={isTransactionPending}
      >
        {isTransactionPending ? "Processing..." : "Mint Tokens"}
      </button>
      {isTransactionPending && <p>Transaction is being processed...</p>}
    </div>
  );
}

export default Achievements;
