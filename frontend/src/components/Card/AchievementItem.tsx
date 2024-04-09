// AchievementItem.tsx
import React, { useEffect, useRef } from "react";
import { Achievement } from "../../data/global";
import { Levels } from "../../data/global";
import CupcakePoints from "../Card/CupcakePoints";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAtom } from 'jotai';
import { userAtom, linksClickedAtom } from "../../data/store"; // Adjust this path as necessary
import { trackLinkClick } from '../../utils/tracking'; // Ensure the path is correct
import { Grid, Lazy, Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import Swiper core and required modules
import SwiperCore from "swiper";
import FreeClaim from "../Mint/FreeClaim";
// Install Swiper modules
SwiperCore.use([Navigation]);

interface AchievementItemProps {
  achievement: Achievement;
  onClaim: (achievementId: string, freeClaimTokenId?: number) => void;
  isClaimed: boolean;
  isClicked?: boolean;
  isEligible: boolean;
  userAddress: string;
  freeClaimTokenId?: number; // Add this line
  callToAction?: string;
}

const AchievementItem: React.FC<AchievementItemProps> = ({
  achievement,
  onClaim,
  isClaimed,
  isEligible,
  userAddress,
  callToAction,
}) => {
  const [user, setUser] = useAtom(userAtom);
  const [linksClicked, setLinksClicked] = useAtom(linksClickedAtom);
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

  let ctaLabel = "READ MORE";
  let ctaStyle =
    "bg-[#0052ff] text-white w-full font-title shadow-md rounded-full px-8 py-2 text-2xl hover:shadow-lg transition-all";

  const column2Classes = `flex flex-col justify-between font-luckiest ${
    achievement.title ? "space-y-4" : "space-y-0"
  }`;
  const column3Classes = `flex flex-col justify-between`;

  const rewards = [
    achievement.achievementsReward1,
    achievement.achievementsReward2,
    achievement.achievementsReward3,
    achievement.achievementsReward4,
    achievement.achievementsReward5,
    achievement.achievementsReward6,
  ].filter(Boolean);

  const handleCallToActionClick = async () => {
    console.log("Click handler called for:", achievement.challenge); // Diagnostic log
    if (user && achievement.challenge) {
      console.log(`Attempting to track click for: ${achievement.challenge}`, achievement.callToAction);
      const response = await trackLinkClick(achievement.challenge, user, achievement.callToAction);
      console.log(`Tracking response for ${achievement.challenge}:`, response); // More detailed logging
    } else {
      console.error("Missing data for tracking click:", {user, callToAction, challenge: achievement.challenge});
    }
  };

  
  

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
    <div className="bg-[#EDEDED] flex flex-col md:flex-row justify-between items-stretch p-8 m-8 rounded-xl">
      {/* COLUMN 1 */}
      <div
        className={`${isClaimed ? "opacity-20" : ""}`}
        style={{ flexBasis: "30%", flexGrow: 0 }}
      >
        <CupcakePoints
          points={achievement.cupcakePoints}
          text="CUPCAKE POINTS"
          className={`${isClaimed ? "opacity-20" : ""}lg:ml-8 md:self-center`}
        />
      </div>

      {/* COLUMN 2 */}
      <div className={column2Classes} style={{ flexBasis: "40%", flexGrow: 0 }}>
        <h1
          className={`${
            isClaimed ? "opacity-40" : ""
          } text-2xl md:text-[32px] text-left uppercase`}
        >
          {achievement.challenge}
        </h1>
        <p
          className={`${
            isClaimed ? "opacity-60" : ""
          } font-poppins text-base md:text-lg my-2`}
        >
          {achievement.description}
          {renderDescription(achievement.descriptionBullets)}
        </p>
        {achievement.callToAction && (
          <a href={achievement.callToAction} target="_blank" rel="noreferrer">
            <button
            className={ctaStyle}
            onClick={handleCallToActionClick}
          >
            {ctaLabel}
          </button>
          </a>
        )}

        {isEligible && !isClaimed && achievement.freeClaimTokenId ? (
          <FreeClaim
            tokenId={achievement.freeClaimTokenId.toString()}
            onMintSuccess={() => {
              console.log("NFT claimed successfully!");
              // Here, you'd also call onClaim to update the user's points, marking the achievement as claimed
              onClaim(achievement.id, achievement.freeClaimTokenId);
            }}
            updateTraits={(userAddress) =>
              console.log(`Traits updated for ${userAddress}`)
            }
            userAddress={userAddress}
            className="bg-hunnys-yellow !text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-2 text-2xl mt-4 hover:shadow-lg !hover:bg-hunnys-yellow transition-all"
            buttonText={buttonLabel}
          />
        ) : (
          <button
            className={`transition-all duration-500 ease-in-out transform ${buttonStyle} font-bold py-2 px-4 rounded-full`}
            onClick={() =>
              onClaim(achievement.id, achievement.freeClaimTokenId)
            }
            disabled={!isEligible || isClaimed}
          >
            {buttonLabel}
          </button>
        )}
      </div>

      {/* COLUMN 3*/}
      <div
        className="flex flex-col justify-between h-[104%] xs:items-center md:items-end"
        style={{ flexBasis: "30%", flexGrow: 0 }}
      >
        {achievement.title && (
          <div
            className={`${
              isClaimed ? "opacity-60" : ""
            } achievementsBanner bannerText md:mr-[-12px] top-[4px]`}
          >
            <span className="hidden">TITLE: </span>
            {achievement.title}
          </div>
        )}
        <div className={column3Classes}>
          {rewards.length > 1 ? (
            <Swiper
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1} // Default to 3 slides per view for smaller screens
            grid={{
              rows: 1,
              fill: "row",
            }}
            modules={[Pagination, Grid]}
            className="mySwiper w-full max-w-[210px] h-full"
          >
              {rewards.map((reward, index) => (
                <SwiperSlide key={index}>
                  <img
                    className={`${
                      isClaimed ? "opacity-20" : ""
                    } max-w-[210px] rounded-[30px]`}
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
                className={`${
                  isClaimed ? "opacity-20" : ""
                } w-[210px] rounded-[30px]`}
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
