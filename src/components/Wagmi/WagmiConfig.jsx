/** @format */

import { createConfig, http, injected } from "@wagmi/core";
import { sepolia } from "@wagmi/core/chains";
import { walletConnect } from "@wagmi/connectors";

import { createWalletClient, custom } from "viem";

const config = createConfig({
  chains: [sepolia],
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONECT_PROJECTID,
      showQrModal: false,
    }),
    injected(),
  ],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_API_KEY),
  },
});

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom({
    request: async ({ method, params }) => {
      const response = await fetch(import.meta.env.VITE_SEPOLIA_API_KEY, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      return response.json();
    },
  }),
});

export { config, walletClient };
