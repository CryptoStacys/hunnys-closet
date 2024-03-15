// AchievementsList.tsx

import React from 'react';
import { Achievement, User, FreeClaimType } from "../../data/global";
import AchievementItem from '../Card/AchievementItem';
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import Confetti from "react-confetti";
import useSound from "use-sound";
import { calculateLevel } from '../../utils/levelUtils';

  const AchievementsList = () => {
    const [user, setUser] = useAtom(userAtom);
    const [showConfetti, setShowConfetti] = React.useState(false);
    const [playRewardSound] = useSound("/sounds/reward2.mp3");
    const freeClaimsArray = Array.isArray(user?.free_claim) ? user?.free_claim : [];
    const achievementsData: Achievement[] = [
    {
        id: '1',
        challenge: 'Welcome to Hunnys Closet!',
        description: 'Set your Name & Profile Image',
        cupcakePoints: 10,
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => !!user.profile_name && !!user.profile_image_url,
        },
    {
        id: '2',
        challenge: 'BDay Bun',
        description: 'Add your birthday to your Profile',
        cupcakePoints: 10,
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => !!user.birthday_day && !!user.birthday_month,
        },
    {
        id: '3',
        challenge: 'Treasure Hunter',
        description: 'Claim free GM Mug Collectible from the Profile page',
        cupcakePoints: 10,
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        title: 'GM Fan',
        eligibilityCriteria: (user: User) => {
          // Ensure freeClaimsArray is defined to avoid accidental undefined.
          // If it's undefined or empty, straightforwardly return false.
          if (!freeClaimsArray || freeClaimsArray.length === 0) return false;
        
          // Proceed with your original logic safely, now assured it'll return a boolean.
          return freeClaimsArray.some((freeClaim: FreeClaimType) => freeClaim.token_id === "0" && freeClaim.claimed);
        }
        },
    {
        id: '4',
        challenge: 'Welcome, Bunny',
        description: 'Own at least 1 Hunnys 10k Collectible',
        cupcakePoints: 10,
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        title: 'Bunny',
        eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 1,
        },
     {
         id: '5',
         challenge: 'Welcome, Bunny Knight',
         description: 'Own at least 3 Hunnys 10k Collectibles',
         cupcakePoints: 25,
         achievementsReward1: '/icons/Achievements/CupcakePoints.png',
         title: 'Bunny Knight',
         eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 3,
         },
    {
        id: '6',
        challenge: 'Welcome, Bunny Duke',
        description: 'Own at least 7 Hunnys 10k Collectibles',
        cupcakePoints: 25,
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        title: 'Bunny Duke',
        eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 7,
        },
    {
        id: '7',
        challenge: 'Welcome, Royal Bunny',
        description: 'Own at least 12 Hunnys 10k Collectibles',
        cupcakePoints: 25,
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        title: 'Royal Bunny',
        eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 12,
        },
    {
        id: '8',
        challenge: 'Hunnys Lover',
        description: 'Own at least 30 Hunnys 10k Collectibles',
        cupcakePoints: 50,
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        title: 'Hunnys Lover',
        eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 30,
        },
    {
        id: '9',
        challenge: 'Hunnys Hoarder',
        description: 'Own at least 50 Hunnys 10k Collectibles',
        cupcakePoints: 50,
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        title: 'Hunnys Hoarder',
        eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 50,
        },
    {
        id: '10',
        challenge: 'Intergalactic Bunny',
        description: 'Own at least 100 Hunnys 10k Collectibles',
        cupcakePoints: 100,
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        title: 'Intergalactic Bunny',
        eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 100,
        },
    // {
    //     id: '11',
    //     challenge: 'Dolly Historian',
    //     description: 'Own at least 1 Hunnys OG Collectible',
    //     cupcakePoints: 50,
    //     achievementsReward1: '/icons/Achievements/CupcakePoints.png',
    //     title: 'OG Hunny',
    //     eligibilityCriteria: (user: User) => user.tokens.some(token => token.origin_name === "Hunnys OGs"),
    // },
    {
        id: '12',
        challenge: 'Super Stacys',
        description: 'Own at least 1 Stacys Collectible',
        cupcakePoints: 50,
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        title: 'OG Cupcake',
        eligibilityCriteria: (user: User) => user.tokens.some(token => token.origin_name === "Hunnys Stacys"),
        },
    {
        id: '13', // Assuming IDs are sequential and unique
        challenge: 'Reach Level 1',
        description: 'Collect enough Cupcake Points to reach Level 1',
        cupcakePoints: 10, 
        title: 'Fresh Cupcake', 
        achievementsReward1: '/icons/Achievements/Level0/Reward1.png',
        eligibilityCriteria: (user: User) => user.level >= 1, // Eligible if user has reached at least Level 1
        },
    {
        id: '14', // Assuming IDs are sequential and unique
        challenge: 'Reach Level 2',
        description: 'Collect enough Cupcake Points to reach Level 2',
        cupcakePoints: 10, 
        title: 'Bunny Queens Helper', 
        achievementsReward1: '/icons/Achievements/Level1/Reward1.png',
        eligibilityCriteria: (user: User) => user.level >= 2, // Eligible if user has reached at least Level 1
        },
        
    {
        id: '15', // Assuming IDs are sequential and unique
        challenge: 'Reach Level 3',
        description: 'Collect enough Cupcake Points to reach Level 3',
        cupcakePoints: 10, 
        title: 'Bunny Bargainer', 
        achievementsReward1: '/icons/Achievements/Level2/Reward1.png',
        eligibilityCriteria: (user: User) => user.level >= 3, // Eligible if user has reached at least Level 1
        },
    {
        id: '16', // Assuming IDs are sequential and unique
        challenge: 'Reach Level 4',
        description: 'Collect enough Cupcake Points to reach Level 4',
        cupcakePoints: 10, 
        title: 'Squirrel Whisperer', 
        achievementsReward1: '/icons/Achievements/Level3/Reward1.png',
        eligibilityCriteria: (user: User) => user.level >= 4, // Eligible if user has reached at least Level 1
        },
    {
        id: '17', // Assuming IDs are sequential and unique
        challenge: 'Reach Level 5',
        description: 'Collect enough Cupcake Points to reach Level 5',
        cupcakePoints: 10, 
        title: 'Moar Collector', 
        achievementsReward1: '/icons/Achievements/Level4/Reward1.png',
        eligibilityCriteria: (user: User) => user.level >= 5, // Eligible if user has reached at least Level 1
        },
    {
        id: '18', // Assuming IDs are sequential and unique
        challenge: 'Reach Level 6',
        description: 'Collect enough Cupcake Points to reach Level 6',
        cupcakePoints: 10, 
        title: 'So Hupe!', 
        achievementsReward1: '/icons/Achievements/Level5/Reward1.png',
        achievementsReward2: '/icons/Achievements/Level5/Reward2.png',
        achievementsReward3: '/icons/Achievements/Level5/Reward3.png',
        eligibilityCriteria: (user: User) => user.level >= 6, // Eligible if user has reached at least Level 1
        },
    {
        id: '19', // Assuming IDs are sequential and unique
        challenge: 'Reach Level 7',
        description: 'Collect enough Cupcake Points to reach Level 7',
        cupcakePoints: 10, 
        title: 'Delicious Dreamer', 
        achievementsReward1: '/icons/Achievements/Level6/Reward1.png',
        achievementsReward2: '/icons/Achievements/Level6/Reward2.png',
        eligibilityCriteria: (user: User) => user.level >= 7, // Eligible if user has reached at least Level 1
        },
    {
        id: '20', // Assuming IDs are sequential and unique
        challenge: 'Reach Level 8',
        description: 'Collect enough Cupcake Points to reach Level 8',
        cupcakePoints: 10, 
        title: 'Tater Tot', 
        achievementsReward1: '/icons/Achievements/Level7/Reward1.png',
        achievementsReward2: '/icons/Achievements/Level7/Reward2.png',
        eligibilityCriteria: (user: User) => user.level >= 8, // Eligible if user has reached at least Level 1
        },
    {
        id: '21', // Assuming IDs are sequential and unique
        challenge: 'Reach Level 9',
        description: 'Collect enough Cupcake Points to reach Level 9',
        cupcakePoints: 10, 
        title: 'Forest Friend', 
        achievementsReward1: '/icons/Achievements/Level8/Reward1.png',
        eligibilityCriteria: (user: User) => user.level >= 9, // Eligible if user has reached at least Level 1
        },
    {
        id: '22', // Assuming IDs are sequential and unique
        challenge: 'Reach Level 10',
        description: 'Collect enough Cupcake Points to reach Level 10',
        cupcakePoints: 10, 
        title: 'Dreamer', 
        achievementsReward1: '/icons/Achievements/Level9/Reward1.png',
        achievementsReward2: '/icons/Achievements/Level9/Reward2.png',
        eligibilityCriteria: (user: User) => user.level >= 10, // Eligible if user has reached at least Level 1
        },
        
    {
        id: '23', // Assuming IDs are sequential and unique
        challenge: 'Reach Level 11',
        description: 'Collect enough Cupcake Points to reach Level 11',
        cupcakePoints: 50, 
        title: 'Horny', 
        achievementsReward1: '/icons/Achievements/Level10/Reward1.png',
        achievementsReward2: '/icons/Achievements/Level10/Reward2.png',
        eligibilityCriteria: (user: User) => user.level >= 11, // Eligible if user has reached at least Level 1
        },
      
    // Add more achievements here
  ];
    const handleAchievementClaim = async (achievementId: string) => {
      // Find the achievement based on the ID
      const achievement = achievementsData.find(a => a.id === achievementId);
    if (!achievement) {
        console.error("Achievement not found");
        return;
    }
    const newCupcakePoints = Number(user?.cupcake_points) + achievement.cupcakePoints;
    const newLevel = calculateLevel(newCupcakePoints);
    // Check if the achievement is already claimed
    if (user?.achievements && user?.achievements[achievement.challenge]?.claimed) {
        console.log("Achievement already claimed");
        return; // Stop the function if the achievement is already claimed
    }
      playRewardSound();
      const levelUpOccurred = newLevel > (user?.level ?? 0);
      if(levelUpOccurred) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000); // Adjust timing as needed
      }
  
      if (user?.wallet) {
        const profileData = {
          action: "claimAchievement",
          wallet: user.wallet,
          cupcakePointsToAdd: achievement.cupcakePoints, // Use cupcakePoints from the achievement
          achievementId: achievement.challenge, // Use challenge as the achievementId
          title: achievement.title,
        };
  
        try {
          const response = await fetch(
            `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(profileData),
            }
          );
          const data = await response.json();
  
          if (data.success) {
            console.log("Achievement claimed and points updated successfully");
            // Update the userAtom directly with the new data
            setUser((prevUser) => {
              if (!prevUser) return null; // In case prevUser is null, just return null
              const newAchievements = {
                ...prevUser.achievements,
                [achievement.challenge]: {
                  claimed: true,
                  date_claimed: new Date().toISOString(),
                  title: achievement.title,
                },
              };
  
              // Update only if there's a change in level or cupcake_points
              if (newCupcakePoints !== prevUser.cupcake_points || newLevel !== prevUser.level) {
                return {
                  ...prevUser,
                  cupcake_points: newCupcakePoints,
                  level: newLevel,
                  achievements: newAchievements,
                };
              }
              return {
                ...prevUser,
                achievements: newAchievements,
              };
            });
          } else {
            console.error(data.message || "Failed to claim achievement");
          }
        } catch (error) {
          console.error("Error claiming achievement:", error);
        }
      } else {
        console.error("Missing user wallet.");
      }
    };

    const sortedAchievements = achievementsData.sort((a, b) => {
      // Default values in case user is null
      const defaultClaimed = false;
      const defaultEligible = false;
    
      // Check if user is null and assign default values or compute based on user's achievements and eligibility
      const aClaimed = user ? user.achievements && user.achievements[a.challenge]?.claimed : defaultClaimed;
      const bClaimed = user ? user.achievements && user.achievements[b.challenge]?.claimed : defaultClaimed;
      const aEligible = user ? (a.eligibilityCriteria ? a.eligibilityCriteria(user) : defaultEligible) : defaultEligible;
      const bEligible = user ? (b.eligibilityCriteria ? b.eligibilityCriteria(user) : defaultEligible) : defaultEligible;
    
      // Sorting logic remains the same
      if (aClaimed && !bClaimed) return 1;
      if (!aClaimed && bClaimed) return -1;
      if (!aEligible && bEligible) return 1;
      if (aEligible && !bEligible) return -1;
    
      return 0; // Default to original order for equivalent statuses
    });
    
  
    return (
      <div className="achievements-list">
        {showConfetti && <Confetti />}
        {sortedAchievements.map((achievement) => (
          <AchievementItem
            key={achievement.id}
            achievement={achievement}
            onClaim={() => handleAchievementClaim(achievement.id)}
            isClaimed={user?.achievements && user?.achievements[achievement.challenge]?.claimed}
            isEligible={user ? (achievement.eligibilityCriteria ? achievement.eligibilityCriteria(user) : false) : false}
          />
        ))}
      </div>
    );
  };
  
  export default AchievementsList;