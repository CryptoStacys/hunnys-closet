// src/utils/mintDolly.ts
import { useContractWrite, useNetwork, useSwitchNetwork } from 'wagmi';
import closetABI from '../data/abi/HunnysCloset.json';
import { chainID, closetAddress } from '../data/config';

export function useMintDolly() {
    const { chain: currentChain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();
    const expectedChainId = 1; // Ethereum Mainnet Chain ID

    const { write, isLoading, isSuccess, error } = useContractWrite({
        address: closetAddress as `0x${string}`, // type assertion
        chainId: chainID,
        abi: closetABI,
        args: [1], // mint 1
        functionName: "mintPublic",
    });

    const mintDolly = async () => {
        if (currentChain?.id !== expectedChainId) {
            switchNetwork && await switchNetwork(expectedChainId);
        } else {
            write?.();
        }
        };

  return { mintDolly, isLoading, isSuccess, error };
}
