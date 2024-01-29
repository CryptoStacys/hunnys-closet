const loading = "/assets/img/loading.gif";
import { useConnectModal, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains } from 'wagmi';
import { mainnet } from 'wagmi/chains';
// Import your static images
const loading1 = "/assets/img/LoadingTip1.png";
const loading2 = "/assets/img/LoadingTip2.png";
const loading3 = "/assets/img/LoadingTip3.png";
const loading4 = "/assets/img/LoadingTip4.png";
const loading5 = "/assets/img/LoadingTip5.png";
const loading6 = "/assets/img/LoadingTip6.png";
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Loader } from "../Loader/Loader";
import Image from "next/image";

import {useState, useEffect} from 'react'

export default function Login() {
  // rainbowkit modal
  const [mounted, setMounted] = useState(false);
  const [loadingImage, setLoadingImage] = useState(loading1); // Initialize with one of the images

  useEffect(() => {
    setMounted(true);

    // Randomly select an image
    const loadingImages = [loading1, loading2, loading3, loading4, loading5, loading6];
    const randomImage = loadingImages[Math.floor(Math.random() * loadingImages.length)];
    setLoadingImage(randomImage);
   
  }, []);

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
      <div className="relative rounded-3xl overflow-hidden max-w-[1250px] w-full h-[80vh] mx-auto flex items-center justify-center">
      {/* <div className="relative bg-[#fff] shadow-lg rounded-3xl overflow-hidden max-w-[1160px] w-full h-[80vh] mx-auto flex items-center justify-center"> */}
      <Image className="rounded-3xl" src={loadingImage} alt="Loading" width={3000} height={1688} />
        
        {mounted && openConnectModal ? (
          <div
            onClick={openConnectModal}
            className="hunnys-btn absolute mx-auto bg-[#ffd54b] loginConnect uppercase text-white text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
          >
            Connect
          </div>
        ) : (
          <div className="absolute grid-cols-1 loginLoading mx-auto uppercase text-[#777] text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md">
            <div className="text-black"></div>
            {/* Display the random image */}
            
            <Loader />
            
          </div>
        )}
      </div>
    </div>
    </RainbowKitProvider>
  );
}
