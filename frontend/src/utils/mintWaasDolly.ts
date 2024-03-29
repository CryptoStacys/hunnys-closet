// src/utils/mintWaasDolly.ts
import closetABI from "../data/abi/HunnysCloset.json";
import {
  Account,
  createPublicClient,
  getContract,
  http,
  createWalletClient,
} from "viem";
import { mainnet } from "viem/chains";
import { useEVMAddress, useWalletContext } from "@coinbase/waas-sdk-web-react";
import { toViem } from "@coinbase/waas-sdk-viem";
import { Address, Wallet } from "@coinbase/waas-sdk-web";

export async function mintWaasDolly(wallet: Wallet, address: Address<any>) {
  const closetAddress = "0xC8465f21E35AfD1De06A81D932392C47b1BEA42A";
  const abi = closetABI;
  const walletClient = createWalletClient({
    account: toViem(address!),
    chain: mainnet,
    transport: http(
      "https://mainnet.infura.io/v3/5239f83d36634330bd900f94158cf76e"
    ),
  });

  const publicEthClient = createPublicClient({
    chain: mainnet,
    transport: http(
      "https://mainnet.infura.io/v3/5239f83d36634330bd900f94158cf76e"
    ), 
  });
    const contract = getContract({
      address: closetAddress,
      abi: closetABI,
      client: publicEthClient,
    });

    console.log("Attempting to write transaction with Viem...");

    try {
      // Ensure you are passing parameters correctly based on your contract's needs
      const txResponse = await walletClient.writeContract({
        abi,
        functionName: 'mintPublic',
        address: closetAddress,
        args: [1],
      });
      console.log("Transaction response with Viem:", txResponse);
      return { hash: txResponse }; // Ensure correct hash is being used based on the txResponse structure
    } catch (error) {
      console.error("Transaction failed or was rejected with Viem:", error);
      throw error;
    }
  }

