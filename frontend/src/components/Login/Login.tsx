// Login.tsx

import { useConnectModal, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useEVMAddress, useFirstAddress, useWalletContext } from "@coinbase/waas-sdk-web-react";
import {
  mainnet,
  polygon,
  base,
} from 'wagmi/chains';
import { useAccount } from 'wagmi';

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
import { initializeUser } from "../../utils/userInitialization";
type WalletAddress = Address<IProtocolFamily>;

const loginScreen = "/assets/img/Login.png";
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
  const { isConnected } = useAccount();
  const [rainbowKitModalOpen, setRainbowKitModalOpen] = useState(false);
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);
  const {waas, error, user: waasUser, wallet, isLoggingIn, isCreatingWallet } =
  useWalletContext();
  const address = useFirstAddress(wallet, ProtocolFamily.EVM);

  useEffect(() => {
    setMounted(true);
  }, []);

  

  useEffect(() => {
    const initializeWallet = async () => {
      // Early return if waasUser is not defined or if the wallet is already set
      if (!waasUser || wallet) return;
  
      try {
        if (isLoggingIn || isCreatingWallet) {
          // Logic to handle waiting for login or wallet creation to complete
          return;
        }
  
        if (waasUser.hasWallet) {
          console.log("User has a wallet, attempting to restore...");
  
          // Check for the existence of the restoreFromHostedBackup method
          if (typeof waasUser.restoreFromHostedBackup === "function") {
            await waasUser.restoreFromHostedBackup(); // Call the method if it exists
          } else {
            console.warn("restoreFromHostedBackup method is not available.");
            // Handle the case where restoreFromHostedBackup is unavailable
          }
        } else {
          console.log("Creating a new wallet for the user...");
  
          // Similarly, check for the existence of the create method
          if (typeof waasUser.create === "function") {
            await waasUser.create(); // Call the method if it exists
          } else {
            console.warn("create method is not available.");
            // Handle the case where create is unavailable
          }
        }
      } catch (error) {
        console.error("Error during wallet initialization:", error);
        // Handle any errors that occur during the initialization process
      }
    };
  
    initializeWallet();
  }, [waasUser, isLoggingIn, isCreatingWallet, wallet]);
  
  useEffect(() => {
    setIsLoginInProgress(Boolean(isLoggingIn || isCreatingWallet || (waasUser && !wallet) || rainbowKitModalOpen));
  }, [isLoggingIn, isCreatingWallet, waasUser, wallet, rainbowKitModalOpen]);
  
  const handleOpenConnectModal = () => {
    setRainbowKitModalOpen(true);
    openConnectModal!();

  };

  useEffect(() => {
    setTimeout(() => {
      // Only reset the modal state if the user has not connected their wallet
      if (!isConnected) {
        setRainbowKitModalOpen(false);
        setIsLoginInProgress(false); // Reset login progress state
      }
    }, 8000); // Adjust the delay as needed
    if (isConnected) {
      setIsLoginInProgress(true)
    }
  })
  console.log(rainbowKitModalOpen)
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
      setIsLoginInProgress(true); // Indicate that login is in progress
      await waas.login();
      console.log("Login successful.");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoginInProgress(false); // Reset login progress state on completion or error
    }
    
  }, [waas]);
  

  
  useEffect(() => {
    if (address && waasUser) { // Make sure address and waasUser are defined
        initializeUser(
            address.address, // Assuming `address` contains the address string
            setUser,
            setAllTraits,
            setUserTraits,
            setConnected
        ).catch(console.error); // Handle or log any errors
    }
    console.log("Initialization beginning...", address?.address, user)
}, [address, waasUser, setUser, setAllTraits, setUserTraits, setConnected]);
  

  return (
    <RainbowKitProvider>
    <div className="flex justify-center items-center w-max-full px-6 mx-auto bg-cover bg-center" style={{backgroundColor: '#EDEDED'}}>
    <div className="relative rounded-3xl overflow-hidden max-w-[1250px] w-full h-[100%] mx-auto flex items-center justify-center">
      {/* Background Image */}
      {loadingImage && (
        <Image className="rounded-3xl" src={loginScreen} alt="Background" width={3000} height={1688} />
      )}
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Button Container */}
        <div className="flex flex-col items-center xs:mt-[100px] xtn:mt-[150px] tn:mt-[200px] sm:mt-[200px] md:mt-[300px] lg:mt-[400px] xs:space-y-4 md:space-y-6 lg:space-y-8 font-poppins xs:text-sm">
          {error && <p>{error.message}</p>}
          {!isLoginInProgress && (
          <>
            {!waasUser && (
              <>
                <button
                  onClick={handleOpenConnectModal}
                  className="hunnys-btn bg-[#C9A9FF] !text-[#6510F2] xs:text-[10px] xtn:text-[14px] xs:px-4 xs:py-1 xtn:py-2 sm:px-6 sm:py-3 big:px-8 big:py-4 md:text-2xl big:text-4xl font-bold tracking-wider px-14 py-6 rounded-full hover:cursor-pointer drop-shadow-2xl"
                >
                  Connect Wallet
                </button>
                <button
                  onClick={login}
                  className="hunnys-btn bg-[#ffd54b] !text-[#6510F2] xs:text-[10px] xtn:text-[14px] xs:px-4 xs:py-1 xtn:py-2 sm:px-6 sm:py-3 big:px-8 big:py-4 md:text-2xl big:text-4xl font-bold tracking-wider px-14 py-6 rounded-full hover:cursor-pointer drop-shadow-2xl"
                >
                  Sign-up / Login
                </button>
              </>
            )}
          </>
        )}
        {isLoginInProgress && (
          <h1 className="luckiest text-4xl text-white p-8 mt-32">
            Loading...
          </h1>
        )}
        </div>
      </div>
    </div>
    </div>
    </RainbowKitProvider>
  );
}