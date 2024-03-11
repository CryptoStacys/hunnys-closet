// /components/Card/Levels.tsx
import React from 'react';
import Image from 'next/image';
import { Levels, Achievement } from "../../data/global";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Lazy, Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import Swiper core and required modules
import SwiperCore from 'swiper';
// Install Swiper modules
SwiperCore.use([Navigation]);

interface LevelProps {
  levels: Levels;
};


const Level: React.FC<LevelProps> = ({ levels }) => {
 

const rewards = [
  levels?.levelsReward1,
  levels?.levelsReward2,
  levels?.levelsReward3,
  levels?.levelsReward4,
  levels?.levelsReward5,
  levels?.levelsReward6
].filter(Boolean);

return (
  <div className="profile-container bg-[#EDEDED] flex flex-wrap md:flex-nowrap justify-between p-4 md:p-8 m-8 rounded-xl" style={{ gap: '1rem' }}>
    {/* COLUMN 1 */}
    <div className="rounded-[30px] text-white xs:text-2xl lg:text-[64px] flex flex-col justify-center py-16 text-center luckiest" style={{ flexBasis: '30%', flexGrow: 0 }}>
    <div className="text-whitetext-center"><img src={`/icons/Achievements/Level${levels.id}/Level${levels.id}.png`} alt={`Level ${levels.id}`} />
</div>
    </div>

    {/* COLUMN 2 */}
    <div className="flex flex-col justify-between mx-8 my-4" style={{ flexBasis: '40%', flexGrow: 1 }}>
        <h1 className="text-4xl luckiest text-left">{levels.levelsName}</h1>
        <p className='font-poppins'>{levels.description}<br/></p>
        
    </div>

    {/* Adjusted COLUMN 3 for Swiper */}
    <div className="flex flex-col justify-center items-center" style={{ flexBasis: '30%', flexGrow: 0, width: '100%' }}>
        {levels.title && <p className='achievementsBanner luckiest font-bold z-50'>TITLE: {levels.title}</p>}
        <div style={{ width: '100%', maxWidth: '200px' }}>
          {rewards.length > 1 ? (
              <Swiper
                pagination={{ clickable: true }}
                spaceBetween={30}
                modules={[Pagination]}
                className='mySwiper'
              >
                {rewards.map((reward, index) => (
                  <SwiperSlide key={index}>
                    <img className={`max-w-full max-h-[200px] rounded-[30px]`} src={`/icons/Achievements/Level${levels.id}/Reward1.png`} alt={`Level ${levels.id}`} />
                  </SwiperSlide>
                ))}
              </Swiper>
          ) : rewards.map((reward, index) => (
              <img key={index} className={`max-w-full max-h-[200px] rounded-[30px]`} src={`/icons/Achievements/Level${levels.id}/Reward1.png`} alt={`Level ${levels.id}`} />
          ))}
        </div>
    </div>
  </div>
);
};

export default Level;
