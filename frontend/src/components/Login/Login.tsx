// Login.tsx

import { useConnectModal, RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { useEVMAddress, useFirstAddress, useWalletContext } from "@coinbase/waas-sdk-web-react";
import {
  mainnet,
  polygon,
  base,
} from 'wagmi/chains';
import { 
  createConfig, 
} from '@wagmi/core'
import { 
  http } from 'viem';
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import {
  Address,
  IProtocolFamily,
  ProtocolFamily,
} from "@coinbase/waas-sdk-web";
import { config } from '../../utils/wagmiConfig'
import useWalletSession from "../../hooks/useWalletSession";
import { User } from "../../data/global";
import { useAtom } from "jotai";
import { allTraitsAtom, connectedAtom, userAtom, userTraitsAtom } from "../../data/store";
import { initializeUser } from "../../utils/userInitialization";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  metaMaskWallet,
  walletConnectWallet,
  rainbowWallet,
  injectedWallet,
  coinbaseWallet
} from "@rainbow-me/rainbowkit/wallets";
type WalletAddress = Address<IProtocolFamily>;

const loginScreen = "/assets/img/ClosetV2LoginImage.png";
// Static images
const loadingImages = [
  "/assets/img/LoadingTip1.png",
  "/assets/img/LoadingTip2.png",
  "/assets/img/LoadingTip3.png",
  "/assets/img/LoadingTip4.png",
  "/assets/img/LoadingTip5.png",
  "/assets/img/LoadingTip6.png",
];

export default function Login() {
  // rainbowkit modal
  const [mounted, setMounted] = useState(false);
  const [loadingImage, setLoadingImage] = useState(loadingImages[0]);
  const [, setAddress] = useState("");
  const [allTraits, setAllTraits] = useAtom(allTraitsAtom);
  const [userTraits, setUserTraits] = useAtom(userTraitsAtom);
  const [addresses, setAddresses] = useState<WalletAddress[]>([]);
  const { openConnectModal } = useConnectModal();
  const [connected, setConnected] = useAtom(connectedAtom);
  const [user, setUser] = useAtom(userAtom);
  const {waas, error, user: waasUser, wallet, isLoggingIn, isCreatingWallet } =
  useWalletContext();
  const address = useFirstAddress(wallet, ProtocolFamily.EVM);

  const connectors = connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: [coinbaseWallet, rainbowWallet, metaMaskWallet, walletConnectWallet, ledgerWallet, injectedWallet, trustWallet, argentWallet],
      },
    ],
    {
      appName: 'Hunnys Closet',
      projectId: 'dc9e83a4ea618721d7c59c905af47837',
    }
  );
  
  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <div className="flex justify-center items-center w-max-full px-6 mx-auto bg-cover bg-center" style={{backgroundColor: 'white', backgroundImage: `url('/assets/img/sparkle_bg.png')`}}>
    <div className="relative rounded-3xl overflow-hidden max-w-[1250px] w-full h-[100%] mx-auto flex items-center justify-center">
      {/* Background Image */}
      {loadingImage && (
        <Image className="rounded-3xl" src={loginScreen} alt="Background" width={3000} height={1688} />
      )}
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Button Container */}
        <div className="flex flex-row">
          {error && <p>{error.message}</p>}
          {mounted && openConnectModal ? (
          <button
          onClick={openConnectModal}
          className="hunnys-btn font-poppins login-button bg-[#C9A9FF] !text-[#6510F2] xs:text-md xs:px-2 xs:py-2 sm:px-4 sm:py-3 xs:mr-4 lg:text-2xl lg:px-6 lg:py-3 font-bold tracking-wider px-14 py-6 rounded-full hover:cursor-pointer drop-shadow-2xl"
        >
          Connect Wallet
        </button>
        ) : (
          <div className="login-button text-4xl justify-center align-center items-center luckiest text-white">
                Loading...
              </div>
        )}
        </div>
      </div>
    </div>
    </div>
  );
}