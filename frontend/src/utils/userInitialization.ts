import { Route } from '../components/Router/Router';
import { useAccount } from "wagmi";
import { useAtom } from "jotai";
import React, { useState, useEffect } from 'react';
import { allTraitsAtom, userAtom, connectedAtom, userTraitsAtom } from "../data/store";
import { attributes, localStorageToken } from "../data/config";
import { useRouter } from 'next/router';
import { User } from '../data/global';

export async function initializeUser(address: string, setUser: (action: User | ((prevUser: User | null) => User | null)) => void, setAllTraits: (action: any) => void, setUserTraits: (action: any) => void, setConnected: (action: boolean) => void) {
    
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
      setUserTraits(closetData);
  
      // Update Last Login Time
      const loginResponse = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'login', // Assuming you want to update last login on every connect
            wallet_type: "waas",
            wallet: address,
            address: address,
            achievements: {},
            dollyCount: 0,
            UUID: "",
            dollys: [],
            colors: [],
            traits: [],
            skin_colors: [],
            tokens: [],
            hideSaveChangesModal: false,
            profile_name: "",
            profile_image_url: "",
            tier: "Fresh Cupcake",
            cupcake_points: 0,
            level: 0, // User's wallet address
        }),
      });
      if (!loginResponse.ok) throw new Error('Failed to update last login time.');
      const loginData = await loginResponse.json();
      console.log('Success:', loginData);
  
      // Fetch user profile
      const profileResponse = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts?action=getProfile&wallet=${address}`);
      if (!profileResponse.ok) throw new Error('Failed to fetch user profile.');
      const profileData = await profileResponse.json();
      console.log("Profile Data from Index:", profileData);

      let parsedAchievements = {};
      if (profileData.data.achievements && typeof profileData.data.achievements === 'string') {
        try {
          parsedAchievements = JSON.parse(profileData.data.achievements);
        } catch (error) {
          console.error("Error parsing achievements JSON:", error);
        }
      }

      // Combine data and update user atom
      setUser(prevUser => ({
        ...prevUser,
        ...profileData.data, // Assuming profileData contains a 'data' key with user details
        ...closetData,
        traits: closetData.traits,
        dollyCount: closetData.dollys?.length || 0,
        address: address,
        achievements: parsedAchievements,
      }));
  
      setConnected(true);
    } catch (error) {
      console.error(error);
      setConnected(false);
      // Optionally reset user state or handle error
    }
  }
  
