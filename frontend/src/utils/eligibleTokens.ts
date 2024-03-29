// src/utils/eligibleTokens.js
import { ethers } from "ethers";
import salesABI from "../../../backend/src/abis/hunnys-closet-sales-abi.json";
export const WETH_ADDRESS = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; // WETH Address on Polygon
import WETH_ABI from "../../../backend/src/abis/weth-abi.json";
const salesContractAddress = "0x66923e2842da52b3e419fbbc79f07f1c8b0e908a"; // Update with your sales contract address
const nftContractAddress = "0x11bc733e719198e2b3746f6841d2818ca87af6da";
import { WaasEthersSigner } from "@coinbase/waas-sdk-ethers";
import { Address } from "@coinbase/waas-sdk-web";
import {
  Account,
  WalletClient,
  createPublicClient,
  createWalletClient,
  getContract,
} from "viem";
import { abi as wethAbi } from "./wethAbi";
import { abi as salesAbi } from "./salesabi";
import { polygon } from "viem/chains";
import { http } from "viem";
import { toViem } from "@coinbase/waas-sdk-viem";

export type EligibleToken = {
  token_id: string;
  price: ethers.BigNumber;
  origin_ids: number[];
};

// Define your Bunny Club members list and discount rate
const bunnyClubMembers = [
  "0xa7758394D8f7fD23b0d9F13E02427B514687394B",
  "0x55Abdc04655d590a48BCd1B996115448b71b7a84",
  "0x4eE115d0708924B4d3a83e45A428B0e3cb4348e9",
  "0x3a9a9b0a3148599dde1660476c6a47b1272247c6",
  "0xe17d0ac3F7C498924d4920bf279C01536686e014",
  "0x48a19c6B158491325E84c8837ED8Ba95A0403C13",
  "0x9d9d3bca9ae1126244786089d81ba9b289970238",
  "0x1975638d2dfdeee04d11adf6350187af9996dc7c",
  "0x6c6cD01ebbd02254C5Db5263797E366511992d29",
  "0x019Db3aA167aF3B91b6D72a05dD8437aaDd5225E",
  "0x745461ae3ee10F26e314735b6AF8ee41cD313E2d",
  "0x0DE9a66f0F9b714c5b987BDCb37A5E2EF1bDA67A",
  "0x473e12B41bC13d3Ac98C4d06cD549Ba8a704dbf1",
  "0xBcDa92fF0D83448ad2B65C7a59D62FE3A18bF95f",
  "0x650d492E2F68A665a5dc029bc3f255FE5ec366Fc",
  "0x0009C319862f623aCa7b210a905121612fBBDf22",
  "0x7B710AD4c01038E62927cEBb2d5df68cF3463413",
  "0xa5cC1E135C92a4DD1b32A328e1343eB4150461B6",
  "0x5Cf422E9Ff1D79c98C479F8d4e8cbdC7B51E1550",
  "0x78ae230336bb65B0023d78156708783402f303c2",
  "0x8b5e18b1A4BfF36085604e94C9bdE2054C62d026",
  "0xFb203c2E544d1D2D889900883b4bD538Bc914357",
  "0x051f1F3920D196cc998D74A56978370b82432D25",
  "0x7b511800A8d8E7DE24Dd19de3103081824b6f41D",
  "0x1776727f3c60dD67B832F9E0614D7e028E32e063",
  "0x247DBa0157DDD215d30d41A70411DbaFbFD6a0F9",
  "0xDbC0019892E644Ad55756Ace79810305E8E4c31d",
  "0xb62500D5a8b9629763d39a4D05784D6A47A72Ab1",
  "0xce05070e7afa163a029f87bde875084769729943",
  "0x16272E839A5C29A3Fa90E670Cb599d233b6943aC",
]; // Replace with actual addresses
const bunnyClubDiscount = 10; // 10% discount

const bunnyClubDiscountBign = BigInt(10);
export const eligibleTokenIds: EligibleToken[] = [
  {
    token_id: "0",
    price: ethers.utils.parseUnits("0.00", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "2",
    price: ethers.utils.parseUnits("0.0125", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "3",
    price: ethers.utils.parseUnits("0.01", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "4",
    price: ethers.utils.parseUnits("0.028", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "5",
    price: ethers.utils.parseUnits("0.03", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "6",
    price: ethers.utils.parseUnits("0.002", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "7",
    price: ethers.utils.parseUnits("0.0012", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "8",
    price: ethers.utils.parseUnits("0.018", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "9",
    price: ethers.utils.parseUnits("0.003", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "10",
    price: ethers.utils.parseUnits("0.03", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "11",
    price: ethers.utils.parseUnits("0.008", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "46",
    price: ethers.utils.parseUnits("0.05", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "47",
    price: ethers.utils.parseUnits("0.05", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "48",
    price: ethers.utils.parseUnits("0.013", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "49",
    price: ethers.utils.parseUnits("0.00001", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "50",
    price: ethers.utils.parseUnits("0.003", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "51",
    price: ethers.utils.parseUnits("0.007", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "52",
    price: ethers.utils.parseUnits("0.003", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "53",
    price: ethers.utils.parseUnits("0.003", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "54",
    price: ethers.utils.parseUnits("0.003", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "55",
    price: ethers.utils.parseUnits("0.01", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "56",
    price: ethers.utils.parseUnits("0.015", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "57",
    price: ethers.utils.parseUnits("0.015", "ether"),
    origin_ids: [7, 9],
  },
  {
    token_id: "58",
    price: ethers.utils.parseUnits("0.012", "ether"),
    origin_ids: [7, 9],
  },
  // ... more tokens
];

// Add this function to make a request to your server for signing
const requestSignature = async (
  userAddress: string,
  tokenId: string | number,
  mintPrice: string,
  nonce: number
) => {
  try {
    const response = await fetch(
      "https://staging-hunnys-closet-2-548f5ed67a1b.herokuapp.com/signature",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress,
          tokenIds: [tokenId],
          amounts: [1],
          totalExpectedPrice: mintPrice,
          nonce,
        }),
      }
    );
    const data = await response.json();
    console.log("Received signature response:", data);
    return data.signature as `0x${string}`;
  } catch (error) {
    console.error("Error requesting signature:", error);
    throw error;
  }
};

const publicPolygonClient = createPublicClient({
  chain: polygon,
  transport: http(
    "https://polygon-mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac"
  ), 
});

export const mintWithViem = async ({
  walletClient,
  account,
  mintPrice,
  tokenId,
}: {
  walletClient: WalletClient;
  account: Account;
  mintPrice: bigint;
  tokenId: bigint;
}) => {
  const weth = getContract({
    address: WETH_ADDRESS,
    abi: wethAbi,
    client: walletClient,
  });

  const sales = getContract({
    address: salesContractAddress,
    abi: salesAbi,
    client: walletClient,
  });
  const userAddress = walletClient.account!.address;

  const balance = await weth.read.balanceOf([userAddress]);
  if (balance < mintPrice) {
    throw new Error("Insufficient WETH balance for minting.");
  }

  // Check WETH allowance
  const allowance = await weth.read.allowance([
    userAddress,
    salesContractAddress,
  ]);
  console.log(`Current allowance: ${allowance.toString()}`);

  // Check if user is a Bunny Club member and apply discount
  if (bunnyClubMembers.includes(userAddress.toLowerCase())) {
    const discount = (mintPrice * bunnyClubDiscountBign) / BigInt(100);
    mintPrice = mintPrice - discount;
  }

  // Only request new approval if mintPrice is greater than current allowance
  if (allowance < mintPrice) {
    const tx = await weth.write.approve(
      [salesContractAddress, BigInt(Number.MAX_SAFE_INTEGER)],
      {
        account,
        chain: polygon,
      }
    );
    console.log(`Got allowance: ${tx}`);
  }

  // Requesting signature from user's wallet
  const nonce = await publicPolygonClient.getTransactionCount({
    address: userAddress,
  });
  const signature = await requestSignature(
    userAddress,
    tokenId.toString(),
    mintPrice.toString(),
    nonce
  );

  // Minting process
  const mintTx = await sales.write.mintTokens(
    [
      nftContractAddress,
      {
        tokenIds: [tokenId],
        amounts: [BigInt(1)],
        totalExpectedPrice: mintPrice,
        data: "0x",
        nonce: BigInt(nonce),
        signature: signature as `0x${string}`,
      },
    ],
    {
      account: account,
      chain: polygon,
    }
  );
  console.log(`Minted: ${mintTx}`);

  return "Mint successful";
};

// Function to handle WETH payment
export const mintWithWeth = async (
  userAddress: string,
  waasAddress: Address<any> | undefined,
  tokenId: string | number,
  mintPrice: ethers.BigNumber,
  provider: ethers.providers.Web3Provider
) => {
  if (waasAddress) {
    // mint using waas.
    const walletClient = createWalletClient({
      chain: polygon,
      account: toViem(waasAddress!),
      transport: http(
        "https://polygon-mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac"
      ), 
    });

    return await mintWithViem({
      walletClient,
      account: toViem(waasAddress!),
      tokenId: BigInt(tokenId),
      mintPrice: mintPrice.toBigInt(),
    });
  }

  try {
    const signer = waasAddress
      ? new WaasEthersSigner(waasAddress, provider)
      : provider.getSigner();
    const wethContract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, signer);
    const salesContract = new ethers.Contract(
      salesContractAddress,
      salesABI,
      signer
    );
    const balance = await wethContract.balanceOf(userAddress);
    if (balance.lt(mintPrice)) {
      throw new Error("Insufficient WETH balance for minting.");
    }
    // Check WETH allowance
    const allowance = await wethContract.allowance(
      userAddress,
      salesContractAddress
    );
    console.log(`Current allowance: ${allowance.toString()}`);

    // Check if user is a Bunny Club member and apply discount
    if (bunnyClubMembers.includes(userAddress.toLowerCase())) {
      const discount = mintPrice.mul(bunnyClubDiscount).div(100);
      mintPrice = mintPrice.sub(discount);
    }

    // Only request new approval if mintPrice is greater than current allowance
    if (allowance.lt(mintPrice)) {
      const approveTx = await wethContract.approve(
        salesContractAddress,
        ethers.constants.MaxUint256
      );
      await approveTx.wait();
    }

    const nonce = await findUnusedNonce(salesContract, userAddress);
    // const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

    // Requesting signature from user's wallet
    const signature = await requestSignature(
      userAddress,
      tokenId,
      mintPrice.toString(),
      nonce
    );

    console.log("User Address: ", userAddress);
    console.log("Token ID: ", tokenId);
    console.log("Mint Price: ", mintPrice.toString());
    console.log("Nonce: ", nonce);
    console.log("Signature: ", signature);

    const mintRequest = {
      tokenIds: [tokenId],
      amounts: [1],
      totalExpectedPrice: mintPrice,
      data: "0x",
      nonce: nonce,
      signature: signature,
    };

    console.log("Purchase Request: ", mintRequest);

    // Minting process
    const mintTx = await salesContract.mintTokens(
      nftContractAddress,
      mintRequest
    );
    await mintTx.wait();
    return "Mint successful";
  } catch (error) {
    let errorMessage = "Purchase failed: ";
    //@ts-ignore
    if (error.message.includes("Insufficient WETH balance for minting.")) {
      errorMessage += "You do not have enough WETH to complete this purchase.";
    } else {
      errorMessage += "An unexpected error occurred. Please try again.";
    }
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};

async function findUnusedNonce(
  salesContract: ethers.Contract,
  userAddress: string
) {
  let nonce = 0;
  while (true) {
    const isUsed = await salesContract.usedNonces(userAddress, nonce);
    if (!isUsed) {
      return nonce;
    }
    nonce++;
  }
}
