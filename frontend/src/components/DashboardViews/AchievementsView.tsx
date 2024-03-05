import React, { useContext, useState } from "react";
import Card from "../Card/Card";
import ProgressBar from "../Achievements/ProgressBar";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import { Achievement } from "../../data/global";
import AchievementsList from "../Achievements/AchievementsList";
import Confetti from "react-confetti";
import useSound from "use-sound";
import LevelsList from "../Achievements/LevelsList";

const AchievementsView = () => {
  const [user] = useAtom(userAtom);

  return (
    <div>
      <Card
        headerTitle="Progress"
        leftBlockContent={""}
        middleBlockContent={""}
        rightBlockContent={""}
        footer={
          <>
            <h1 className="luckiest w-[84%] self-center text-2xl justify-center relative bottom-4">
              Cupcake Points: {user?.cupcake_points}
            </h1>
            <ProgressBar
              level={user?.level}
              cupcakePoints={user?.cupcake_points}
            />
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
