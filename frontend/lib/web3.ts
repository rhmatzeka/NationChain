"use client";

import { QueryClient } from "@tanstack/react-query";
import { createConfig, http, fallback } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: fallback([
      http('https://rpc.sepolia.org'),
      http('https://ethereum-sepolia.publicnode.com'),
      http('https://rpc2.sepolia.org'),
      http('https://sepolia.gateway.tenderly.co')
    ])
  },
  ssr: true
});
