// /components/Card/Levels.tsx
import React from 'react';
import Image from 'next/image';
import { Levels } from "../../data/global";

interface LevelProps {
  levels: Levels;
};

const Level: React.FC<LevelProps> = ({ levels }) => {
  return (
    <div style={{ gridTemplateColumns: '15% 70% 15%' }} className="profile-container bg-[#EDEDED] grid grid-cols-3 gap-4  p-16 m-8 rounded-xl">
        <div className="bg-[#6510F2] rounded-xl luckiest text-white text-4xl p-4 text-center col-span-1 m-auto">LEVEL<br></br>{levels.id}</div>
        <div className="flex flex-col">
            <h1 className="luckiest text-4xl text-center">{levels.levelsName}</h1>
        <p className='m-auto p-4'>{levels.description}</p>
        </div>
        <div className='flex flex-col'>
        {levels.title && <p>Title: {levels.title}</p>}<br></br>
        {levels.levelsReward1 && <p>Reward: {levels.levelsReward1}</p>}<br></br>
        {levels.levelsReward2 && <p>Reward: {levels.levelsReward2}</p>}<br></br>
        {levels.levelsReward3 && <p>Reward: {levels.levelsReward3}</p>}<br></br>
        {levels.levelsReward4 && <p>Reward: {levels.levelsReward4}</p>}<br></br>
        {levels.levelsReward5 && <p>Reward: {levels.levelsReward5}</p>}<br></br>
        {levels.levelsReward6 && <p>Reward: {levels.levelsReward6}</p>}
        </div>
        </div>
  );
};

export default Level;
