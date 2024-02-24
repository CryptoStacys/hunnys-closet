import { defineChain } from 'viem'
 
export const zora = defineChain({
    id: 84532,
    name: 'Base Sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.base.org'],
            webSocket: ['wss://ws.ws-sepolia.reservoir.tools'],
        },
        public: {
            http: [],
            webSocket: undefined
        }
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://base-sepolia.blockscout.com' },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 5882,
        },
    },
    network: ''
})
