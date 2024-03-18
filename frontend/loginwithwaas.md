const loading = "/assets/img/loading.gif";
import { useConnectModal, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, WagmiConfig } from 'wagmi';
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
import { InitializeWaas, Wallet, ProtocolFamily, Logout } from '@coinbase/waas-sdk-web';

import React, {useState, useEffect} from 'react'

export default function Login() {
  // rainbowkit modal
  const [mounted, setMounted] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [loadingImage, setLoadingImage] = useState(loading1); // Initialize with one of the images
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { openConnectModal } = useConnectModal();

  const logout = async () => {
    if (!wallet) {
      console.log("No active wallet session to logout from.");
      return;
    }
    console.log("Initiating logout...");
    try {
      if (wallet) { // Ensure there's a condition that validates logout can be performed
        await Logout();
        setWallet(null);
        setAddress(null);
        localStorage.removeItem("walletInfo"); // Ensure to clear localStorage
        console.log("Logout successful");
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const performLogout = async () => {
    if (!wallet) {
      console.error("Wallet not available");
      return;
      }
      try {
        await Logout();
      setWallet(null);
      setAddress(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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

  const handleCreateWallet = async () => {
    setIsLoading(true);
    setError('');
    try {
        // Request for authentication token
        const authResponse = await fetch("https://wallets.hunnysnft.com/auth", { method: 'POST' });
        const authData = await authResponse.json();
        if (!authData.token) {
            throw new Error('Failed to fetch authentication token');
        }

        // Log the auth token and UUID received from wallets.hunnysnft.com/auth
        console.log(`Authentication token received: ${authData.token}`);
        console.log(`UUID received: ${authData.userID}`);

        const waas = await InitializeWaas({ provideAuthToken: async () => authData.token });
        const newWallet = await waas.wallets.create("Your_Passcode_Here"); // Consider using a more secure approach for passcodes
        const walletAddressResponse = await newWallet.addresses.for(ProtocolFamily.EVM);
        const walletAddress = walletAddressResponse.address;
        
        console.log(`Wallet address: ${walletAddress}`); // Log the wallet address
        
        setWallet(newWallet);
        setAddress(walletAddress);
        
        // Payload that is about to be sent to the backend
        const postData = {
          action: 'create',
          wallet: walletAddress, // The wallet address you just obtained
          token: authData.token, // Token from the /auth response
          UUID: authData.userID, // UUID from the /auth response
        };

        // Log the payload
        console.log('Payload being sent to the backend:', JSON.stringify(postData, null, 2));

        const response = await fetch('https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        
        const result = await response.json();
        console.log('Backend response:', result); // Log the backend response
    } catch (error) {
        console.error('Error creating wallet:', error);
        setError('Failed to create wallet. Please try again.');
    } finally {
        setIsLoading(false);
    }
};


  
  const toggleWalletCreation = () => setIsCreatingWallet(!isCreatingWallet);




  return (
    <RainbowKitProvider chains={chains} initialChain={mainnet}>
      <div className="flex justify-center items-center w-full px-6 mx-auto">
        <div className="relative rounded-3xl overflow-hidden max-w-[1250px] w-full h-[80vh] mx-auto flex items-center justify-center">
          <Image className="rounded-3xl" src="/assets/img/your-default-image.png" alt="Background" width={3000} height={1688} />
          {!isCreatingWallet ? (
            mounted && openConnectModal ? (
              <div
                onClick={openConnectModal}
                className="absolute mx-auto bg-[#ffd54b] loginConnect uppercase text-white text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer"
              >
                Connect Existing Wallet
              </div>
            ) : (
              <Loader />
            )
          ) : null}
          
          <div className="absolute bottom-10 right-10">
            {isCreatingWallet ? (
              <>
                {/* Adapted UI from WaasComponent for creating a wallet */}
                <button onClick={handleCreateWallet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Create Wallet
                </button>
                <button onClick={toggleWalletCreation} className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                  Back to Connect Wallet
                </button>
                <button
            onClick={performLogout}
            className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded col-start-2"
          >
            Logout
        </button>
              </>
            ) : (
              <button onClick={toggleWalletCreation} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Or Create New Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </RainbowKitProvider>
  );
}



import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useWalletContext } from '@coinbase/waas-sdk-web-react';
import { Loader } from "../Loader/Loader";

// Static images
const loading = "/assets/img/loading.gif";
const loadingImages = [
  "/assets/img/LoadingTip1.png",
  "/assets/img/LoadingTip2.png",
  "/assets/img/LoadingTip3.png",
  "/assets/img/LoadingTip4.png",
  "/assets/img/LoadingTip5.png",
  "/assets/img/LoadingTip6.png",
];

export default function Login() {
  const [mounted, setMounted] = useState(false);
  const [loadingImage, setLoadingImage] = useState(loading);
  const { waas, user, isCreatingWallet, wallet } = useWalletContext();


  useEffect(() => {
    setMounted(true);
    // Randomly select an image
    const randomImage = loadingImages[Math.floor(Math.random() * loadingImages.length)];
    setLoadingImage(randomImage);
  }, []);

// Login the user.
const handleLogin = async () => {
  await waas?.login();
}

// Logout the user.
const handleLogout = async () => {
  await waas?.logout();
}

  return (
    <div className="flex justify-center items-center w-full px-6 mx-auto">
      <div className="relative rounded-3xl overflow-hidden max-w-[1250px] w-full h-[80vh] mx-auto flex items-center justify-center">
        <Image className="rounded-3xl" src={loadingImage} alt="Loading" width={3000} height={1688} unoptimized />
        
        <div>
    {!user &&  <button className='hunnys-btn bg-[#ffd54b] loginConnect uppercase !text-black text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer' onClick={handleLogin}>Login</button>}
    {user && <p>User is logged in!</p>}
    {wallet && <p>Wallet is loaded</p>}
    {user && <button className='hunnys-btn bg-[#000] loginConnect uppercase !text-white text-4xl font-bold font-title tracking-wider px-14 py-3 rounded-md hover:cursor-pointer' onClick={handleLogout}>Logout</button>}
  </div>
      </div>
    </div>
  );
}
