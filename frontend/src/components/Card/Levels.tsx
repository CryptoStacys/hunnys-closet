// /components/Card/Levels.tsx
import React from 'react';
import Image from 'next/image';
import { Levels, Achievement } from "../../data/global";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Lazy, Navigation, Pagination, Mousewheel } from 'swiper/modules';
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

const descriptions = [
  levels?.description,
  levels?.description2,
  levels?.description3,
  levels?.description4,
  levels?.description5
].filter(Boolean);

return (
  <div className="profile-container bg-[#EDEDED] flex flex-wrap md:flex-nowrap justify-between p-4 md:p-8 m-8 rounded-xl" style={{ gap: '1rem' }}>
    {/* COLUMN 1 */}
    <div className="text-white xs:text-2xl flex flex-col justify-start text-center luckiest" style={{ flexBasis: '15%', flexGrow: 0 }}>
    <div className="text-white text-center self-center">
      <img width={100} height={80} src={`/icons/Achievements/Level${levels.id}/Level${levels.id}.png`} alt={`Level ${levels.id}`} />
</div>
    </div>

    {/* COLUMN 2 */}
    <div className="flex flex-col justify-between mx-8 my-4" style={{ flexBasis: '50%', flexGrow: 1 }}>
        <h1 className="text-4xl luckiest text-left lg:text-[40px]">{levels.levelsName}</h1>
        <div className="description-container" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '12px' }}>
          {descriptions.map((desc, index) => (
            <p key={index} className='font-poppins justify-start mt-4 mb-4'>{desc}</p>
          ))}
        </div>
      </div>

    {/* Adjusted COLUMN 3 for Swiper */}
    <div className="flex flex-col justify-center items-center" style={{ flexBasis: '35%', flexGrow: 0, width: '100%' }}>
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
          <h1 className='luckiest text-[#AA7AFA] text-center mt-4 text-2xl'>NEXT REWARD</h1>
        </div>
    </div>
  </div>
);
};

export default Level;
