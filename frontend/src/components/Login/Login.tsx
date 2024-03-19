// Login.tsx

import { useConnectModal, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useEVMAddress, useFirstAddress, useWalletContext } from "@coinbase/waas-sdk-web-react";
import {
  mainnet,
  polygon,
  base,
} from 'wagmi/chains';

import { Loader } from "../Loader/Loader";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import {
  Address,
  IProtocolFamily,
  ProtocolFamily,
} from "@coinbase/waas-sdk-web";
import useWalletSession from "../../hooks/useWalletSession";
import { User } from "../../data/global";
import { useAtom } from "jotai";
import { allTraitsAtom, connectedAtom, userAtom, userTraitsAtom } from "../../data/store";
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
  useEffect(() => {
    setMounted(true);
    const randomIndex = Math.floor(Math.random() * loadingImages.length);
    setLoadingImage(loadingImages[randomIndex]);
  }, []);


  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const initializeWallet = async () => {
      // Check if `:waasUser` is defined to avoid trying to destructure or call methods on `undefined`.
      if (!waasUser || isLoggingIn || isCreatingWallet || wallet) return;
  
      if (waasUser.hasWallet) {
        console.log("User has a wallet, attempting to restore...");
        // Ensure `restoreFromHostedBackup` is defined before calling it.
        if (waasUser.restoreFromHostedBackup) {
          await waasUser.restoreFromHostedBackup(/* optional passcode */);
        } else {
          console.error("restoreFromHostedBackup method is not available.");
        }
      } else {
        console.log("Creating a new wallet for the user...");
        // Ensure `create` is defined before calling it.
        if (waasUser.create) {
          await waasUser.create(/* optional passcode */);
        } else {
          console.error("create method is not available.");
        }
      }
    };
  
    initializeWallet();
  }, [waasUser, isLoggingIn, isCreatingWallet, wallet]);


  useEffect(() => {
    if (address) { // Ensure address is not undefined
      // Update the user atom with the address and other user info
      setUser((currentUser) => ({
        ...currentUser, // Spread existing user data
        wallet_type: "waas",
        wallet: address.address, // Use the address property of the address object
        address: address.address,
        achievements: {},
        dollyCount: 0,
        UUID: currentUser?.UUID ? currentUser.UUID : "",
        dollys: [],
        colors: [],
        traits: [],
        skin_colors: [],
        tokens: [],
        titles: [],
        hideSaveChangesModal: false,
        profile_name: "",
        profile_image_url: "",
        tier: "Fresh Cupcake",
        cupcake_points: 0,
        level: 0,
        token: "not_applicable",
      }));
    }
  }, [address, setUser]);

  useEffect(() => {
    if (!wallet) {
      console.log("Wallet not available yet.");
      return;
    }

    const fetchAddresses = async () => {
      try {
        const allAddresses = await wallet.addresses.all();
        console.log("Fetched addresses:", allAddresses);
        setAddresses(allAddresses);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };
  
    fetchAddresses();
  }, [wallet]);

  // Since Coinbase handles authentication, we don't need to fetch the auth token ourselves.
  const login = useCallback(async () => {
    console.log("Attempting to login...");
    if (!waas || !waas.login) {
      console.error("Waas instance or login method not available.");
      return;
    }
    
    try {
      await waas.login();
      console.log("Login successful.");
  
      // No need to manually update user here; rely on useEffect to react to changes
    } catch (error) {
      console.error("Login failed:", error);
    }
    
  }, [waas]);
  

  const logout = useCallback(async () => {
    if (waas && waas.logout) {
      await waas.logout();
      setUser(null); // Reset global user state on logout
      console.log("Logout successful.");
    }
  }, [waas, setUser]);

  
  return (
    <RainbowKitProvider>
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
          {waasUser && (
            <>
              <h1 className="login-button text-4xl justify-center align-center items-center luckiest text-white">
              Loading...
              </h1>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
    </RainbowKitProvider>
  );
}