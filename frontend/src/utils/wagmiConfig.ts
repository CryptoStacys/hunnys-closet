import { createConfig } from 'wagmi'
import { base, mainnet, optimism, polygon } from 'wagmi/chains'
import { 
  http } from 'viem';
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
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

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

export const config = createConfig({
  chains: [mainnet, polygon],
  ssr: true, // If your dApp uses server side rendering (SSR)
  multiInjectedProviderDiscovery: true,
  connectors,
  transports: {
    [mainnet.id]: (() => {
      console.log("🌐 Using HTTP transport for Mainnet");
      return http("https://mainnet.infura.io/v3/5239f83d36634330bd900f94158cf76e");
    })(),
    [polygon.id]: (() => {
      console.log("🔮 Using HTTP transport for Polygon");
      return http('https://polygon-mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac');
    })(),
  },
})
