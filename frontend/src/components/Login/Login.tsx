const bg = "/assets/img/bg.png";
// import bg from "./../../assets/img/bg.png";
import { useConnectModal, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Loader } from "../Loader/Loader";
import Image from "next/image";

import {useState, useEffect} from 'react'

export default function Login() {
  // rainbowkit modal
  const [mounted, setMounted] = useState(false);

  const { chains } = configureChains(
    [mainnet],
    [
      alchemyProvider({ apiKey: "fE6VhpMDQEapEp-KNNwNqrWL9-gHhNZD" }),
      publicProvider(),
    ]
  );
  
  useEffect(() => {
    setMounted(true)
   
  }, [])

  const { openConnectModal } = useConnectModal();

  return ( 
    <RainbowKitProvider chains={chains} initialChain={mainnet}>
    <div className="flex justify-center items-center w-max-full px-6 mx-auto">
      <div className="relative bg-[#fff] shadow-lg rounded-3xl overflow-hidden max-w-[1250px] w-full h-[80vh] mx-auto flex items-center justify-center">
      {/* <div className="relative bg-[#fff] shadow-lg rounded-3xl overflow-hidden max-w-[1160px] w-full h-[80vh] mx-auto flex items-center justify-center"> */}
        <Image width={3000} height={2659} src={bg} alt="login-bg" className="w-full h-auto" />
        
        {mounted && openConnectModal ? (
          <div
            onClick={openConnectModal}
            className="hunnys-btn absolute mx-auto bg-[#ffd54b] uppercase text-white text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
          >
            Connect
          </div>
        ) : (
          <div className=" absolute mx-auto uppercase text-[#777] text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer">
            <div className="text-white">LOADING</div>
            
            <Loader />
            
          </div>
        )}
      </div>
    </div>
    </RainbowKitProvider>
  );
}
