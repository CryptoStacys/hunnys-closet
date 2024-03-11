import { Route } from '../src/components/Router/Router';
import { useAccount } from "wagmi";
import { useAtom } from "jotai";
import React, { useState, useEffect } from 'react';
import { allTraitsAtom, userAtom, connectedAtom, userTraitsAtom } from "../src/data/store";
import { attributes, localStorageToken } from "../src/data/config";
import Dashboard from '../src/components/Dashboard/Dashboard';
import Dollys from "./dollys";
import Inventory from "./inventory";
import Help from "./help";
import Nav from "../src/components/Nav/Nav";
import Login from "../src/components/Login/Login";
import Modal from "../src/components/Modal/Modal";
import sparkleBg from "./../src/assets/img/sparkle_bg.png";
import { useRouter } from 'next/router';

export default function App() {
  const [user, setUser] = useAtom(userAtom);
  const [allTraits, setAllTraits] = useAtom(allTraitsAtom);
  const [userTraits, setUserTraits] = useAtom(userTraitsAtom);
  const [connected, setConnected] = useAtom(connectedAtom);
  const [dollyCount, setDollyCount] = useState("");
  const router = useRouter();

  const { isConnected, address } = useAccount({
    onConnect: async ({ address }) => {
      try {
        // Fetch traits
        const traitsResponse = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/traits?wallet=${address}`);
        if (!traitsResponse.ok) throw new Error('Failed to fetch traits.');
        const traitsData = await traitsResponse.json();
        console.log("Traits Data from Index:", traitsData);
        setAllTraits(traitsData);

        // Fetch verifyCloset data
        const closetResponse = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/verifyCloset?wallet=${address}`);
        if (!closetResponse.ok) throw new Error('Failed to fetch closet data.');
        const closetData = await closetResponse.json();
        console.log("Closet Data from Index:", closetData);
        setUserTraits(closetData)

        // Update Last Login Time
        fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login', // Assuming you want to update last login on every connect
          wallet: address, // User's wallet address
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      
      // Fetch user profile
      const profileResponse = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts?action=getProfile&wallet=${address}`);
      if (!profileResponse.ok) throw new Error('Failed to fetch user profile.');
      const profileDataResponse = await profileResponse.json();
      console.log("Profile Data from Index:", profileDataResponse);
      
      let parsedAchievements = {};
      if (profileDataResponse.data.achievements && typeof profileDataResponse.data.achievements === 'string') {
          try {
            parsedAchievements = JSON.parse(profileDataResponse.data.achievements);
          } catch (error) {
            console.error("Error parsing achievements JSON:", error);
            // Handle the error or set parsedAchievements to a default value if needed
          }
      }
      
      // Combine data and update user atom
      setUser({
        ...profileDataResponse.data, // Assuming profileDataResponse contains a 'data' key with user details
        ...closetData,
        traits: closetData.traits, // Assuming traits is the key you want from traitsData
        dollyCount: closetData.dollys?.length || 0,
        address: address,
        achievements: parsedAchievements, // Use the parsed achievements
      });

        setConnected(true);
      } catch (error) {
        console.error(error);
        setConnected(false);
      }
    },
    onDisconnect: () => {
      setUser(null); // Reset user state
      setConnected(false); // Indicate that the user is no longer connected
      // Redirect to home page
      router.push("/");
    },
  });

  useEffect(() => {
    initializeLocalStorageForNewUsers();
  }, []); // Empty dependency array ensures this runs once on mount.

  function initializeLocalStorageForNewUsers() {
    const existingToken = localStorage.getItem(localStorageToken);
    if (!existingToken) {
      // Define a default, empty array or an array with default traits.
      const defaultTraits: never[] = []; // Adjust based on what constitutes an "empty" dolly.
      localStorage.setItem(localStorageToken, JSON.stringify(defaultTraits));
      console.log("Initialized local storage with default dolly traits.");
    }
  }

  useEffect(() => {
    if (!isConnected) {
      // Redirect or handle the user not being connected
    }
  }, [isConnected, router]);

  return (
    <div className="pb-8 ">
      <Nav rewardStatus={''} />
      <Modal />
      <div className="relative mt-[70px] z-30">
        {!connected ? (
          <Login />
        ) : (
          <> 
          <Route path="/">
            <Dashboard />
          </Route>
          <Route path="/dollys">
            <Dollys />
          </Route>
          {/* <Route path="/tokens">
            <Tokens />
          </Route> */}
          <Route path="/help">
            <Help />
          </Route>
            
          </>
        )}
      </div>
    </div>
  );
}
