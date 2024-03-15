// AchievementItem.tsx
import React, { useEffect, useRef } from "react";
import { Achievement } from "../../data/global";
import { Levels } from "../../data/global";
import CupcakePoints from "../Card/CupcakePoints"
import { Swiper, SwiperSlide } from "swiper/react";
import { Lazy, Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import Swiper core and required modules
import SwiperCore from "swiper";
// Install Swiper modules
SwiperCore.use([Navigation]);

interface AchievementItemProps {
  achievement: Achievement;
  onClaim: (achievementId: string) => void;
  isClaimed: boolean;
  isEligible: boolean; // New prop to indicate eligibility
}

const AchievementItem: React.FC<AchievementItemProps> = ({
  achievement,
  onClaim,
  isClaimed,
  isEligible,
}) => {
  let buttonLabel = "CLAIM";
  let buttonStyle =
    "bg-hunnys-yellow text-hunnys-blue w-full font-title shadow-md rounded-full px-8 text-2xl hover:shadow-lg transition-all"; // Eligible and not claimed

  if (isClaimed) {
    buttonLabel = "COMPLETED";
    buttonStyle = "bg-[#2BC97E] text-black luckiest text-2xl opacity-40"; // Claimed
  } else if (!isEligible) {
    buttonLabel = "COMPLETE TO UNLOCK";
    buttonStyle =
      "bg-[#DBDBDB] hover:scale-100 text-[#AFAEAE] luckiest text-2xl"; // Not eligible
  }

  const rewards = [
    achievement.achievementsReward1,
    achievement.achievementsReward2,
    achievement.achievementsReward3,
    achievement.achievementsReward4,
    achievement.achievementsReward5,
    achievement.achievementsReward6,
  ].filter(Boolean);

  const renderDescription = (descriptionBullets: string | any) => {
    // Check if descriptionBullets contains bullet points
    if (descriptionBullets?.includes("*")) {
      const lines = descriptionBullets
        .split("\n")
        .map((line: string, index: React.Key | null | undefined) => {
          // For lines starting with '*', render as list items; otherwise, render as paragraphs
          return line.trim().startsWith("*") ? (
            <li className="list-disc ml-6" key={index}>
              {line.trim().substring(1).trim()}
            </li>
          ) : (
            <p key={index}>{line.trim()}</p>
          );
        });

      return (
        <div>
          {lines
            .filter((line: { props: { children: any } }) => line.props.children)
            .map(
              (line: { type: string }, index: React.Key | null | undefined) => {
                // Render list items within ul tag, and p tags as is
                return line.type === "li" ? (
                  index === 1 ? (
                    <ul key={index}>{lines}</ul>
                  ) : null // only insert ul once
                ) : (
                  line
                );
              }
            )}
        </div>
      );
    } else {
      // If no bullet points, render the text as a paragraph
      return <p>{descriptionBullets}</p>;
    }
  };

  return (
    <div className="bg-[#EDEDED] flex flex-col md:flex-row justify-between xs:items-stretch md:items-center p-4 m-8 rounded-xl gap-4">
      {/* COLUMN 1 */}
      <div
        
        className={`${isClaimed ? "opacity-20" : ""}`}
        style={{ flexBasis: "30%", flexGrow: 0 }}
        >
          <CupcakePoints
          points={achievement.cupcakePoints}
          text="CUPCAKE POINTS"
          />
      </div>

      {/* COLUMN 2 */}
      <div className="flex flex-col justify-between w-full lg:w-auto py-4 lg:py-0 font-luckiest"
      style={{ flexBasis: "40%", flexGrow: 0 }}>
        <h1 className={`${isClaimed ? "opacity-40" : ""} text-2xl lg:text-[32px] text-left`}>
          {achievement.challenge}
        </h1>
        <p className={`${isClaimed ? "opacity-60" : ""} font-poppins text-base lg:text-lg my-2`}>
          {achievement.description}
          {renderDescription(achievement.descriptionBullets)}
        </p>
        <button
          className={`transition-all duration-500 ease-in-out transform ${buttonStyle} font-bold py-2 px-4 rounded-full`}
          onClick={() => onClaim(achievement.id)}
          disabled={!isEligible || isClaimed}
        >
          {buttonLabel}
        </button>
      </div>

      {/* COLUMN 3 */}
      <div  className="flex flex-col justify-center items-center w-full lg:w-auto mt-4 lg:mt-0"
      style={{ flexBasis: "30%", flexGrow: 0 }}>
        {achievement.title && (
          <div className={`${isClaimed ? "opacity-60" : ""} achievementsBanner font-bold mb-4`}>
            <span className="hidden">TITLE: </span>{achievement.title}
          </div>
        )}
        <div className="w-[200px]">
          {rewards.length > 1 ? (
            <Swiper
              pagination={{ clickable: true }}
              spaceBetween={30}
              modules={[Pagination]}
              className="mySwiper"
            >
              {rewards.map((reward, index) => (
                <SwiperSlide key={index}>
                  <img
                    className={`${isClaimed ? "opacity-20" : ""} w-full rounded-[30px]`}
                    src={reward}
                    alt={`Reward ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            rewards.map((reward, index) => (
              <img
                key={index}
                className={`${isClaimed ? "opacity-20" : ""} w-full rounded-[30px]`}
                src={reward}
                alt={`Reward ${index + 1}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );

};

export default AchievementItem;
