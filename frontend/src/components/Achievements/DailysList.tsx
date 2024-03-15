// DailysList.tsx

import React from 'react';
import { Achievement, User, FreeClaimType, Dailys } from "../../data/global";
import DailysItem from '../Card/DailysItem';
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import Confetti from "react-confetti";
import useSound from "use-sound";
import { calculateLevel } from '../../utils/levelUtils';

  const DailysList = () => {
    const [user, setUser] = useAtom(userAtom);
    const [showConfetti, setShowConfetti] = React.useState(false);
    const [playRewardSound] = useSound("/sounds/reward.wav");
    const freeClaimsArray = Array.isArray(user?.free_claim) ? user?.free_claim : [];
    const dailysData: Dailys[] = [
    
    // Add dailys here
  ];
    const handleDailysClaim = async (dailysId: string) => {
      // Find the dailys based on the ID
      const daily = dailysData.find(a => a.id === dailysId);
    if (!daily) {
        console.error("Achievement not found");
        return;
    }
    const newCupcakePoints = Number(user?.cupcake_points) + daily.cupcakePoints;
    const newLevel = calculateLevel(newCupcakePoints);
    // Check if the daily is already claimed
    if (user?.dailys && user?.dailys[daily.challenge]?.claimed) {
        console.log("Achievement already claimed");
        return; // Stop the function if the achievement is already claimed
    }
      playRewardSound();
      const levelUpOccurred = newLevel > (user?.level ?? 0);
      if(levelUpOccurred) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000); // Adjust timing as needed
      }
  
      if (user?.wallet) {
        const profileData = {
          action: "claimDailys",
          wallet: user.wallet,
          cupcakePointsToAdd: daily.cupcakePoints, // Use cupcakePoints from the daily
          dailyId: daily.challenge, // Use challenge as the dailyId
          title: daily.title,
        };
  
        try {
          const response = await fetch(
            `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(profileData),
            }
          );
          const data = await response.json();
  
          if (data.success) {
            console.log("Daily claimed and points updated successfully");
            // Update the userAtom directly with the new data
            setUser((prevUser) => {
              if (!prevUser) return null; // In case prevUser is null, just return null
              const newDailys = {
                ...prevUser.dailys,
                [daily.challenge]: {
                  claimed: true,
                  date_claimed: new Date().toISOString(),
                  title: daily.title,
                },
              };
  
              // Update only if there's a change in level or cupcake_points
              if (newCupcakePoints !== prevUser.cupcake_points || newLevel !== prevUser.level) {
                return {
                  ...prevUser,
                  cupcake_points: newCupcakePoints,
                  level: newLevel,
                  dailys: newDailys,
                };
              }
              return {
                ...prevUser,
                dailys: newDailys,
              };
            });
          } else {
            console.error(data.message || "Failed to claim daily");
          }
        } catch (error) {
          console.error("Error claiming daily:", error);
        }
      } else {
        console.error("Missing user wallet.");
      }
    };

    const sortedDailys = dailysData.sort((a, b) => {
      // Default values in case user is null
      const defaultClaimed = false;
      const defaultEligible = false;
    
      // Check if user is null and assign default values or compute based on user's dailys and eligibility
      const aClaimed = user ? user.dailys && user.dailys[a.challenge]?.claimed : defaultClaimed;
      const bClaimed = user ? user.dailys && user.dailys[b.challenge]?.claimed : defaultClaimed;
      const aEligible = user ? (a.eligibilityCriteria ? a.eligibilityCriteria(user) : defaultEligible) : defaultEligible;
      const bEligible = user ? (b.eligibilityCriteria ? b.eligibilityCriteria(user) : defaultEligible) : defaultEligible;
    
      // Sorting logic remains the same
      if (aClaimed && !bClaimed) return 1;
      if (!aClaimed && bClaimed) return -1;
      if (!aEligible && bEligible) return 1;
      if (aEligible && !bEligible) return -1;
    
      return 0; // Default to original order for equivalent statuses
    });
    
  
    return (
      <div className="dailys-list">
        {showConfetti && <Confetti />}
        {sortedDailys.map((daily) => (
          <DailysItem
            key={daily.id}
            daily={daily}
            onClaim={() => handleDailysClaim(daily.id)}
            isClaimed={user?.dailys && user?.achievements[daily.challenge]?.claimed}
            isEligible={user ? (daily.eligibilityCriteria ? daily.eligibilityCriteria(user) : false) : false}
          />
        ))}
      </div>
    );
  };
  
  export default DailysList;