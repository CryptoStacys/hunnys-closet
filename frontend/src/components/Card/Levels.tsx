// /components/Card/Levels.tsx
import React from 'react';
import Image from 'next/image';
import { Levels } from "../../data/global";

interface LevelProps {
  levels: Levels;
};

const Level: React.FC<LevelProps> = ({ levels }) => {
  return (
    <div style={{ gridTemplateColumns: '20% 40% 40%' }} className="profile-container bg-[#EDEDED] grid grid-cols-3 gap-4  p-16 m-8 rounded-xl">
        <div className="text-whitetext-center"><img src={`/icons/Achievements/Level${levels.id}/Level${levels.id}.png`} alt={`Level ${levels.id}`} />
</div>
        <div className="flex flex-col">
            <h1 className="luckiest text-4xl text-left">{levels.levelsName}</h1>
        <p className='m-auto text-lg font-poppins'>{levels.description}</p>
        </div>
        <div className='flex flex-col'>
        {levels.title && <p className='achievementsBanner self-center luckiest font-bold'>TITLE: {levels.title}</p>}<br></br>
        {levels.levelsReward1 && <img width={200} height={200} className='rounded-2xl self-center' src={`/icons/Achievements/Level${levels.id}/Reward1.png`} alt={`Level ${levels.id}`} />}<br></br>
        {levels.levelsReward2 && <img width={200} height={200} className='rounded-2xl self-center' src={`/icons/Achievements/Level${levels.id}/Reward2.png`} alt={`Level ${levels.id}`} />}<br></br>
        {levels.levelsReward3 && <img width={200} height={200} className='rounded-2xl self-center' src={`/icons/Achievements/Level${levels.id}/Reward3.png`} alt={`Level ${levels.id}`} />}<br></br>
        {levels.levelsReward4 && <img width={200} height={200} className='rounded-2xl self-center' src={`/icons/Achievements/Level${levels.id}/Reward4.png`} alt={`Level ${levels.id}`} />}<br></br>
        {levels.levelsReward5 && <img width={200} height={200} className='rounded-2xl self-center' src={`/icons/Achievements/Level${levels.id}/Reward5.png`} alt={`Level ${levels.id}`} />}<br></br>
        {levels.levelsReward6 && <img width={200} height={200} className='rounded-2xl self-center' src={`/icons/Achievements/Level${levels.id}/Reward6.png`} alt={`Level ${levels.id}`} />}
        </div>
        </div>
  );
};

export default Level;
