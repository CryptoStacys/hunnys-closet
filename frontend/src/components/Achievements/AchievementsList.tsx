// AchievementsList.tsx

import React from 'react';
import { Achievement, User, FreeClaimType, LinkClick } from "../../data/global";
import AchievementItem from '../Card/AchievementItem';
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import Confetti from "react-confetti";
import useSound from "use-sound";
import { calculateLevel } from '../../utils/levelUtils';
import { achievements } from '../../utils/achievements';

// Examples of Achievement eligibilityCriteria:
// Saved Dolly with specific color:
    // eligibilityCriteria: (user) => user.dollys.some(dolly => 
    //   dolly.attributes && dolly.attributes.some(attr => 
    //     attr.colorsApplied && attr.colorsApplied.includes('Crypto Defender Blue')
    //   )
    // ),
// Number of Dollys:
    // eligibilityCriteria: (user: User) => user?.dollyCount > 0,
// Has specific user data:
    // eligibilityCriteria: (user: User) => !!user.profile_name && !!user.profile_image_url,
// Has claimed a specific token:
    // eligibilityCriteria: (user: User) => {
    //   if (!freeClaimsArray || freeClaimsArray.length === 0) return false;
    //   return freeClaimsArray.some((freeClaim: FreeClaimType) => freeClaim.token_id === "0" && freeClaim.claimed);
    // }



  const AchievementsList = () => {
    const [user, setUser] = useAtom(userAtom);
    const [showConfetti, setShowConfetti] = React.useState(false);
    const [playRewardSound] = useSound("/sounds/reward2.mp3");
    const freeClaimsArray = Array.isArray(user?.free_claim) ? user?.free_claim : [];
    const linksClickedArray = Array.isArray(user?.linksClicked) ? user?.linksClicked : [];
    const achievementsArray = Array.isArray(user?.achievements) ? user?.achievements : [];
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
          if (!freeClaimsArray || freeClaimsArray.length === 0) return false;
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
         freeClaimTokenId: 84,
         achievementsReward1: '/icons/Achievements/84.png',
         achievementsReward2: '/icons/Achievements/Achievements/5/1.png',
         title: 'Bunny Knight',
         eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 3,
         },
    {
        id: '6',
        challenge: 'Welcome, Bunny Duke',
        description: 'Own at least 7 Hunnys 10k Collectibles',
        cupcakePoints: 25,
        freeClaimTokenId: 82,
        achievementsReward1: '/icons/Achievements/82.png',
        achievementsReward2: '/icons/Achievements/Achievements/6/1.png',
        title: 'Bunny Duke',
        eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 7,
        },
    {
        id: '7',
        challenge: 'Welcome, Royal Bunny',
        description: 'Own at least 12 Hunnys 10k Collectibles',
        cupcakePoints: 25,
        freeClaimTokenId: 92,
        achievementsReward1: '/icons/Achievements/92.png',
        achievementsReward2: '/icons/Achievements/Achievements/7/1.png',
        title: 'Royal Bunny',
        eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 12,
        },
    {
        id: '8',
        challenge: 'Welcome, Bunny Emperor',
        description: 'Own at least 30 Hunnys 10k Collectibles',
        cupcakePoints: 50,
        freeClaimTokenId: 83,
        achievementsReward1: '/icons/Achievements/83.png',
        achievementsReward2: '/icons/Achievements/Achievements/8/1.png',
        achievementsReward3: '/icons/Achievements/Achievements/8/2.png',
        title: 'Bunny Emperor',
        eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 30,
        },
    {
        id: '9',
        challenge: 'Welcome, World Domination Bunny',
        description: 'Own at least 50 Hunnys 10k Collectibles',
        cupcakePoints: 50,
        freeClaimTokenId: 96,
        achievementsReward1: '/icons/Achievements/96.png',
        achievementsReward2: '/icons/Achievements/Achievements/9/1.png',
        achievementsReward3: '/icons/Achievements/Achievements/9/2.png',
        achievementsReward4: '/icons/Achievements/Achievements/9/3.png',
        title: 'World Dominator',
        eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 50,
        },
    {
        id: '10',
        challenge: 'Welcome, Intergalactic Bunny',
        description: 'Own at least 100 Hunnys 10k Collectibles',
        cupcakePoints: 100,
        freeClaimTokenId: 89,
        achievementsReward1: '/icons/Achievements/89.png',
        achievementsReward2: '/icons/Achievements/Achievements/10/1.png',
        title: 'Intergalactic Bunny',
        eligibilityCriteria: (user: User) => user.tokens.filter(token => token.origin_name === "Hunnys 10k").length >= 100,
        },
    {
        id: '11',
        challenge: 'Dolly Historian',
        description: 'Own at least 1 Hunnys OG Collectible',
        cupcakePoints: 50,
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        title: 'OG Hunny',
        eligibilityCriteria: (user: User) => user.traits.some(token => token.origin_name === "Hunnys OG"),
    },
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
        id: '13', 
        challenge: 'Reach Level 1',
        description: 'Collect enough Cupcake Points to reach Level 1',
        cupcakePoints: 10, 
        title: 'Fresh Cupcake', 
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => user.level >= 1, // Eligible if user has reached at least Level 1
        },
    {
        id: '14', 
        challenge: 'Reach Level 2',
        description: 'Collect enough Cupcake Points to reach Level 2',
        cupcakePoints: 10, 
        title: 'Bunny Queens Helper', 
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => user.level >= 2, // Eligible if user has reached at least Level 1
        },
        
    {
        id: '15', 
        challenge: 'Reach Level 3',
        description: 'Collect enough Cupcake Points to reach Level 3',
        cupcakePoints: 10, 
        title: 'Bunny Bargainer', 
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => user.level >= 3, // Eligible if user has reached at least Level 1
        },
    {
        id: '16', 
        challenge: 'Reach Level 4',
        description: 'Collect enough Cupcake Points to reach Level 4',
        cupcakePoints: 10, 
        title: 'Squirrel Whisperer', 
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => user.level >= 4, // Eligible if user has reached at least Level 1
        },
    {
        id: '17', 
        challenge: 'Reach Level 5',
        description: 'Collect enough Cupcake Points to reach Level 5',
        cupcakePoints: 10, 
        title: 'Moar Collector', 
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => user.level >= 5, // Eligible if user has reached at least Level 1
        },
    {
        id: '18', 
        challenge: 'Reach Level 6',
        description: 'Collect enough Cupcake Points to reach Level 6',
        cupcakePoints: 10, 
        title: 'So Hupe!', 
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => user.level >= 6, // Eligible if user has reached at least Level 1
        },
    {
        id: '19', 
        challenge: 'Reach Level 7',
        description: 'Collect enough Cupcake Points to reach Level 7',
        cupcakePoints: 10, 
        title: 'Delicious Dreamer', 
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => user.level >= 7, // Eligible if user has reached at least Level 1
        },
    {
        id: '20', 
        challenge: 'Reach Level 8',
        description: 'Collect enough Cupcake Points to reach Level 8',
        cupcakePoints: 10, 
        title: 'Tater Tot', 
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => user.level >= 8, // Eligible if user has reached at least Level 1
        },
    {
        id: '21', 
        challenge: 'Reach Level 9',
        description: 'Collect enough Cupcake Points to reach Level 9',
        cupcakePoints: 10, 
        title: 'Forest Friend', 
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => user.level >= 9, // Eligible if user has reached at least Level 1
        },
    {
        id: '22', 
        challenge: 'Reach Level 10',
        description: 'Collect enough Cupcake Points to reach Level 10',
        cupcakePoints: 10, 
        title: 'Dreamer', 
        achievementsReward1: '/icons/Achievements/CupcakePoints.png',
        eligibilityCriteria: (user: User) => user.level >= 10, // Eligible if user has reached at least Level 1
        },
   {
      id: '23', 
      challenge: 'Reach Level 11',
      description: 'Collect enough Cupcake Points to reach Level 11',
      cupcakePoints: 50, 
      title: 'Horny', 
      achievementsReward1: '/icons/Achievements/CupcakePoints.png',
      eligibilityCriteria: (user: User) => user.level >= 11, // Eligible if user has reached at least Level 1
      },
    {
      id: '24',
      challenge: 'Minty Fresh',
      description: 'Mint a Dolly',
      cupcakePoints: 10,
      title: 'Minty Fresh', 
      achievementsReward1: '/icons/Achievements/CupcakePoints.png',
      eligibilityCriteria: (user: User) => user?.dollyCount > 0,
      },
    {
      id: '25',
      challenge: 'Vampire Slayer',
      description: 'Own the Buffy the Slayer Seasons NFT',
      cupcakePoints: 10,
      title: 'Vampire Slayer',
      freeClaimTokenId: 95,
      achievementsReward1: '/icons/Achievements/95.png',
      achievementsReward2: '/icons/Achievements/Achievements/25/1.png',
      eligibilityCriteria: (user: User) => user.tokens.some(token => token.img_url?.includes("Buffy")),
      },
    {
      id: '26',
      challenge: 'Bunny U Cheer Squad',
      description: 'Save a Dolly with the Bunny U Cheer Outfit',
      cupcakePoints: 10,
      freeClaimTokenId: 85,
      title: 'Cheer Squad',
      achievementsReward1: '/icons/Achievements/85.png',
      achievementsReward2: '/icons/Achievements/Achievements/26/1.png',
      eligibilityCriteria: (user: User) => user.dollys.some(dolly => 
        dolly.attributes && dolly.attributes.some(attr => attr.name === "BunnyUCheerTop")
      ),
      },
    {
      id: '27',
      challenge: 'Ghostfren',
      description: 'Own this ghostly trio - Ghost Kitty Friend, Ghost Croc, Boo the Ghost Floop',
      cupcakePoints: 50,
      freeClaimTokenId: 88,
      title: 'Ghostfren',
      achievementsReward1: '/icons/Achievements/88.png',
      achievementsReward2: '/icons/Achievements/Achievements/27/1.png',
      eligibilityCriteria: (user: User) => {
        const hasBooTheGhostFloop = user.traits.some(trait => trait.name === 'BooTheGhostFloop');
        const hasGhostCrocFriend = user.traits.some(trait => trait.name === 'GhostCrocFriend');
        const hasGhostKittyFriend = user.traits.some(trait => trait.name === 'GhostKittyFriend');
        return hasBooTheGhostFloop && hasGhostCrocFriend && hasGhostKittyFriend;
      },
    },
    {
      id: '28',
      challenge: 'Immortal',
      description: 'Own a 1/1 Immortal Hunny',
      cupcakePoints: 100,
      title: 'Immortal',
      achievementsReward1: '/icons/Achievements/CupcakePoints.png',
      eligibilityCriteria: (user: User) => {
        const has0 = user.tokens.some(token => token.token_id == 0 && token.origin_id == 1);
        const has899 = user.tokens.some(token => token.token_id == 899 && token.origin_id == 1);
        const has2118 = user.tokens.some(token => token.token_id == 2118 && token.origin_id == 1);
        const has3507 = user.tokens.some(token => token.token_id == 3507 && token.origin_id == 1);
        const has5039 = user.tokens.some(token => token.token_id == 5039 && token.origin_id == 1);
        const has7262 = user.tokens.some(token => token.token_id == 7262 && token.origin_id == 1);
        const has8833 = user.tokens.some(token => token.token_id == 8833 && token.origin_id == 1);
        const has9437 = user.tokens.some(token => token.token_id == 9437 && token.origin_id == 1);
        return has0 || has899 || has2118 || has3507 || has5039 || has7262 || has8833 || has9437;
      },
      },
    {
      id: '29',
      challenge: 'Baby Collector',
      description: 'Own 10 traits',
      cupcakePoints: 10,
      achievementsReward1: '/icons/Achievements/CupcakePoints.png',
      eligibilityCriteria: (user: User) => user.traits.some(token => token.origin_name != "default") && (user.traits.length > 10)
      },
    {
      id: '30',
      challenge: 'Cool Collector',
      description: 'Own 30 traits',
      cupcakePoints: 25,
      achievementsReward1: '/icons/Achievements/CupcakePoints.png',
      eligibilityCriteria: (user: User) => user.traits.some(token => token.origin_name != "default") && (user.traits.length > 30)
    },
    {
      id: '31',
      challenge: 'Serious Collector',
      description: 'Own 50 traits',
      cupcakePoints: 50,
      achievementsReward1: '/icons/Achievements/CupcakePoints.png',
      eligibilityCriteria: (user: User) => user.traits.some(token => token.origin_name != "default") && (user.traits.length > 50)
    },
    {
      id: '32',
      challenge: 'Mega Collector',
      description: 'Own 100 traits',
      cupcakePoints: 50,
      achievementsReward1: '/icons/Achievements/CupcakePoints.png',
      eligibilityCriteria: (user: User) => user.traits.some(token => token.origin_name != "default") && (user.traits.length > 100)
    },
    {
      id: '33',
      challenge: 'Noobie Boobie',
      description: 'Mint at least 3 Dollys',
      cupcakePoints: 25,
      title: 'Noobie Boobie', 
      achievementsReward1: '/icons/Achievements/CupcakePoints.png',
      eligibilityCriteria: (user: User) => user?.dollyCount > 2,
    },
    // {
    //   id: '34',
    //   challenge: 'Censored',
    //   description: 'Censor Yourself! But just for today.',
    //   cupcakePoints: 50,
    //   freeClaimTokenId: 99,
    //   title: 'Censored', 
    //   achievementsReward1: '/icons/Achievements/99.png',
    //   eligibilityCriteria: (user: User) => user?.dollyCount > -1,
    // },
    // {
    //   id: '35',
    //   challenge: 'Happy Bunny Day!',
    //   description: 'Bunny Day 2024 - the official Hunnys Holiday! Here are some sweet treats to help you celebrate!',
    //   cupcakePoints: 25,
    //   title: 'Bunny Day Attendee',
    //   freeClaimTokenId: 104,
    //   achievementsReward1: '/icons/Achievements/104.png',
    //   achievementsReward2: '/icons/Achievements/Achievements/35/1.png',
    //   achievementsReward3: '/icons/Achievements/Achievements/35/2.png',
    //   eligibilityCriteria: (user: User) => user?.dollyCount > -1,
    // },
    
    {
      id: '36',
      challenge: 'Crypto Defender i',
      description: 'Login to the Hunnys Closet during the Coinbase Embedded Wallet Launch',
      freeClaimTokenId: 105,
      cupcakePoints: 10,
      achievementsReward1: '/icons/Achievements/105.png',
      achievementsReward2: '/icons/Achievements/Achievements/36/1.png',
      eligibilityCriteria: (user: User) => user?.dollyCount > -1,
    },
    {
      id: '37',
      challenge: 'Crypto Defender ii',
      description: 'Read about Coinbase Embedded Wallets',
      callToAction: 'https://www.coinbase.com/blog/evolving-wallets-to-bring-a-billion-users-onchain',
      freeClaimTokenId: 106,
      cupcakePoints: 25,
      achievementsReward1: '/icons/Achievements/106.png',
      achievementsReward2: '/icons/Achievements/Achievements/37/1.png',
      eligibilityCriteria: (user: User) => {
        if (!linksClickedArray || linksClickedArray.length === 0) return false;
        return linksClickedArray.some((linksClicked: LinkClick) => linksClicked.trackId === "Crypto Defender ii");
      }
    },
    {
      id: '38',
      challenge: 'Crypto Defender iii',
      description: 'Save a dolly with the Crypto Defender Blue dye',
      freeClaimTokenId: 107,
      cupcakePoints: 25,
      achievementsReward1: '/icons/Achievements/107.png',
      achievementsReward2: '/icons/Achievements/Achievements/38/1.png',
      eligibilityCriteria: (user) => user.dollys.some(dolly => 
        dolly.attributes && dolly.attributes.some(attr => 
          attr.colorsApplied && attr.colorsApplied.includes('Crypto Defender Blue')
        )
      ),
    },
    {
      id: '39',
      challenge: 'Crypto Defender iv',
      description: 'Complete Crypto Defender i, ii and iii achievements',
      freeClaimTokenId: 108,
      cupcakePoints: 50,
      title: 'Crypto Defender', 
      achievementsReward1: '/icons/Achievements/108.png',
      achievementsReward2: '/icons/Achievements/Achievements/39/1.png',
      eligibilityCriteria: (user: User) => {
        // Directly access the 'claimed' property of each required achievement
        const completedCD1 = user.achievements['Crypto Defender i']?.claimed;
        const completedCD2 = user.achievements['Crypto Defender ii']?.claimed;
        const completedCD3 = user.achievements['Crypto Defender iii']?.claimed;
        // Only return true if all required achievements have been claimed
        return completedCD1 && completedCD2 && completedCD3;
      }
    },
    // Add more achievements here
  ];
  
  
  const handleAchievementClaim = async (achievementId: string, freeClaimTokenId?: number) => {
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
            userAddress={user!.address}
            freeClaimTokenId={achievement.freeClaimTokenId} // Add this line
          />
        ))}
      </div>
    );
  };
  
  export default AchievementsList;