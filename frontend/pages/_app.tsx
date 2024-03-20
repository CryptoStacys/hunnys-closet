import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "./../styles/index.css";
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import type { AppProps } from "next/app";
import App from "./index";
import { useAccount, WagmiProvider } from 'wagmi';
import { WalletProvider } from "@coinbase/waas-sdk-web-react";
import { config } from '../src/utils/wagmiConfig'
import { 
  createConfig, 
  http 
} from '@wagmi/core'
import {
  mainnet,
  polygon,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
// Use the Next.js Link component instead of your custom Link component for navigation
import Link from "next/link";
import { Account } from '../src/components/Wallet/account' 

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: any;
  }
}


const queryClient = new QueryClient();

function ConnectWallet() { 
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return null; // Return null if not connected to prevent React from complaining about missing return
}

import { usePathname } from "next/navigation";
import { assert } from "console";

function MyApp({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {};

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    checkRoute();
  }, [checkRoute]);

  function checkRoute() {
    const paths = ["/", "/inventory", "/dollys", "/help", "/profile"];
    if (!paths.includes(pathname)) {
      router.push("/");
    }
  }

  return (
    <WalletProvider
      collectAndReportMetrics
      enableHostedBackups
      projectId="90840334-4797-45ff-bb86-6823701b4b3a"
      prod={false} // Set to true for production
    >
      <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
      <ConnectWallet /> 
        <RainbowKitProvider coolMode>
          <Component />

          <Analytics />
        </RainbowKitProvider>
        </QueryClientProvider> 
      </WagmiProvider>
    </WalletProvider>
  );
}

export default MyApp;
