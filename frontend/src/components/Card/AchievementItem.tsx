// AchievementItem.tsx
import React from 'react';
import { Achievement } from "../../data/global";
import { Levels } from "../../data/global";

interface AchievementItemProps {
  achievement: Achievement;
  onClaim: (achievementId: string) => void;
  isClaimed: boolean;
  isEligible: boolean; // New prop to indicate eligibility
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, onClaim, isClaimed, isEligible }) => {
    let buttonLabel = "COLLECT";
    let buttonStyle = "bg-green-500 hover:bg-green-600"; // Eligible and not claimed
  
    if (isClaimed) {
      buttonLabel = "COMPLETED";
      buttonStyle = "bg-gray-500 hover:scale-100"; // Claimed
    } else if (!isEligible) {
      buttonLabel = "NOT ELIGIBLE";
      buttonStyle = "bg-red-500 hover:bg-red-600"; // Not eligible
    }

    return (
        <div style={{ gridTemplateColumns: '15% 70% 15%' }} className="profile-container bg-[#EDEDED] grid grid-cols-3 gap-4  p-16 m-8 rounded-xl">
        <div className="bg-[#6510F2] rounded-xl luckiest text-white text-4xl p-8 text-center col-span-1">{achievement.cupcakePoints}</div>
        <div className="flex flex-col">
            <h1 className="luckiest text-4xl text-center">{achievement.challenge}</h1>
        <p className='m-auto'>{achievement.description}</p>
        </div>
        <div className="flex flex-col">
        <button
        className={`transition-all duration-500 ease-in-out transform hover:scale-110 ${buttonStyle} text-white font-bold py-2 px-4 rounded-full`}
        onClick={() => onClaim(achievement.id)}
        disabled={!isEligible || isClaimed}
      >
        {buttonLabel}
      </button>
        </div>
        <div></div>
        <div></div>
        <div className='flex flex-col'>
        {achievement.achievementsReward1 && <><p>Reward: {achievement.achievementsReward1}</p><br></br></>}
        {achievement.achievementsReward2 && <><p>Reward: {achievement.achievementsReward2}</p><br></br></>}
        {achievement.achievementsReward3 && <><p>Reward: {achievement.achievementsReward3}</p><br></br></>}
        {achievement.achievementsReward4 && <><p>Reward: {achievement.achievementsReward4}</p><br></br></>}
        {achievement.achievementsReward5 && <><p>Reward: {achievement.achievementsReward5}</p><br></br></>}
        {achievement.achievementsReward6 && <><p>Reward: {achievement.achievementsReward6}</p><br></br></>}
        {achievement.title && <p>Title: {achievement.title}</p>}
        </div>
        </div>
    );
};


export default AchievementItem;
