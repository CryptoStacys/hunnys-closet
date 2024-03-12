// AchievementItem.tsx
import React, { useEffect, useRef } from 'react';
import { Achievement } from "../../data/global";
import { Levels } from "../../data/global";
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

interface AchievementItemProps {
  achievement: Achievement;
  onClaim: (achievementId: string) => void;
  isClaimed: boolean;
  isEligible: boolean; // New prop to indicate eligibility
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, onClaim, isClaimed, isEligible }) => {
    let buttonLabel = "CLAIM";
    let buttonStyle = "bg-hunnys-yellow text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-1 text-2xl hover:shadow-lg transition-all"; // Eligible and not claimed
  
    if (isClaimed) {
      buttonLabel = "COMPLETED";
      buttonStyle = "bg-[#2BC97E] text-black luckiest text-2xl opacity-40"; // Claimed
    } else if (!isEligible) {
      buttonLabel = "COMPLETE TO UNLOCK";
      buttonStyle = "bg-[#DBDBDB] hover:scale-100 text-[#AFAEAE] luckiest text-2xl"; // Not eligible
    }

    const rewards = [
      achievement.achievementsReward1,
      achievement.achievementsReward2,
      achievement.achievementsReward3,
      achievement.achievementsReward4,
      achievement.achievementsReward5,
      achievement.achievementsReward6
    ].filter(Boolean);
    const leftBoxRef = useRef<HTMLDivElement>(null);
    const rightContentRef = useRef<HTMLDivElement>(null);
    // If bannerRef is being used and is a div, for example:
    const bannerRef = useRef<HTMLDivElement>(null);
// Use this only if the banner is a separate entity and its height needs to be accounted for.
    useEffect(() => {
      const adjustLeftBoxHeight = () => {
        if (!leftBoxRef.current || !rightContentRef.current) return;
    
        // Start with the height of the right content
        let rightHeight = rightContentRef.current.offsetHeight;
    
        // If there's a banner and it's separate, add its height (including any margins it might have)
        if (bannerRef.current) {
          const style = getComputedStyle(bannerRef.current);
          const marginTop = parseFloat(style.marginTop);
          const marginBottom = parseFloat(style.marginBottom);
          rightHeight += bannerRef.current.offsetHeight + marginTop + marginBottom;
        }
    
        // Set the left box's height to match the total height calculated
        leftBoxRef.current.style.height = `${rightHeight}px`;
      };
    
      adjustLeftBoxHeight();
    
      // Optional: Re-calculate when window resizes
      window.addEventListener('resize', adjustLeftBoxHeight);
      return () => window.removeEventListener('resize', adjustLeftBoxHeight);
    }, []);
    const renderDescription = (descriptionBullets: string | any) => {
      // Check if descriptionBullets contains bullet points
      if (descriptionBullets?.includes('*')) {
        const lines = descriptionBullets.split('\n').map((line: string, index: React.Key | null | undefined) => {
          // For lines starting with '*', render as list items; otherwise, render as paragraphs
          return line.trim().startsWith('*') ? 
            <li className='list-disc ml-6' key={index}>{line.trim().substring(1).trim()}</li> : 
            <p key={index}>{line.trim()}</p>;
        });
    
        return (
          <div>
            {lines.filter((line: { props: { children: any; }; }) => line.props.children).map((line: { type: string; }, index: React.Key | null | undefined) => {
              // Render list items within ul tag, and p tags as is
              return line.type === 'li' ? 
                (index === 1 ? <ul key={index}>{lines}</ul> : null) : // only insert ul once
                line;
            })}
          </div>
        );
      } else {
        // If no bullet points, render the text as a paragraph
        return <p>{descriptionBullets}</p>;
      }
    };
    
    return (
      <div className="profile-container bg-[#EDEDED] flex flex-wrap md:flex-nowrap justify-between p-4 md:p-8 m-8 rounded-xl" style={{ gap: '1rem' }}>
        {/* COLUMN 1 */}
        <div ref={leftBoxRef} className={`${isClaimed ? 'opacity-20' : ''} bg-[#6510F2] max-h-[200px] rounded-[30px] text-white xs:text-2xl lg:text-[64px] flex flex-col justify-center text-center luckiest`} style={{ flexBasis: '30%', flexGrow: 0,  maxWidth: '200px' }}>
          {achievement.cupcakePoints}<br/><br/><span className='xs:text-lg lg:text-2xl'>CUPCAKE POINTS</span>
        </div>
    
        {/* COLUMN 2 */}
        <div className="flex flex-col justify-between mx-8 my-4" style={{ flexBasis: '40%', flexGrow: 1 }}>
            <h1 className={`${isClaimed ? 'opacity-40' : ''} text-4xl luckiest text-left`}>{achievement.challenge}</h1>
            <p className={`${isClaimed ? 'opacity-60' : ''} font-poppins`}>{achievement.description}<br/>{renderDescription(achievement.descriptionBullets)}</p>
            <button
                className={`transition-all duration-500 ease-in-out transform ${buttonStyle} font-bold py-2 px-4 rounded-full`}
                onClick={() => onClaim(achievement.id)}
                disabled={!isEligible || isClaimed}
            >
                {buttonLabel}
            </button>
        </div>
    
        {/* Adjusted COLUMN 3 for Swiper */}
        <div ref={rightContentRef} className="flex flex-col justify-center items-center" style={{ flexBasis: '30%', flexGrow: 0, width: '100%' }}>
            {achievement.title && <p className={`${isClaimed ? 'opacity-60' : ''} achievementsBanner luckiest font-bold z-50`}>TITLE: {achievement.title}</p>}
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
                        <img className={`${isClaimed ? 'opacity-20' : ''} max-w-full max-h-[200px] rounded-[30px]`} src={reward} alt={`Reward ${index + 1}`} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
              ) : rewards.map((reward, index) => (
                  <img key={index} className={`${isClaimed ? 'opacity-20' : ''} max-w-full max-h-[200px] rounded-[30px]`} src={reward} alt={`Reward ${index + 1}`} />
              ))}
              
            </div>
        </div>
      </div>
    );
};


export default AchievementItem;
