// /components/Card/Levels.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Levels, Achievement } from "../../data/global";
import FreeClaim from '../Mint/FreeClaim';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Lazy, Navigation, Pagination, Mousewheel } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import Swiper core and required modules
import SwiperCore from 'swiper';
import { useAtom } from 'jotai';
import { userAtom } from '../../data/store';
// Install Swiper modules
SwiperCore.use([Navigation]);

interface LevelProps {
  levels: Levels;
};

interface FreeClaimType {
  claimed: boolean;
  token_id: string;
  date_claimed: string;
  transaction_hash: string;
}
const Level: React.FC<LevelProps> = ({ levels }) => {
const [isClaimed, setIsClaimed] = useState(false);
const [user] = useAtom(userAtom);
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
useEffect(() => {
  const currentTokenId = levels.freeClaimTokenId?.toString();
  const freeClaimsArray = Array.isArray(user?.free_claim) ? user?.free_claim : [];
  const claimedStatus = freeClaimsArray?.some(free_claim => free_claim.token_id === currentTokenId && free_claim.claimed);


  setIsClaimed(claimedStatus === true);
}, [user, levels.freeClaimTokenId]);

const renderClaimButtonOrNextReward = () => {
  const currentLevelNumber = parseInt(user?.level || '0', 10);
  const freeClaimLevelNumber = parseInt(levels.id, 10);
  // Check if user's current level is above the level number required for the free claim
  const isEligibleToClaim = currentLevelNumber > freeClaimLevelNumber;

  if (levels.freeClaimTokenId !== undefined) {
    if (!isClaimed && isEligibleToClaim) {
      return (
        <FreeClaim
          tokenId={levels.freeClaimTokenId.toString()} // Assuming TokenID is a number and FreeClaim expects a string
          onMintSuccess={() => {
            console.log("NFT claimed successfully!");
            setIsClaimed(true); // Set the state to reflect the claim
          }}
        updateTraits={(userAddress) => console.log(`Traits updated for ${userAddress}`)}
        userAddress={user?.address}
        className='bg-hunnys-yellow !text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-2 text-2xl mt-4 hover:shadow-lg !hover:bg-hunnys-yellow transition-all'
        buttonText="Claim"
        />
        );
      } else if (isClaimed) {
        return <h1 className='luckiest text-[#AA7AFA] text-center mt-4 text-2xl'>COMPLETED</h1>;
      } else {
        return <h1 className='luckiest text-[#AA7AFA] text-center mt-4 text-2xl'>NEXT REWARD</h1>;
      }
    } else {
      return <h1 className='luckiest text-[#AA7AFA] text-center mt-4 text-2xl'>NEXT REWARD</h1>;
    }
};
return (
  <div className="bg-[#EDEDED] flex flex-col md:flex-row justify-between items-stretch p-4 m-8 rounded-xl gap-4">
    {/* COLUMN 1 */}
    <div className="flex flex-col justify-start items-center text-2xl luckiest p-4"
    style={{ flexBasis: "20%", flexGrow: 0 }}>
      <img className="md:max-w-36 xs:max-w-[100px]" src={`/icons/Achievements/Level${levels.id}/Level${levels.id}.png`} alt={`Level ${levels.id}`} />
    </div>

    {/* COLUMN 2 */}
    <div className="flex flex-col justify-start mx-4 my-4 flex-grow"
    style={{ flexBasis: "50%", flexGrow: 0 }}>
      <h1 className="text-2xl md:text-4xl lg:text-5xl luckiest text-left">{levels.levelsName}</h1>
      <div className="description-container mt-4 overflow-y-auto pr-4" style={{ maxHeight: '200px' }}>
        {descriptions.map((desc, index) => (
          <p key={index} className='text-sm md:text-base lg:text-lg font-poppins mt-2'>{desc}</p>
        ))}
      </div>
    </div>

    {/* COLUMN 3 */}
    <div className="flex flex-col justify-center items-center p-4"
    style={{ flexBasis: "30%", flexGrow: 0 }}>
      {levels.title && <p className='achievementsBanner luckiest font-bold'>TITLE: {levels.title}</p>}
      <div className="w-full max-w-xs mt-4">
      <Swiper
          pagination={{ clickable: true }}
          spaceBetween={30}
          modules={[Pagination]}
          className='mySwiper'
        >
          {rewards.map((reward, index) => (
            <SwiperSlide key={index}>
              <img className="max-w-[200px] m-auto rounded-[30px]" src={`/icons/Achievements/Level${levels.id}/Reward${index + 1}.png`} alt={`Level ${levels.id} Reward ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
        {renderClaimButtonOrNextReward()}
      </div>
    </div>
  </div>
);
};

export default Level;
