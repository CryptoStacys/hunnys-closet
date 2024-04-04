// src/utils/fetchBalances.ts
import { ethers } from "ethers";

import React, { useState, useEffect, useCallback, useRef } from "react";
const ethProvider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/5239f83d36634330bd900f94158cf76e");
const polygonProvider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/2540ef4e847c4dea838bacade9c4fcac");

const WETHContractAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
const WETHAbi = ["function balanceOf(address owner) view returns (uint256)"];

export const fetchBalances = async (userAddress: string) => {
    if (!userAddress) {
        return { ethBalance: "", polygonBalance: "" };
    }

    const ethBalance = await ethProvider.getBalance(userAddress);
    const wethContract = new ethers.Contract(WETHContractAddress, WETHAbi, polygonProvider);
    const polygonBalance = await wethContract.balanceOf(userAddress);

    return {
        ethBalance: ethers.utils.formatEther(ethBalance),
        polygonBalance: ethers.utils.formatEther(polygonBalance),
    };
};
