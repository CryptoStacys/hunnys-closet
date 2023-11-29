import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

import closetABI from "./../../data/abi/HunnysCloset.json";
import { chainID } from "../../data/config";
import { closetAddress } from "../../data/config";
import { hunnysColors } from "../../data/config";
import { motion } from "framer-motion";
import Icon from "../Icon/Icon";
// import { ethers } from "ethers";

import { modalAtom } from "../../data/store";
import { useAtom } from "jotai";
import ApplyButton from "../DollEditor/ApplyButton";

// import doll0 from "./assets/0.avif";

export default function Mint() {
  const [modal, modalSet] = useAtom(modalAtom);

  let writeOpt:any = {
    address: closetAddress, // dollys goerli Address
    chainId: chainID,
    abi: closetABI,
    args: [1], // mint 1
    functionName: "mintPublic",
  }

  // const { config } = usePrepareContractWrite({
  //   address: closetAddress, // dollys goerli Address
  //   chainId: chainID,
  //   abi: closetABI,
  //   args: [1], // mint 1
  //   functionName: "mintPublic",
  //   // overrides: {
  //   //   from: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  //   //   value: ethers.utils.parseEther('0.01'),
  //   // },
  // });

  // const { write } = useContractWrite(config);
  // const { data, isLoading, isSuccess, write } = useContractWrite(config);
  const { data, isLoading, isSuccess, write } = useContractWrite(writeOpt);
  // const { data, isLoading, isSuccess, write } = useContractWrite(config);
  // const { isLoading } = useWaitForTransaction({
  //   hash: data?.hash,
  // })

  function openConfirmModal() {
    modalSet({
      active: true,
      title: "Unsaved changes",
      body: (
        <>
          <div className="mb-3 px-2">
          We&apos;re creating your Dolly!
            <br /> Once your transaction is complete, refresh the page to get started with your new Dolly!
          </div>
          <div className="grid grid-cols-2">
            <ApplyButton
              onClick={() => {
                modalSet({ active: false, title: "", body: <></> });
              }}
              text="Ok"
            />
          </div>
        </>
      ),
    });
  }

  return (
    <div className="flex">
      {isSuccess && (
        <div >
          We&apos;re creating your Dolly! 
          <div className="text-sm">
            Once your transaction is complete, refresh the page to get started with your new Dolly!
          </div>
        </div>
      )}
      <motion.button
        disabled={!write}
        onClick={() => write?.()}
        whileHover={{
          scale: 1.03,
          transition: { delay: 0, duration: 0.2 },
        }}
        whileTap={{ scale: 0.97, transition: { delay: 0, duration: 0.3 } }}
        className="bg-[#eee] rounded-full pl-3 pr-5 pt-[2px] flex-center mb-3 shadow-md font-bold text-xl hover:shadow-lg transition-all"
        style={{
          background: hunnysColors.yellow,
          color: hunnysColors.orange,
        }}
      >
        <>
          <Icon type="plus" className="w-7 h-7 mr-2 stroke-[#a26106]" />
          Create new Dolly
        </>
  
      </motion.button>
    
      {/* {isLoading && (
        <div>
          Successfully minted your NFT!
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )} */}
    </div>
  );
}


