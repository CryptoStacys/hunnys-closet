import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism, polygon } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = 'dc9e83a4ea618721d7c59c905af47837'

export const wagmiConfig = createConfig({
  chains: [mainnet, base, polygon],
  ssr: true, // If your dApp uses server side rendering (SSR)
  connectors: [
    injected(),
    walletConnect({ projectId }),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
  },
})