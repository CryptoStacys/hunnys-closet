// src/utils/fetchBalances.ts
import { ethers } from "ethers";

const ethProvider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/5239f83d36634330bd900f94158cf76e");
const polygonProvider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac");
const baseProvider = new ethers.providers.JsonRpcProvider("https://base-mainnet.g.alchemy.com/v2/Y9AirihU_kvzbWDOO7RPs68bSH5DtFTG");

const WETHContractAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
const WETHAbi = ["function balanceOf(address owner) view returns (uint256)"];

export const fetchBalances = async (userAddress: string) => {
    if (!userAddress) {
        return { ethBalance: "0.0000", polygonBalance: "0.0000", baseBalance: "0.0000" };
    }

    const ethBalance = await ethProvider.getBalance(userAddress);
    const wethContract = new ethers.Contract(WETHContractAddress, WETHAbi, polygonProvider);
    const polygonBalance = await wethContract.balanceOf(userAddress);
    const baseBalance = await baseProvider.getBalance(userAddress);

    // Use parseFloat to convert the string to a float and then toFixed to format it
    const formattedEthBalance = parseFloat(ethers.utils.formatEther(ethBalance)).toFixed(4);
    const formattedPolygonBalance = parseFloat(ethers.utils.formatEther(polygonBalance)).toFixed(4);
    const formattedBaseBalance = parseFloat(ethers.utils.formatEther(baseBalance)).toFixed(4);

    return {
        ethBalance: formattedEthBalance,
        polygonBalance: formattedPolygonBalance,
        baseBalance: formattedBaseBalance,
    };
};

