/** @format */

import TODOABI from "./TodoABI.json";

// import { WagmiContractConfig } from "./wagmiContractConfig";

import {
  getAccount,
  readContract,
  // readContracts,
  simulateContract,
  writeContract,
  sendTransaction,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { sepolia } from "viem/chains";
import { parseEther } from "viem";
import { config } from "./WagmiConfig.jsx";

export const Hooks = () => {
  let { address } = getAccount(config);

  let todoContract = import.meta.env.VITE_CONTRACT_ADDRESS;

  const getAllTodoData = async () => {
    try {
      let result = await readContract(config, {
        abi: TODOABI,
        address: todoContract,
        functionName: "getAllTodo",
        chainId: sepolia.id,
      });

      for (let i = 0; i < result.length; i++) {
        result[i].taskId = i;
        result[i].createdAt = new Date(
          Number(result[i].createdAt) * 1000
        ).toLocaleDateString("sv");

        result[i].updatedAt =
          result[i].updatedAt > 0
            ? new Date(Number(result[i].updatedAt) * 1000).toLocaleDateString(
                "sv"
              )
            : 0;
      }

      return {
        status: true,
        result: result,
      };
    } catch (error) {
      console.log("getUserDetails error --->>> ", error);
      return {
        status: false,
        result: [],
      };
    }
  };

  const getTodoData = async (taskId) => {
    try {
      let result = await readContract(config, {
        abi: TODOABI,
        address: todoContract,
        functionName: "details",
        args: [taskId],
        chainId: sepolia.id,
      });

      result[3] = new Date(Number(result[3]) * 1000).toLocaleDateString("sv");

      result[4] =
        result[4] > 0
          ? new Date(Number(result[4]) * 1000).toLocaleDateString("sv")
          : 0;

      return {
        status: true,
        result: result,
      };
    } catch (error) {
      console.log("getUserDetails error --->>> ", error);
      return {
        status: false,
        result: [],
      };
    }
  };

  const sendTransactions = async (walletAddress, amount) => {
    const result = await sendTransaction(config, {
      account: address,
      to: walletAddress,
      value: parseEther(amount),
    });

    const txHash = await waitForTransactionReceipt(config, {
      hash: result,
    });

    console.log("txHash", result, txHash);

    if (txHash.status) {
      return {
        status: true,
        hash: result,
        message: "Transaction Sent Successfully!",
      };
    } else {
      return {
        status: false,
        hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        message: "Transaction Failed!",
      };
    }
  };

  const createTask = async (taskName, taskDescription) => {
    if (address === undefined) {
      return {
        status: false,
        message: "Please Connect Wallet",
      };
    }

    console.log("taskName, taskDescription --->>", taskName, taskDescription);
    let result;

    try {
      // Simulate the contract call to ensure parameters are correct
      const { request } = await simulateContract(config, {
        abi: TODOABI,
        address: todoContract,
        functionName: "addTask",
        args: [taskName, taskDescription],
        chainId: sepolia.id,
      });

      // Perform the actual contract write operation
      const transactionHash = await writeContract(config, request);

      // Wait for the transaction receipt
      result = await waitForTransactionReceipt(config, {
        chainId: sepolia.id,
        hash: transactionHash,
      });

      if (result.status == "success") {
        result = {
          status: true,
          hash: transactionHash,
          message: "Task Add Successfully",
        };
      } else {
        result = {
          status: false,
          hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
          message: "Something went wrong! Task Add",
        };
      }
    } catch (error) {
      console.error("Error in Add Task:", error);

      result = {
        status: false,
        hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        message: "Something went wrong! Adding Task Failed",
      };
    }

    return result;
  };

  const updateStatusHandler = async (taskId, name, description, status) => {
    if (!address) {
      return {
        status: false,
        message: "Please Connect Wallet",
      };
    }

    try {
      const { request } = await simulateContract(config, {
        abi: TODOABI,
        address: todoContract,
        functionName: "updateStatus",
        args: [taskId, name, description, status], // 🔥 all 4 updated args
        chainId: sepolia.id,
      });

      const transactionHash = await writeContract(config, request);

      const result = await waitForTransactionReceipt(config, {
        chainId: sepolia.id,
        hash: transactionHash,
      });

      if (result.status === "success") {
        return {
          status: true,
          hash: transactionHash,
          message: "Task Updated Successfully",
        };
      } else {
        return {
          status: false,
          message: "Update Failed",
        };
      }
    } catch (error) {
      console.error("Error while updating task: ", error);
      return {
        status: false,
        message: "Transaction Error",
      };
    }
  };

  const deleteTaskHandler = async (taskId) => {
    if (!address) {
      return {
        status: false,
        message: "Please Connect Wallet",
      };
    }

    try {
      const { request } = await simulateContract(config, {
        abi: TODOABI,
        address: todoContract,
        functionName: "deleteTask",
        args: [taskId],
        chainId: sepolia.id,
      });

      const transactionHash = await writeContract(config, request);

      const result = await waitForTransactionReceipt(config, {
        chainId: sepolia.id,
        hash: transactionHash,
      });

      if (result.status === "success") {
        return {
          status: true,
          hash: transactionHash,
          message: "Task Deleted Successfully",
        };
      } else {
        return {
          status: false,
          message: "Delete Failed",
        };
      }
    } catch (error) {
      console.error("Error while deleting task: ", error);
      return {
        status: false,
        message: "Transaction Error",
      };
    }
  };

  return {
    sendTransactions: sendTransactions,
    getAllTodoData: getAllTodoData,
    getTodoData: getTodoData,
    // write method
    createTask: createTask,
    updateStatusHandler: updateStatusHandler,
    deleteTaskHandler: deleteTaskHandler,
  };
};
