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
