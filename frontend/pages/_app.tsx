import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "./../styles/index.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import type { AppProps } from "next/app";
import App from "./index";
import { useAccount, WagmiProvider } from 'wagmi';
import { WalletProvider } from "@coinbase/waas-sdk-web-react";
import { wagmiConfig } from '../src/utils/wagmiConfig'
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
import { WalletOptions } from '../src/components/Wallet/wallet-options' 

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: any;
  }
}


const queryClient = new QueryClient()
function ConnectWallet() { 
  const { isConnected } = useAccount() 
  if (isConnected) return <Account /> 
} 


import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";

const config = getDefaultConfig({
  appName: 'Hunnys Closet',
  projectId: 'dc9e83a4ea618721d7c59c905af47837',
  chains: [mainnet, polygon, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});


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
      projectId="86313968-8c02-42ef-91d1-c4e2d7458a0f"
      prod={true} // Set to true for production
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
