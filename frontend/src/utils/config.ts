import { http, createConfig } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, polygon],
  transports: {
    [mainnet.id]: http('https://mainnet.infura.io/v3/5239f83d36634330bd900f94158cf76e'),
    [polygon.id]: http('https://polygon-mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac'),
  },
})