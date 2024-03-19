import { useWriteContract, useConfig, useSwitchChain, useAccount } from "wagmi";
import closetABI from "./../../data/abi/HunnysCloset.json";
import { type UseWriteContractReturnType } from 'wagmi'
import { chainID, closetAddress, hunnysColors } from "../../data/config";
import { motion } from "framer-motion";
import Icon from "../Icon/Icon";
import { modalAtom } from "../../data/store";
import { useAtom } from "jotai";
import ApplyButton from "../DollEditor/ApplyButton";
import { useState } from "react";


export default function Mint() {
  // const [modal, modalSet] = useAtom(modalAtom);
  // const { chain } = useAccount();
  // const { switchChain } = useSwitchChain();
  // const expectedChainId = 1; // Ethereum Mainnet Chain ID
  // const isCorrectNetwork = chain?.id === expectedChainId;
  // const [tokenId, setTokenId] = useState('');

  // const { writeContractAsync, error, isIdle, isSuccess } = useWriteContract({
  //   address: '0xC8465f21E35AfD1De06A81D932392C47b1BEA42A', // Ensure this is correct and matches your contract's address
  //   abi: closetABI,
  //   functionName: 'mintPublic',
  //   args: [tokenId], // Ensure your contract's mint function expects a tokenId as an argument
  // });


  // const handleMint = async () => {
  //   if (!isCorrectNetwork && switchChain) {
  //     try {
  //       switchChain({ chainId: expectedChainId });
  //       console.log("Successfully requested chain switch.");
  //     } catch (error) {
  //       console.error("Failed to switch chain:", error);
  //       alert("Please switch to the Ethereum Mainnet in your wallet.");
  //       return;
  //     }
  //   } else {
  //     try {
  //       // Directly using writeContractAsync here for example, but you may use writeContract depending on your implementation
  //       const result = await writeContractAsync({
  //         args: [BigInt(tokenId)],
  //         abi: closetABI,
  //         functionName: 'mintPublic',
  //         address: closetAddress as `0x${string}`
  //       });
  //       console.log("Mint transaction result:", result);
  //     } catch (error) {
  //       console.error("Failed to mint:", error);
  //       // Handle minting error (e.g., transaction rejected)
  //     }
  //   }
  // };

  // return (
  //   <div className="flex">
  //     {isSuccess && (
  //       <div >
  //         We&apos;re creating your Dolly! 
  //         <div className="text-sm">
  //           Once your transaction is complete, refresh the page to get started with your new Dolly!
  //         </div>
  //       </div>
  //     )}
  //     <motion.button
  //       disabled={!useWriteContract}
  //       onClick={handleMint}
  //       whileHover={{
  //         scale: 1.03,
  //         transition: { delay: 0, duration: 0.2 },
  //       }}
  //       whileTap={{ scale: 0.97, transition: { delay: 0, duration: 0.3 } }}
  //       className="bg-[#eee] hidden rounded-full pl-3 pr-5 pt-[2px] flex-center mb-3 shadow-md font-bold text-xl hover:shadow-lg transition-all"
  //       style={{
  //         background: hunnysColors.yellow,
  //         color: hunnysColors.orange,
  //         display: "none"
  //       }}
  //     >
  //       <>
  //         <Icon type="plus" className="w-7 h-7 mr-2 stroke-[#a26106]" />
  //         Create new Dolly
  //       </>
  
  //     </motion.button>
  //   </div>
  // );
}


