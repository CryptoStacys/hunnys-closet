import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import "./../styles/index.css";
import { getDefaultWallets, RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import App from "./index";
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { WalletProvider } from '@coinbase/waas-sdk-web-react';
import {
  goerli,
  mainnet,
  polygon,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/react';
// Use the Next.js Link component instead of your custom Link component for navigation
import Link from 'next/link';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: any;
  }
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    // goerli
  ],
  [
    alchemyProvider({ apiKey: "mBdjgiEK6KpJxHUg0aRZWswBw8vRgXgh" }),
    publicProvider()
  ]
);

import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";

const projectId = 'af873e966d19695d4979d906182d9751';

const { wallets } = getDefaultWallets({
  appName: 'Hunnys Dollys',
  projectId,
  chains,
});


const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

import { usePathname } from 'next/navigation';
import { assert } from 'console';

function MyApp({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      
    };


    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    checkRoute();
  }, [checkRoute]);

  function checkRoute() {
    const paths = ['/', '/inventory', '/dollys', '/help', '/profile'];
    if(!paths.includes(pathname)) {
      router.push('/');
    }
  }

  return (
    <WalletProvider
    collectAndReportMetrics
    enableHostedBackups
    projectId="90840334-4797-45ff-bb86-6823701b4b3a"
    autoCreateWallet={true}
    prod={false} // Set to true for production
  >
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider coolMode chains={chains}>
      
        <Component />
        
        <Analytics />
      </RainbowKitProvider>
    </WagmiConfig>
    </WalletProvider>
  );
}

export default MyApp;