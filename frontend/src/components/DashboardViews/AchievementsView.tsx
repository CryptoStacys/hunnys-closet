import React, { useContext, useState } from "react";
import Card from "../Card/Card";
import ProgressBar from "../Achievements/ProgressBar";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import AchievementsList from "../Achievements/AchievementsList";
import LevelsList from "../Achievements/LevelsList";
import { calculateLevel, calculatePointsToNextLevel } from '../../utils/levelUtils';

const AchievementsView = () => {
  const [user] = useAtom(userAtom);
  const currentLevel = calculateLevel(user?.cupcake_points || 0);
  const { nextLevelPoints, earnedPointsThisLevel, currentLevelPoints } = calculatePointsToNextLevel(currentLevel, user?.cupcake_points || 0);

  return (
    <div>
      <Card
        headerTitle="Progress"
        leftBlockContent={""}
        middleBlockContent={""}
        rightBlockContent={""}
        footer={
          <>
            
            <ProgressBar
              level={currentLevel} // Use the calculated currentLevel
              cupcakePoints={earnedPointsThisLevel} // Adjusted to show progress within the current level
              maxPoints={nextLevelPoints - currentLevelPoints} // Show the range within the current level
            />
            <h1 className="font-poppins font-bold uppercase text-center w-[84%] self-center text-2xl justify-center relative top-2 text-[#A4A4A4]">
            Cupcake Points: {user?.cupcake_points}/{nextLevelPoints}
            </h1>
            <LevelsList />
          </>
        }
      />

<Card
    headerTitle="Achievements"
    leftBlockContent={""}
    middleBlockContent={""}
    rightBlockContent={""}
    footer={<AchievementsList />}
  />

</div>
  );
};

export default AchievementsView;
