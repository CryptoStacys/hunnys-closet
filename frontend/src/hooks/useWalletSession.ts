import { useCallback, useState, useEffect } from 'react';
import { useWalletContext } from "@coinbase/waas-sdk-web-react";
import { allTraitsAtom, userAtom, connectedAtom } from "../../src/data/store";
import { useAtom } from 'jotai';
import { User } from '../data/global';

const useWalletSession = () => {
  const [, setUser] = useAtom(userAtom);
  const {
      waas, 
      wallet, 
      user: waasUser, // Renamed to avoid confusion with global user state
      isCreatingWallet,
      isLoggingIn,
      error: waasError,
  } = useWalletContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user token from your auth backend
  const fetchUserToken = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8082/auth', { method: 'POST' });
      const data = await response.json();
      console.log("TokenFetched...", data);
      if (!data.token) throw new Error('No token received');
      // Return both token and UUID
      return { token: data.token, UUID: data.UUID };
    } catch (err) {
      setError('Failed to fetch user token');
      setIsLoading(false);
      throw err;
    }
  }, []);

  const login = useCallback(async () => {
    console.log("Attempting to login...");
    try {
      const { token, UUID } = await fetchUserToken();
      if (waas && waas.login) {
        await waas.login({ provideAuthToken: () => Promise.resolve(token) });
        console.log("Login successful.");
        setUser(prev => {
          const updatedUser: User = {
            token: token, // Assuming token is always available upon successful login
            wallet_type: 'waas',
            wallet: prev?.wallet || '', // Provide a default value that matches the expected type in User
            achievements: prev?.achievements || {}, // Default empty object, adjust based on actual type
            dollyCount: prev?.dollyCount || 0, // Provide a default number
            UUID: UUID || '', // Default empty string, assuming UUID should be a string
            address: prev?.address || '', // Default empty string
            dollys: prev?.dollys || [], // Default empty array
            colors: prev?.colors || [],
            traits: prev?.traits || [],
            skin_colors: prev?.skin_colors || [],
            tokens: prev?.tokens || [],
            hideSaveChangesModal: prev?.hideSaveChangesModal || false,
            profile_name: prev?.profile_name || '',
            profile_image_url: prev?.profile_image_url || '',
            tier: prev?.tier || 'Fresh Cupcake',
            cupcake_points: prev?.cupcake_points || 0,
            level: prev?.level || 0,
          };
          return updatedUser;
        });
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError('Login failed');
    }
    setIsLoading(false);
  }, [fetchUserToken, waas, setUser]);
  

  const logout = useCallback(async () => {
    if (waas && waas.logout) {
        await waas.logout();
        setUser(null); // Reset global user state on logout
    }
  }, [waas, setUser]);

  useEffect(() => {
      const token = localStorage.getItem('userToken');
      if (token && !waasUser && !isLoggingIn) {
          login();
      }
  }, [login, waasUser, isLoggingIn]);

    const restoreWalletFromHostedBackup = useCallback(async (passcode: string | undefined) => {
      if (!waasUser || !waasUser.restoreFromHostedBackup) {
          console.error("User context or restore function not available.");
          return;
      }

      try {
          const restoredWallet = await waasUser.restoreFromHostedBackup(passcode);
          console.log("Wallet restored successfully:", restoredWallet);
          // Handle success (e.g., update state, display message)
      } catch (error) {
          console.error("Failed to restore wallet:", error);
          // Handle error
      }
  }, [waasUser]);

  // Function to export keys from the wallet
  const exportKeysFromHostedBackup = useCallback(async (passcode: string | undefined) => {
      if (!waasUser || !wallet) {
          console.error("Wallet or user context not available.");
          return;
      }

      try {
          // Assuming you have a method on the wallet or user object for this
          const keys = await wallet.exportKeysFromHostedBackup(passcode);
          console.log("Exported keys:", keys);
          // Handle success (e.g., show keys, store securely)
      } catch (error) {
          console.error("Failed to export keys:", error);
          // Handle error
      }
  }, [waasUser, wallet]);

  return { 
      waas, 
      user: waasUser,
      wallet,
      isLoggingIn,
      isLoading,
      error,
      login,
      logout,
      restoreWalletFromHostedBackup,
      exportKeysFromHostedBackup,
      fetchUserToken,
    };
};

export default useWalletSession;
