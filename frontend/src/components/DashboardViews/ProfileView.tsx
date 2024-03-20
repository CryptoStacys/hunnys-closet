import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store"; // Adjust the import path as necessary
import Card from "../Card/Card";
import ProfileCard from "../Card/ProfileCard";
import CupcakePoints from "../Card/CupcakePoints";
import Event from "../Card/Events";
import { customImageLoader } from "../../utils/imageLoader";
import Link from "../Link/Link";
import { ApiResponse, UUID, User, FreeClaimType } from "../../data/global";
import AWS from "aws-sdk";
import SecondaryButton from "../DollEditor/SecondaryButton";
import MintButton from "../Mint/MintButton"; // Adjust the path as needed
import { mintWithWeth } from "../../utils/eligibleTokens"; // Ensure this function suits the free claim
import { ethers } from "ethers";
import FreeClaim from "../../components/Mint/FreeClaim";
import Tooltip from "../Tooltip/Tooltip";
import ProgressBar from "../Achievements/ProgressBar";
import { Address } from "@coinbase/waas-sdk-web";
import axios from "axios";
import {
  calculateLevel,
  calculatePointsToNextLevel,
} from "../../utils/levelUtils";
import { useEVMAddress, useWalletContext } from "@coinbase/waas-sdk-web-react";

const ProfileView = () => {
  const [user, setUser] = useAtom(userAtom);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const banner = "/assets/img/ProfileBanner.png";
  const GMMug = "/assets/img/GMMug.png";
  const DollyPreviewProfilePage = "/assets/img/DollyPreviewProfilePage.gif";
  const [saveError, setSaveError] = useState("");
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const { wallet } = useWalletContext();
  const waasAddress = useEVMAddress(wallet);
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);
  const [birthdayMonth, setBirthdayMonth] = useState(
    user?.birthday_month || ""
  );
  const [birthdayDay, setBirthdayDay] = useState(user?.birthday_day || "");
  const [twitterHandle, setTwitterHandle] = useState(
    user?.twitter_handle || ""
  );
  const [discordHandle, setDiscordHandle] = useState(
    user?.discord_handle || ""
  );
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentLevel = calculateLevel(user?.cupcake_points || 0);
  const { nextLevelPoints, earnedPointsThisLevel, currentLevelPoints } =
    calculatePointsToNextLevel(currentLevel, user?.cupcake_points || 0);
  const [newsData, setNewsData] = useState<Array<any>>([]);
  const [recentNews, setRecentNews] = useState([]);
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const url =
          "https://sheets.googleapis.com/v4/spreadsheets/17qLvWaFJBEb7RBgmXgvBd3uX_yeKbzL2NUid47DfyT0/values/A2:E370?key=AIzaSyAjknT53sMDEOdJ3YtCmjgP3VeSTvSGB3U";
        const response = await axios.get(url);
        setRecentNews(response.data.values.slice(0, 3));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNewsData();
  }, []);
  useEffect(() => {
    const titles = Object.values(user?.achievements || {}).reduce(
      (acc: string[], achievement: any) => {
        if (achievement.title && !acc.includes(achievement.title)) {
          acc.push(achievement.title);
        }
        return acc;
      },
      []
    );

    setAvailableTitles(titles);
  }, [user?.achievements]);

  const freeClaimsArray = Array.isArray(user?.free_claim)
    ? user?.free_claim
    : [];

  // Use the guaranteed-to-be-array freeClaimsArray for .some()
  const claimedFreeMug = freeClaimsArray!.some(
    (freeClaim: FreeClaimType) =>
      freeClaim.token_id === "0" && freeClaim.claimed
  );
  const hasFirstDolly = user?.dollyCount === 0;
  const bunnyClubMembers = [
    "0xa7758394D8f7fD23b0d9F13E02427B514687394B",
    "0x55Abdc04655d590a48BCd1B996115448b71b7a84",
    "0x4eE115d0708924B4d3a83e45A428B0e3cb4348e9",
    "0x3a9a9b0a3148599dde1660476c6a47b1272247c6",
    "0xe17d0ac3F7C498924d4920bf279C01536686e014",
    "0x48a19c6B158491325E84c8837ED8Ba95A0403C13",
    "0x9d9d3bca9ae1126244786089d81ba9b289970238",
    "0x1975638d2dfdeee04d11adf6350187af9996dc7c",
    "0x6c6cD01ebbd02254C5Db5263797E366511992d29",
    "0x019Db3aA167aF3B91b6D72a05dD8437aaDd5225E",
    "0x247DBa0157DDD215d30d41A70411DbaFbFD6a0F9",
    "0x473e12B41bC13d3Ac98C4d06cD549Ba8a704dbf1",
    "0xBcDa92fF0D83448ad2B65C7a59D62FE3A18bF95f",
    "0x650d492E2F68A665a5dc029bc3f255FE5ec366Fc",
    "0x92926272A0A1A487DC3105bed4F1B01b50b56EEE",
    "0x5Cf422E9Ff1D79c98C479F8d4e8cbdC7B51E1550",
    "0x05CFB0DE5a75176733C7478e33d3d5999E5859F4",
    "0x78ae230336bb65B0023d78156708783402f303c2",
    "0x8b5e18b1A4BfF36085604e94C9bdE2054C62d026",
    "0x051f1F3920D196cc998D74A56978370b82432D25",
    "0x16272E839A5C29A3Fa90E670Cb599d233b6943aC",
    "0x745461ae3ee10F26e314735b6AF8ee41cD313E2d",
    "0x851a6FDb03A8F5dbCe902bBc8A7763599CBD73FA",
    "0xb62500D5a8b9629763d39a4D05784D6A47A72Ab1",
    "0x7b511800A8d8E7DE24Dd19de3103081824b6f41D",
    "0x1776727f3c60dD67B832F9E0614D7e028E32e063",
    "0x0DE9a66f0F9b714c5b987BDCb37A5E2EF1bDA67A",
    "0x660E2DC25C318946BF85DFa39AbB7c9bE009683F",
    "0xb85b346c305300291af065f8337e8ad6a6659ee3",
  ];

  const isBunnyClubMember = bunnyClubMembers
    .map((address) => address.toLowerCase())
    .includes(user!.address.toLowerCase());
  console.log(user?.address, isBunnyClubMember);
  const handleFreeNFTClaim = async () => {
    // Assuming mintWithWeth is adapted for free claims
    await mintWithWeth(
      user?.wallet,
      waasAddress,
      "0",
      ethers.utils.parseUnits("0", "ether"),
      provider,
    );
  };

  // Configure AWS SDK
  AWS.config.update({
    accessKeyId: "AKIAWFXRVD22RQT75KEL",
    secretAccessKey: "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",
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
    if (nameLength <= 4) return "text-5xl"; // Larger font size for very short names
    if (nameLength <= 8) return "text-4xl";
    if (nameLength <= 12) return "text-3xl";
    return "text-2xl"; // Smaller font size for longer names
  };

  useEffect(() => {
    // Log the current state of userAtom when Dashboard mounts or when user data changes
    console.log("Current user data in Profile:", user);
  }, [user]);

  const updateProfile = async () => {
    console.log("Updating profile with user data:", user);
    if (!user?.wallet) {
      setSaveError("User address is undefined.");
      return;
    }
    // Make API call using the latest user state values for profile_name and profile_image_url
    try {
      const profileImageUrl = await handleImageUpload(); // Assuming this function uploads the image and returns the URL
      const response = await fetch(
        `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateProfile",
            wallet: user.wallet,
            profile_name: user.profile_name,
            profile_image_url: profileImageUrl || user.profile_image_url, // Use new or existing URL
            tier: user.tier, // Include the selected title
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setSaveSuccess(true);
      } else {
        throw new Error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveError("Failed to update profile. Please try again.");
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
      wallet: user?.wallet ?? "", // Assuming wallet is always present in your user object
      profile_name: user?.profile_name ?? "", // Use existing name if not changed
      profile_image_url: newProfileImageUrl ?? user?.profile_image_url, // Use new or existing URL
      tier: user?.tier, // Include the selected title or current tier
      birthday_month: birthdayMonth,
      birthday_day: birthdayDay,
      twitter_handle: twitterHandle,
      discord_handle: discordHandle,
    };

    // Call the updateProfile API
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
        setSaveSuccess(true);
        // Update user state with new profile details
        setUser((prevUser) => {
          return prevUser
            ? {
                ...prevUser,
                profile_image_url:
                  newProfileImageUrl ?? prevUser.profile_image_url, // Update only if new image URL is provided
                tier: profileData.tier ?? prevUser.tier,
                birthday_month: birthdayMonth,
                birthday_day: birthdayDay,
                twitter_handle: twitterHandle,
                discord_handle: discordHandle,
                // Include other properties as needed to match User type
              }
            : null;
        });
        setIsEditingName(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveError("Failed to update profile. Please try again.");
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
      <ProfileCard
        headerTitle="Profile"
        leftBlockContent={
          <div className="profile-image avatar grid grid-cols-3 card-column w-[102%]">
            <Image
              onClick={() => setIsEditingName(true)}
              loader={customImageLoader}
              src={user?.profile_image_url || "/assets/img/choosePFP.png"}
              alt="Profile Avatar"
              width={300}
              height={300}
              className="rounded-xl self-center cursor-pointer hover:opacity-60 transition ease-in-out delay-75 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] object-cover"
            />

            {/* Success message */}
            {saveSuccess && (
              <div className="mt-4 text-center">
                Profile updated successfully!
              </div>
            )}
            {saveError && <div className="error mt-4">{saveError}</div>}
            {!isEditingName ? (
              <>
                <Image
                  onClick={() => setIsEditingName(true)}
                  loader={customImageLoader}
                  src="/assets/img/editProfile.png"
                  alt="Profile Avatar"
                  width={151}
                  height={35}
                  className="rounded-xl cursor-pointer mt-4 self-center hover:opacity-60 transition ease-in-out delay-75"
                />
              </>
            ) : (
              <>
                <input
                  type="file"
                  id="profile-image-upload"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="profile-image-upload"
                  className="bg-[#AA7AFA] hover:bg-[#7b2df8] transition ease-in-out delay-75 cursor-pointer text-white text-center font-bold py-2 px-4 rounded my-4"
                >
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
                {availableTitles.length > 0 && (
                  <>
                    <h1 className="font-bold">Title:</h1>
                    <select
                      className="sortDropdown p-2 !bg-[#EDEDED] mt-2 mb-6 shadow-lg"
                      value={user?.tier}
                      onChange={(e) =>
                        setUser((prevUser) =>
                          prevUser
                            ? { ...prevUser, tier: e.target.value }
                            : null
                        )
                      }
                      disabled={!isEditingName}
                    >
                      {availableTitles.map((title, index) => (
                        <option key={index} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </>
                )}
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
                  <img
                    src="/icons/XLogo.png"
                    alt="Twitter"
                    className="w-6 h-6 mr-2"
                  />
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
                  <img
                    src="/icons/DiscordLogo.png"
                    alt="Discord"
                    className="w-6 h-6 mr-2"
                  />
                  <input
                    type="text"
                    className="searchBar indent-2 !bg-[#EDEDED]"
                    placeholder="Discord Handle"
                    value={discordHandle}
                    onChange={(e) => setDiscordHandle(e.target.value)}
                  />
                </div>
                <button
                  className="bg-hunnys-yellow text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-1 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all"
                  onClick={handleSaveProfile}
                >
                  Save
                </button>

                <div className="mt-8 m-auto">
                  <SecondaryButton onClick={() => setIsEditingName(false)}>
                    Cancel
                  </SecondaryButton>
                </div>
              </>
            )}
          </div>
        }
        middleBlockContent={
          <div className="flex flex-col justify-between card-column card-column-fixed-height">
            <div className="text-center">
              <div className="text-xl luckiest banner m-auto">
                {user?.tier || "Fresh Cupcake"}
              </div>
            </div>
            <div className="flex flex-col justify-center xs:items-center tn:items-start">
              <h1
                className={`font-bold text-purple-700 username relative leading-normal break-keep ${calculateFontSize(
                  user?.profile_name?.length || 0
                )}`}
              >
                {user?.profile_name || "Welcome!"}
              </h1>
            </div>
            <div className="flex flex-col text-left">
              <p className="text-[16px] leading-normal">
                It is so nice to see you! I can&apos;t wait to see what you
                create today. Don&apos;t forget to check out the recent news and
                events above for the latest happenings in the Bunny Kingdom!
              </p>
            </div>
          </div>
        }
        rightBlockContent={
          <div className="xs:self-start sm:self-center hideplz">
            {isBunnyClubMember ? (
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
        footer={
          <>
            <ProgressBar
              level={currentLevel} // Use the calculated currentLevel
              cupcakePoints={earnedPointsThisLevel} // Adjusted to show progress within the current level
              maxPoints={nextLevelPoints - currentLevelPoints} // Show the range within the current level
            />
            <h1 className="font-poppins font-bold uppercase text-center w-[84%] self-center text-base justify-center relative bottom-2 text-[#A4A4A4]">
              Cupcake Points: {user?.cupcake_points}/{nextLevelPoints}
            </h1>
          </>
        }
      />
      {hasFirstDolly ? (
        <Card
          headerTitle="Introduction"
          leftBlockContent={
            <div>
              <div className="">
                <Image
                  src={"/icons/Alert.svg"}
                  alt={"Alert"}
                  width={200}
                  height={200}
                  className="xs:m-auto md:m-0 xs:w-[20%] md:w-[100%] md:max-w-[200px]"
                ></Image>
              </div>
            </div>
          }
          middleBlockContent={
            <div>
              <h1 className="text-2xl lg:text-[32px] text-left luckiest">
                New here? Create your first Dolly!
              </h1>
              <p className="font-poppins text-base lg:text-lg my-2 paragraphText">
                Get ready to unleash your creativity and dress up your Dolly in
                the Hunnys Closet!
              </p>
              <Link className="w-4/5 self-center" to="/dollys">
                <button className="bg-hunnys-yellow py-2 w-full self-center text-hunnys-blue luckiest shadow-md rounded-full px-4 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all">
                  Create My Dolly
                </button>
              </Link>
            </div>
          }
          rightBlockContent={
            <Image
              className="rounded-xl self-end"
              src={DollyPreviewProfilePage}
              alt={"Dolly Preview"}
              width={200}
              height={200}
            ></Image>
          }
          footer={""}
        />
      ) : (
        <div></div>
      )}
      ;
      <Card
        headerTitle="Welcome to Hunnys Closet!"
        leftBlockContent={
          <div>
            <CupcakePoints points="10" text="Cupcake Points" />
          </div>
        }
        middleBlockContent={
          <div>
            <h1 className="text-2xl lg:text-[32px] text-left luckiest">
              Claim your free GM Mug!
            </h1>
            <p className="font-poppins text-base lg:text-lg my-2 paragraphText">
              Score your first free claim along with 10 Cupcake Points towards
              your Adventure Progress!
            </p>
            {claimedFreeMug ? (
              <button
                disabled
                className="w-full self-center bg-[#2BC97E] text-black luckiest text-xl md:text-2xl opacity-40 font-bold py-2 px-4 rounded-full"
              >
                Completed
              </button>
            ) : (
              <FreeClaim
                tokenId="0"
                onMintSuccess={() => console.log("NFT claimed successfully!")}
                updateTraits={(userAddress) =>
                  console.log(`Traits updated for ${userAddress}`)
                }
                userAddress={user?.wallet}
                className="bg-hunnys-yellow hover:bg-hunnys-yellow self-center !text-hunnys-blue !w-4/5 luckiest shadow-md rounded-full px-4 py-1 text-xl md:text-2xl hover:shadow-lg hover:scale-[1.02] transition-all"
                buttonText="Claim My Free Mug!"
              />
            )}
          </div>
        } // Assuming you might fill this in later
        rightBlockContent={
          <div className="flex flex-col w-full lg:w-auto mt-4 lg:mt-0">
            <Image
              className="rounded-xl"
              src={GMMug}
              alt={"GM Mug"}
              width={200}
              height={200}
            />
          </div>
        }
        footer={""}
      />
      <Card
        headerTitle="Recent News"
        leftBlockContent={""}
        middleBlockContent={""}
        rightBlockContent={""}
        footer={recentNews.map((item, index) => (
          <div key={index}>
            <div className="date text-center leading-8 xs:ml-4 tn:ml-16 xs:text-xl sm:text-3xl">
              {item[4]}
            </div>
            <Event
              headerTitle={item[2]}
              event={
                <>
                  <a href={item[1]}>
                    <img src={item[0]} alt="News" className="w-full" />
                  </a>
                  <p className="font-poppins text-xl text-center mt-8 mx-8">
                    {item[3]}
                  </p>
                </>
              }
            />
          </div>
        ))}
      />
    </div>
  );
};
export default ProfileView;
