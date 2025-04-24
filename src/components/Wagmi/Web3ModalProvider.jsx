/** @format */

import PropTypes from "prop-types";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WagmiProvider } from "wagmi";
import { config } from "./WagmiConfig.jsx";

// 0. Setup queryClient
const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_WALLETCONECT_PROJECTID;

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export function Web3ModalProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

// Add PropTypes validation
Web3ModalProvider.propTypes = {
  children: PropTypes.node.isRequired, // Ensures 'children' is a valid React node
};
