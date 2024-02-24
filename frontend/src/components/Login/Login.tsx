const loading = "/assets/img/loading.gif";
import { useConnectModal, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { allTraitsAtom, userAtom, connectedAtom } from "../../data/store";
import { useAtom } from 'jotai';
import { configureChains } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { User } from '../../data/global';
import { Loader } from "../Loader/Loader";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useEVMAddress, useFirstAddress, useWalletContext } from "@coinbase/waas-sdk-web-react";
import useWalletSession from "../../hooks/useWalletSession";
import { Address, IProtocolFamily, ProtocolFamily } from "@coinbase/waas-sdk-web";


const loadingImages = [
  "https://closet.hunnys.io/assets/img/LoadingTip1.png",
  "https://closet.hunnys.io/assets/img/LoadingTip2.png",
  "https://closet.hunnys.io/assets/img/LoadingTip3.png",
  "https://closet.hunnys.io/assets/img/LoadingTip4.png",
  "https://closet.hunnys.io/assets/img/LoadingTip5.png",
  "https://closet.hunnys.io/assets/img/LoadingTip6.png",
];

export default function Login() {
  // rainbowkit modal
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useAtom(userAtom);
  const [loadingImage, setLoadingImage] = useState("");
  const {
    wallet,
    login,
    logout,
    user: waasUser,
    isLoggingIn,
    isLoading,
    error,
    waas,
    restoreWalletFromHostedBackup,
    exportKeysFromHostedBackup,
    fetchUserToken,
  } = useWalletSession();
  const [backupString, setBackupString] = useState('');
  const [loading, setLoading] = useState(false); // Initialize with one of the images
  const { openConnectModal } = useConnectModal();
  const [passcode, setPasscode] = useState("");
  const [message, setMessage] = useState("");
  const [backupPhrase, setBackupPhrase] = useState("");
  const walletAddress = useEVMAddress(wallet);
 
  
  useEffect(() => {
    setMounted(true);
    // Randomly select an image for the loading tip
    const randomImage =
      loadingImages[Math.floor(Math.random() * loadingImages.length)];
    setLoadingImage(randomImage);
  }, []);

  useEffect(() => {
    console.log("Current user state upon mounted:", user);
  }, [user]);

  const { chains } = configureChains(
    [mainnet],
    [
      alchemyProvider({ apiKey: "fE6VhpMDQEapEp-KNNwNqrWL9-gHhNZD" }),
      publicProvider(),
    ]
  );
  

 // Example function to handle wallet creation
 const handleLogin = async () => {
  await login();
}
useEffect(() => {
  console.log("Current user state before 'handleCreateWallet':", user);
}, [user]);

const handleCreateWallet = async () => {
  
  console.log("Attempting to create an address...");
  if (waasUser && waasUser.create) {
    try {
      
      const newWallet = await waasUser.create("optional passcode");
      console.log(`Wallet created successfully: ${JSON.stringify(newWallet)}`);
      // Since you're already effectively using useEVMAddress to get the address,
      // we'll ensure to wait for it to be populated as wallet creation is async
        if (wallet) {
          const addresses = await wallet.addresses.all();
          const address = addresses[0].address; // Assuming you want the first one.
          console.log("New Wallet Address:", address);
          if (walletAddress?.address) {
            console.log("Detected a new wallet address: ", walletAddress.address);
          setUser((prev) => {
        const updatedUser: User = {
          ...prev,
          token: user?.token || '', // Assuming token is always available upon successful login
          wallet_type: 'waas',
          wallet: walletAddress.address, // Provide a default value that matches the expected type in User
          achievements: prev?.achievements || {}, // Default empty object, adjust based on actual type
          dollyCount: prev?.dollyCount || 0, // Provide a default number
          UUID: prev?.UUID || '', // Default empty string, assuming UUID should be a string
          address: walletAddress.address || '', // Default empty string
          dollys: prev?.dollys || [], // Default empty array
          colors: prev?.colors || [],
          traits: prev?.traits || [],
          skin_colors: prev?.skin_colors || [],
          tokens: prev?.tokens || [],
          hideSaveChangesModal: prev?.hideSaveChangesModal || false,
          profile_name: prev?.profile_name || '',
          profile_image_url: prev?.profile_image_url || '',
          tier: prev?.tier || 'Fresh Cupcake',
          cupcake_points: prev?.cupcake_points || 0,
          level: prev?.level || 0,
        };
        return updatedUser;
      });
    }
    };
     
      console.log("User State updated from Login.tsx page", { wallet, token: user?.token, wallet_type: user?.wallet_type });
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  }
};

useEffect(() => {
  // Check if the walletAddress has a value
  if (walletAddress?.address) {
    console.log("Detected a new wallet address: ", walletAddress.address);
    // Then set that into your user state
    setUser(prev => ({
      ...prev,
      token: user?.token || '', // Assuming token is always available upon successful login
      wallet_type: 'waas',
      wallet: walletAddress.address, // Provide a default value that matches the expected type in User
      achievements: prev?.achievements || {}, // Default empty object, adjust based on actual type
      dollyCount: prev?.dollyCount || 0, // Provide a default number
      UUID: prev?.UUID || '', // Default empty string, assuming UUID should be a string
      address: walletAddress.address || '', // Default empty string
      dollys: prev?.dollys || [], // Default empty array
      colors: prev?.colors || [],
      traits: prev?.traits || [],
      skin_colors: prev?.skin_colors || [],
      tokens: prev?.tokens || [],
      hideSaveChangesModal: prev?.hideSaveChangesModal || false,
      profile_name: prev?.profile_name || '',
      profile_image_url: prev?.profile_image_url || '',
      tier: prev?.tier || 'Fresh Cupcake',
      cupcake_points: prev?.cupcake_points || 0,
      level: prev?.level || 0,
    }));
  }
}, [walletAddress, setUser]);

useEffect(() => {
  console.log("Current user state after  'setUser':", user);
}, [user]);
return (
  <RainbowKitProvider chains={chains} initialChain={mainnet}>
    <div className="flex justify-center items-center w-full px-6 mx-auto">
      <div className="relative rounded-3xl overflow-hidden max-w-[1250px] w-full h-[80vh] flex flex-col justify-center items-center mx-auto">

        {/* Buttons in vertical column */}
        <div className="absolute z-10 flex flex-col items-center justify-center gap-4">
          
          {user ? (
            <>
              <h1 className="text-4xl luckiest !text-red-500 bg-white">{`Wallet Address: ${walletAddress?.address || 'Create Your Address To Get Started'}`}</h1>
              
              <button
                onClick={handleCreateWallet}
                className="hunnys-btn bg-pink-400 exportKeys uppercase !text-black text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
              >
                Create Address
              </button>
              <button
                onClick={logout}
                className="hunnys-btn bg-red-400 logout uppercase !text-black text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
              >
                Log Out
              </button>
              {/* Inputs */}
              {user && walletAddress?.address ? (
                
        <div className="relative bottom-0 mt-24 z-10 flex flex-col items-center justify-center gap-4">
          <input
            type="password"
            value={backupPhrase}
            onChange={(e) => setBackupPhrase(e.target.value)}
            placeholder="Backup Phrase"
            className="uppercase !text-black text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
          />
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter Passcode"
            className="uppercase !text-black text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
          />
          <button
                onClick={logout}
                className="hunnys-btn bg-red-400 logout uppercase !text-black text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
              >
                Go Back
              </button>
        </div>
        ) : (
          <><div className="absolute bottom-0 mt-32 z-10 flex flex-col items-center justify-center gap-4"></div><button
                    onClick={() => exportKeysFromHostedBackup(passcode)}
                    className="hunnys-btn bg-green-400 exportKeys uppercase !text-black text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
                  >
                    Export Keys from Hosted Backup
                  </button><button
                    onClick={() => restoreWalletFromHostedBackup(passcode)}
                    className="hunnys-btn bg-blue-400 restoreWallet uppercase !text-black text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
                  >
                      Restore Wallet from Hosted Backup
                    </button></>
        )}</>
          ) : (
            <>
            <div
            onClick={openConnectModal}
            className="hunnys-btn bg-[#ffd54b] loginConnect uppercase !text-black text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
          >
            Sign In With Ethereum
          </div>
            <button
                onClick={handleLogin}
                disabled={isLoggingIn || isLoading}
                className="hunnys-btn bg-green-400 loginWaas uppercase !text-black text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
              >
                Create New Account
              </button></>
          )}
        </div>

        {/* Image positioned beneath buttons */}
        <Image
          className="rounded-3xl absolute w-full h-full object-cover"
          src={loadingImage}
          alt="Loading"
          layout="fill"
        />
        {!mounted && <Loader />}
        {message && <div className="message absolute bottom-0">{message}</div>}
        {error && <div className="error absolute bottom-0 text-4xl luckiest !text-red-500 bg-white">{error}</div>}
      </div>
    </div>
  </RainbowKitProvider>
);
  
  
}
