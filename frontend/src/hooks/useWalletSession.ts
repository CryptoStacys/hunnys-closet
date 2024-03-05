// useWalletSession.ts

import { useCallback, useState, useEffect } from "react";
import { useEVMAddress, useWalletContext } from "@coinbase/waas-sdk-web-react";
import { userAtom } from "../data/store";
import { useAtom } from "jotai";
import { User } from "../data/global";

const useWalletSession = () => {
  const [, setUser] = useAtom(userAtom);
  const {
    waas,
    wallet,
    user: waasUser,
    isCreatingWallet,
    error: waasError,
  } = useWalletContext();

  // Since Coinbase handles authentication, we don't need to fetch the auth token ourselves.
  const login = useCallback(async () => {
    console.log("Attempting to login...");
    if (waas && waas.login) {
      await waas.login();
      console.log("Login successful.");
      console.log("Checking post-login state..."); // New log line
      
      // Let's check the state of `waasUser` and `wallet` after login
      console.log(`Post-login waasUser: ${waasUser}`);
      console.log(`Post-login wallet state: ${wallet}`);
      
      setUser((prev) => {
        const updatedUser: User = {
          wallet_type: "waas",
          wallet: wallet, // Provide a default value that matches the expected type in User
          achievements: prev?.achievements || {}, // Default empty object, adjust based on actual type
          dollyCount: prev?.dollyCount || 0, // Provide a default number
          address: prev?.address || "", // Default empty string
          dollys: prev?.dollys || [], // Default empty array
          colors: prev?.colors || [],
          traits: prev?.traits || [],
          skin_colors: prev?.skin_colors || [],
          tokens: prev?.tokens || [],
          hideSaveChangesModal: prev?.hideSaveChangesModal || false,
          profile_name: prev?.profile_name || "",
          profile_image_url: prev?.profile_image_url || "",
          tier: prev?.tier || "Fresh Cupcake",
          cupcake_points: prev?.cupcake_points || 0,
          level: prev?.level || 0,
          UUID: "",
          token: "not_applicable",
          titles: []
        };
        console.log("User info:", updatedUser);
        return updatedUser;
      });
    } else {
      console.error("waas object or waas.login not found."); // Note this error condition
    }
  }, [waas, setUser, waasUser, wallet]);

  const logout = useCallback(async () => {
    if (waas && waas.logout) {
      await waas.logout();
      setUser(null); // Reset global user state on logout
      console.log("Logout successful.");
    }
  }, [waas, setUser]);

  return { 
    waas, 
    user: waasUser,
    wallet,
    isCreatingWallet,
    error: waasError,
    login,
    logout,
  };
};

export default useWalletSession;
