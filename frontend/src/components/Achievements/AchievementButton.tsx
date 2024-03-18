// AchievementButton.tsx
import React, { useState } from 'react';
import Help from '../Help/Help'; // Adjust the import path as necessary

interface AchievementButtonProps {
  isAchieved: boolean;
  onClick: () => void;
}

const AchievementButton: React.FC<AchievementButtonProps> = ({ isAchieved, onClick }) => {


  const buttonStyle = `transition-all duration-500 ease-in-out transform hover:scale-110 ${
    isAchieved ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
  } text-white font-bold py-2 px-4 rounded-full`;

  return (
    <>
      <div className='flex flex-row mb-4 justify-center'>
        <h1 className='luckiest text-2xl text-black text-center justify-center'>
            Sparkle Sparkle
        </h1>
      <Help {...{
        title: "Noobie Boobie",
        body: "Once you have 3 or more Dollys in your account, come back here to redeem your rewards!",
        className: " ml-2 w-auto h-1/4",
      }} />
      </div>
      <button className={buttonStyle} onClick={onClick}>
        {isAchieved ? 'Achievement Unlocked 🌟' : 'OMG PLZ CLICK ME 🚀'}
      </button>
    </>
  );
};

export default AchievementButton;
