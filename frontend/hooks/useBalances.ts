"use client";

import { formatEther } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { contracts, erc20Abi } from "@/lib/contracts";

export function useBalances() {
  const { address } = useAccount();
  const eth = useBalance({ 
    address, 
    chainId: 11155111, // Sepolia chain ID
    query: { 
      enabled: Boolean(address),
      refetchInterval: 10000 // Refetch every 10 seconds
    } 
  });
  const nation = useReadContract({
    address: contracts.nationToken,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && contracts.nationToken) }
  });
  const gov = useReadContract({
    address: contracts.govToken,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && contracts.govToken) }
  });
  
  return {
    eth: eth.data?.formatted ? Number(eth.data.formatted).toFixed(4) : "0.0000",
    nation: nation.data ? Number(formatEther(nation.data)).toFixed(2) : "0",
    gov: gov.data ? Number(formatEther(gov.data)).toFixed(2) : "0",
    isLoading: eth.isLoading || nation.isLoading || gov.isLoading
  };
}
