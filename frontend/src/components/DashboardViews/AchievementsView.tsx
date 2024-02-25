import React, { useState } from 'react';
import Card from '../Card/Card';
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import AchievementButton from '../Achievements/AchievementButton';
import ProgressBar from '../Achievements/ProgressBar';
import Confetti from 'react-confetti';
import useSound from 'use-sound';

const AchievementsView = () => {
  const [user, setUser] = useAtom(userAtom);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playRewardSound] = useSound('/sounds/reward.wav');
  const dollyCount = user?.dollys?.length || 0;
  
  const handleClaimAchievement = async () => {
    playRewardSound();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 8000);
    if (user?.wallet) {
        const profileData = {
            action: "claimAchievement",
            wallet: user.wallet,
            cupcakePointsToAdd: 50, // Example value
            achievementId: "Dolly Collector",
        };

        try {
            const response = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileData),
            });
            const data = await response.json();

            if (data.success) {
                console.log('Achievement claimed and points updated successfully');
                // Update the userAtom directly with the new data
                setUser(prevUser => {
                    if (!prevUser) return null; // In case prevUser is null, just return null

                    const newCupcakePoints = Number(prevUser.cupcake_points) + Number(profileData.cupcakePointsToAdd);
                    const newLevel = Math.floor(newCupcakePoints / 100);

                    // Update only if there's a change in level or cupcake_points
                    if (newCupcakePoints !== prevUser.cupcake_points || newLevel !== prevUser.level) {
                      return {
                        ...prevUser,
                        cupcake_points: newCupcakePoints,
                        level: newLevel,
                        achievements: { ...prevUser.achievements, [profileData.achievementId]: { claimed: true, date_claimed: new Date().toISOString() } },
                    };
                  }
                  return prevUser; });
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
      <Card
        headerTitle="Progress"
        leftBlockContent={""}
        middleBlockContent={""}
        rightBlockContent={""}
        footer={<><h1 className="luckiest w-[84%] self-center text-2xl justify-center relative bottom-4">Cupcake Points: {user?.cupcake_points}</h1><ProgressBar level={user?.level} cupcakePoints={user?.cupcake_points} /></>}
      />
      
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