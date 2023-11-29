import { getContract, readContract, writeContract } from "@wagmi/core";
import hunnysABI from "./../data/abi/Hunnys.json" assert { type: "json" };
import hunnysClosetABI from "./../data/abi/HunnysCloset.json" assert { type: "json" };

import { hunnysAddress, closetAddress } from "../data/config";

const contractOpt:any = {
  address: hunnysAddress,
  abi: hunnysABI,
}

export const contract = getContract(contractOpt);
// export const contract = getContract({
//   address: hunnysAddress,
//   abi: hunnysABI,
// });

export async function read(address: string, functionName: string, args?: any) {
  const readOtp:any = {
    address: hunnysAddress,
    abi: hunnysABI,
    functionName: functionName, // "baseTokenURI"
    args: args,
  }

  const data = await readContract(readOtp);

  // const data = await readContract({
  //   address: hunnysAddress,
  //   abi: hunnysABI,
  //   functionName: functionName, // "baseTokenURI"
  //   args: args,
  // });
  return data;
}
