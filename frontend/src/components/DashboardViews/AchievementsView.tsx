import React, { useState } from 'react';
import Card from '../Card/Card';
import { useAtom, useSetAtom } from "jotai";
import { userAtom } from "../../data/store";
import AchievementButton from '../Achievements/AchievementButton';
import ProgressBar from '../Achievements/ProgressBar';
import { User } from '../../data/global';
import Confetti from 'react-confetti';
import useSound from 'use-sound';

const AchievementsView: React.FC<{ fetchUserProfile: (walletAddress: string) => Promise<any> }> = ({ fetchUserProfile }) => {
  const [user] = useAtom(userAtom);
  const updateUserAtom = useSetAtom(userAtom);
  const [showConfetti, setShowConfetti] = useState(false);
  const dollyCount = user?.dollys?.length || 0;
  const [playRewardSound] = useSound('/sounds/reward.wav');

  const handleClaimAchievement = async () => {
    playRewardSound();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 8000);
    if (user?.wallet) {
      const profileData = {
        action: "claimAchievement",
        wallet: user.wallet,
        cupcakePointsToAdd: 10, // Adding 10 Cupcake Points for the example
        achievementId: "Dolly Collector",
      };
      
      try {
        const response = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        });
        const data = await response.json();
        
        if (data.success) {
          console.log('Achievement claimed and points updated successfully');

          // Fetch and update the user's profile with the latest details
          const updatedProfile = await fetchUserProfile(user.wallet);
        if (updatedProfile && updatedProfile.success) {
          // Assuming updatedProfile.data conforms to 'User' definition
          updateUserAtom(() => updatedProfile.data);
          }
        } else {
          console.error(data.message || "Failed to claim achievement");
        }
      } catch (error) {
        console.error("Error claiming achievement:", error);
      }
    } else {
      console.error("Missing user wallet.");
    }
  };

  return (
    <div>
      <div className="pb-4 max-w-5xl mx-auto my-8 ">
            <h1 className="luckiest m-auto">Cupcake Points: {user?.cupcake_points}</h1>
            <ProgressBar level={user?.level} cupcakePoints={user?.cupcake_points} />
          </div>
      <Card
        headerTitle="Achievements"
        leftBlockContent={<div className='bg-[#6510F2] rounded-xl luckiest text-white text-4xl p-8'>10</div>}
        middleBlockContent={<h1 className='luckiest text-4xl'>BEEP BOOP</h1>}
        rightBlockContent={<div>{showConfetti && <Confetti />}
        <AchievementButton
          isAchieved={dollyCount >= 3}
          onClick={handleClaimAchievement}
        /></div>}
        footer={""}
      />
      <div className="text-center">
      
      </div>
    </div>
  );
};

export default AchievementsView;