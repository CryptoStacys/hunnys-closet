import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store"; // Adjust the import path as necessary
import Card from '../Card/Card';
import Event from '../Card/Events';
import { customImageLoader } from '../../utils/imageLoader';
import Link from "../Link/Link";
import { ApiResponse, UUID, User } from "../../data/global";
import AWS from "aws-sdk";
import SecondaryButton from "../DollEditor/SecondaryButton";
import MintButton from '../Mint/MintButton'; // Adjust the path as needed
import { mintWithWeth } from '../../utils/eligibleTokens'; // Ensure this function suits the free claim
import { ethers } from "ethers";
import FreeClaim from "../../components/Mint/FreeClaim"
import Tooltip from '../Tooltip/Tooltip';
import ProgressBar from '../Achievements/ProgressBar';
import { calculateLevel, calculatePointsToNextLevel } from '../../utils/levelUtils';

const ProfileView = () => {
  const [user, setUser] = useAtom(userAtom);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const banner = "/assets/img/ProfileBanner.png";
  const GMMug = "/assets/img/GMMug.png";
  const DollyPreviewProfilePage = "/assets/img/DollyPreviewProfilePage.gif";
  const [saveError, setSaveError] = useState('');
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const [showTooltip, setShowTooltip] = useState(false);
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);
  const [birthdayMonth, setBirthdayMonth] = useState(user?.birthday_month || '');
  const [birthdayDay, setBirthdayDay] = useState(user?.birthday_day || '');
  const [twitterHandle, setTwitterHandle] = useState(user?.twitter_handle || '');
  const [discordHandle, setDiscordHandle] = useState(user?.discord_handle || '');
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentLevel = calculateLevel(user?.cupcake_points || 0);
  const { nextLevelPoints, earnedPointsThisLevel, currentLevelPoints } = calculatePointsToNextLevel(currentLevel, user?.cupcake_points || 0);
  
  
  useEffect(() => {
    const titles = Object.values(user?.achievements || {}).reduce((acc: string[], achievement: any) => {
      if (achievement.title && !acc.includes(achievement.title)) {
        acc.push(achievement.title);
      }
      return acc;
    }, []);
  
    setAvailableTitles(titles);
  }, [user?.achievements]);
  
  const handleFreeNFTClaim = async () => {
    // Assuming mintWithWeth is adapted for free claims
    await mintWithWeth(user?.wallet, '0', ethers.utils.parseUnits("0", "ether"), provider);
  };
  
  // Configure AWS SDK
  AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    region: "us-east-2",
  });

  const handleImageUpload = async (): Promise<string | null> => {
    if (!selectedFile || !user?.UUID) return null;
  
    const s3 = new AWS.S3();
    const fileName = "Profile.png";
    const filePath = `accounts/${user.UUID}/${fileName}`;
    const params = {
      Bucket: "hunnyscloset",
      Key: filePath,
      Body: selectedFile,
      ACL: "public-read",
    };

    console.log("User UUID", user.UUID);
  
    try {
      const { Location } = await s3.upload(params).promise();
      return Location; // Return new image URL
    } catch (error) {
      console.error("Failed to upload image:", error);
      console.log(error); // Add more detailed logging
      return null;
    }
  };

  const calculateFontSize = (nameLength: number) => {
    if (nameLength <= 4) return 'text-5xl'; // Larger font size for very short names
    if (nameLength <= 8) return 'text-4xl';
    if (nameLength <= 12) return 'text-3xl';
    return 'text-2xl'; // Smaller font size for longer names
  };
  
  useEffect(() => {
    // Log the current state of userAtom when Dashboard mounts or when user data changes
    console.log('Current user data in Profile:', user);
  }, [user]);

  const updateProfile = async () => {
    console.log("Updating profile with user data:", user);
    if (!user?.wallet) {
        setSaveError('User address is undefined.');
        return;
    }
    // Make API call using the latest user state values for profile_name and profile_image_url
    try {
      const profileImageUrl = await handleImageUpload(); // Assuming this function uploads the image and returns the URL
      const response = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateProfile",
          wallet: user.wallet,
          profile_name: user.profile_name,
          profile_image_url: profileImageUrl || user.profile_image_url, // Use new or existing URL
          tier: user.tier, // Include the selected title
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSaveSuccess(true);
      } else {
        throw new Error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveError('Failed to update profile. Please try again.');
    }
  };


  const handleSaveProfile = async () => {
    console.log("Saving profile...");
    let newProfileImageUrl: string | null = null;

  if (selectedFile) {
    const uploadResult = await handleImageUpload();
    if (uploadResult) newProfileImageUrl = uploadResult;
  }
  
    // Prepare the data object for updating the profile
    const profileData = {
      action: "updateProfile",
      wallet: user?.wallet ?? '', // Assuming wallet is always present in your user object
      profile_name: user?.profile_name ?? '', // Use existing name if not changed
      profile_image_url: newProfileImageUrl ?? user?.profile_image_url, // Use new or existing URL
      tier: user?.tier, // Include the selected title or current tier
      birthday_month: birthdayMonth, 
      birthday_day: birthdayDay, 
      twitter_handle: twitterHandle, 
      discord_handle: discordHandle 
    };
  
    // Call the updateProfile API
    try {
      const response = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (data.success) {
        setSaveSuccess(true);
        // Update user state with new profile details
        setUser(prevUser => {
          return prevUser ? {
            ...prevUser,
            profile_image_url: newProfileImageUrl ?? prevUser.profile_image_url, // Update only if new image URL is provided
            tier: profileData.tier ?? prevUser.tier, 
            birthday_month: birthdayMonth, 
            birthday_day: birthdayDay, 
            twitter_handle: twitterHandle, 
            discord_handle: discordHandle, 
            // Include other properties as needed to match User type
          } : null;
        });
        setIsEditingName(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveError('Failed to update profile. Please try again.');
    }
  };
  

// useEffect to call updateProfile when user.profile_image_url changes
useEffect(() => {
  const updateProfileIfNeeded = async () => {
    // Check if the image URL or any other relevant part of the user object was updated
    if (user?.profile_image_url && selectedFile) {
      await updateProfile();
    }
  };

  updateProfileIfNeeded();
}, [user?.profile_image_url, selectedFile]);


  return (
    <div>
      <Card
        headerTitle="Profile"
        leftBlockContent={
        <div className="profile-image avatar flex flex-col card-column w-[102%]">
          <Image onClick={() => setIsEditingName(true)} loader={customImageLoader} src={user?.profile_image_url || '/assets/img/choosePFP.png'} alt="Profile Avatar" width={300} height={300} className="rounded-xl cursor-pointer hover:opacity-60 transition ease-in-out delay-75" />
            
          {/* Success message */}
          {saveSuccess && <div>Profile updated successfully!</div>}
          {saveError && <div className="error">{saveError}</div>}
          {!isEditingName ? (
            
        <><Image onClick={() => setIsEditingName(true)} loader={customImageLoader} src='/assets/img/editProfile.png' alt="Profile Avatar" width={151} height={35} className="rounded-xl cursor-pointer mt-4 self-center hover:opacity-60 transition ease-in-out delay-75" /></>
        ) : (
        <>
            <input
            type="file"
            id="profile-image-upload"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />
          <label htmlFor="profile-image-upload" className="bg-[#AA7AFA] hover:bg-[#7b2df8] transition ease-in-out delay-75 cursor-pointer text-white text-center font-bold py-2 px-4 rounded my-4">
            Choose Profile Image
          </label>
      <h1 className="font-bold">Name:</h1>
            <input
            type="text"
            className="searchBar indent-2 !bg-[#EDEDED] mt-2 mb-6"
            placeholder="Enter Your Name..."
            maxLength={16}
            value={user?.profile_name}
            onChange={(e) => {
              const newValue = e.target.value;
              if (/^[\w\-\s]+$/i.test(newValue) || newValue === "") {
                setUser((prevUser) => {
                  if (!prevUser) return null;
                  return { ...prevUser, profile_name: newValue };
                });
              }
            }}

            />
            {
              availableTitles.length > 0 && (
                
            <><h1 className="font-bold">Title:</h1><select
                        className="sortDropdown p-2 !bg-[#EDEDED] mt-2 mb-6 shadow-lg"
                        value={user?.tier}
                        onChange={(e) => setUser((prevUser) => prevUser ? { ...prevUser, tier: e.target.value } : null)}
                        disabled={!isEditingName}
                      >
                        {availableTitles.map((title, index) => (
                          <option key={index} value={title}>
                            {title}
                          </option>
                        ))}
                      </select></>
              )
            }
            {/* Birthday Month and Day Dropdowns */}
      <h1 className="font-bold mb-2">Birthday:</h1>
      <div className="flex flex-row justify-between">
        <select
          className="sortDropdown w-2/3 p-2 !bg-[#EDEDED] shadow-lg"
          value={birthdayMonth}
          onChange={(e) => setBirthdayMonth(e.target.value)}
        >
          <option value="">Month</option>
          {/* Assuming you've defined the months array as shown previously */}
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <select
          className="sortDropdown p-2 !bg-[#EDEDED] shadow-lg"
          value={birthdayDay}
          onChange={(e) => setBirthdayDay(e.target.value)}
        >
          <option value="">Day</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Twitter Handle Input */}
      <h1 className="font-bold mt-6">Social:</h1>
      <div className="flex flex-row items-center mt-4 placeholder:text-hunnys-black">
        <img src="/icons/XLogo.png" alt="Twitter" className="w-6 h-6 mr-2" />
        <input
          type="text"
          className="searchBar indent-2 !bg-[#EDEDED]"
          placeholder="X Handle"
          value={twitterHandle}
          onChange={(e) => setTwitterHandle(e.target.value)}
        />
      </div>

      {/* Discord Handle Input */}
      <div className="flex flex-row items-center mt-4 mb-4">
        <img src="/icons/DiscordLogo.png" alt="Discord" className="w-6 h-6 mr-2" />
        <input
          type="text"
          className="searchBar indent-2 !bg-[#EDEDED]"
          placeholder="Discord Handle"
          value={discordHandle}
          onChange={(e) => setDiscordHandle(e.target.value)}
        />
      </div>
            <button className="bg-hunnys-yellow text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-1 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all" onClick={handleSaveProfile}>Save</button>

            <div className="mt-8 m-auto"><SecondaryButton onClick={() => setIsEditingName(false)}>Cancel</SecondaryButton></div>
            

        </>
        )}
        </div>}
        middleBlockContent={
          <div className="flex flex-col justify-between w-[120%] card-column card-column-fixed-height">
            <div className="text-center">
              <div className="text-xl luckiest banner">
                {user?.tier || "Fresh Cupcake"}
              </div>
            </div>
            <div className="flex flex-col justify-center items-left">
              <h1 className={`font-bold text-purple-700 username relative leading-normal break-keep ${calculateFontSize(user?.profile_name.length || 0)}`}>
                {user?.profile_name || "Welcome!"}
              </h1>
            </div>
            <div className="text-left">
              <p className="text-[16px] leading-normal">
                It is so nice to see you! I can&apos;t wait to see what you create today. Don&apos;t forget to check out the recent news and events above for the latest happenings in the Bunny Kingdom!
              </p>
            </div>
          </div>
        }
        rightBlockContent={
          <div className="self-end">
            {user?.bunny_club ? (
              <Image
                src="/assets/img/BunnyClubMemberEmblem.png"
                alt="Bunny Club Member"
                width={180}
                height={180}
              />
            ) : (
              <Tooltip
                imageUrl="/assets/img/joinBunnyClubTooltip_with_shadow.svg"
                imageAlt="Join the Bunny Club"
                linkUrl="https://hunnys.io/bunnyclub"
                className=""
              >
                <Image
                  src={"/icons/BunnyClubBadge.svg"}
                  alt={"Bunny Club Status"}
                  width={120}
                  height={120}
                />
              </Tooltip>
            )}
          </div>
        }
        footer={<>
        <ProgressBar
              level={currentLevel} // Use the calculated currentLevel
              cupcakePoints={earnedPointsThisLevel} // Adjusted to show progress within the current level
              maxPoints={nextLevelPoints - currentLevelPoints} // Show the range within the current level
            />
        <h1 className="font-poppins font-bold uppercase text-center w-[84%] self-center text-base justify-center relative bottom-2 text-[#A4A4A4]">Cupcake Points: {user?.cupcake_points}/{nextLevelPoints}</h1></>}        
      />
   <Card
    headerTitle="Introduction"
    leftBlockContent={<div><div className="mt-4">
      <Image
        src={"/icons/Alert.svg"}
        alt={"Alert"}
        width={120}
        height={120}
      ></Image>
    </div></div>}
    middleBlockContent={<div><div className="mt-4">
      <h1 className="text-left luckiest text-4xl justify-self-center">
        New here? Create your first Dolly!
      </h1>
    </div></div>}
    rightBlockContent={<Image className="rounded-xl self-end" src={DollyPreviewProfilePage} alt={"GM Mug"} width={120} height={120}></Image>}
    footer={<><Link className="w-4/5 self-center" to="/dollys">
        <button className="bg-hunnys-yellow py-2 w-full self-center text-hunnys-blue luckiest shadow-md rounded-full px-4 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all">Create My Dolly</button>
      </Link></>}
  /><Card
  headerTitle="Dailys"
  leftBlockContent={<div className='bg-[#6510F2] rounded-xl luckiest text-2xl text-white p-4 text-center'>10<br></br><span className="text-xl">CUPCAKE POINTS</span></div>}
  middleBlockContent={""}
  rightBlockContent={<Image className="rounded-xl" src={GMMug} alt={"GM Mug"} width={120} height={120}></Image>}
  footer={<FreeClaim
    tokenId="0"
    onMintSuccess={() => console.log("NFT claimed successfully!")}
    updateTraits={(userAddress) => console.log(`Traits updated for ${userAddress}`)}
    userAddress={user?.wallet}
    className="bg-hunnys-yellow hover:bg-hunnys-yellow self-center !text-hunnys-blue !w-4/5 luckiest shadow-md rounded-full px-4 py-1 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all "
    buttonText="Claim My Free Mug!"
  />}
/>
</div>
  );
};
export default ProfileView;
