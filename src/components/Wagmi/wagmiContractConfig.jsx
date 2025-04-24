/** @format */
import TODO from "./TodoABI.json";

export const WagmiContractConfig = {
  address: import.meta.env.VITE_CONTRACT_ADDRESS,
  abi: TODO,
};
