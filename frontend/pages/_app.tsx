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
import { wagmiConfig } from '../src/utils/wagmiConfig'
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
import { WalletOptions } from '../src/components/Wallet/wallet-options' 

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: any;
  }
}



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

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [coinbaseWallet, rainbowWallet, walletConnectWallet, ledgerWallet, metaMaskWallet, injectedWallet, trustWallet, argentWallet],
    },
  ],
  {
    appName: 'Hunnys Closet',
    projectId: 'dc9e83a4ea618721d7c59c905af47837',
  }
);

const config = createConfig({
  chains: [mainnet, polygon],
  ssr: true, // If your dApp uses server side rendering (SSR)
  connectors,
  transports: {
    [mainnet.id]: http('https://mainnet.infura.io/v3/5239f83d36634330bd900f94158cf76e'),
    [polygon.id]: http('https://polygon-mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac'),
  },
})

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
