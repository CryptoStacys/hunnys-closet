import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism, polygon } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = 'dc9e83a4ea618721d7c59c905af47837'

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon],
  ssr: true, // If your dApp uses server side rendering (SSR)
  connectors: [
    injected(),
    walletConnect({ projectId }),
    safe(),
  ],
  transports: {
    [mainnet.id]: http("https://mainnet.infura.io/v3/5239f83d36634330bd900f94158cf76e"),
    [polygon.id]: http('https://polygon-mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac'),
  },
})