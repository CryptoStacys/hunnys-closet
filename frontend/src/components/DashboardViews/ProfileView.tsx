import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { userAtom, currentViewAtom } from "../../data/store"; // Adjust the import path as necessary
import Card from "../Card/Card";
import PromoCard from "../Card/PromoCard";
import ProfileCard from "../Card/ProfileCard";
import CupcakePoints from "../Card/CupcakePoints";
import PromoBlocks from "../Card/PromoBlocks";
import Event from "../Card/Events";
import { customImageLoader } from "../../utils/imageLoader";
import Link from "../Link/Link";
import { useRouter } from "next/router";
import { ApiResponse, UUID, User, FreeClaimType } from "../../data/global";
import AWS from "aws-sdk";
import SecondaryButton from "../DollEditor/SecondaryButton";
import MintButton from "../Mint/MintButton"; // Adjust the path as needed
import { mintWithWeth } from "../../utils/eligibleTokens"; // Ensure this function suits the free claim
import { ethers } from "ethers";
import FreeClaim from "../../components/Mint/FreeClaim";
import Tooltip from "../Tooltip/Tooltip";
import ProgressBar from "../Achievements/ProgressBar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Lazy, Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import Swiper core and required modules
import SwiperCore from "swiper";
SwiperCore.use([Navigation]);
import { Address } from "@coinbase/waas-sdk-web";
import axios from "axios";
import {
  calculateLevel,
  calculatePointsToNextLevel,
} from "../../utils/levelUtils";
import { useEVMAddress, useWalletContext } from "@coinbase/waas-sdk-web-react";
import { trackLinkClick } from "../../utils/tracking";

const checkNFTOwnership = async (userAddress: any, provider: ethers.providers.Provider | ethers.Signer | undefined) => {
  const contractAddress = "0x95c1ab4c5ba7f583abb211239d3dd1beae806a11";
  const erc721ABI = ["function balanceOf(address owner) external view returns (uint256)"];
  const contract = new ethers.Contract(contractAddress, erc721ABI, provider);

  try {
    const balance = await contract.balanceOf(userAddress);
    return balance.gt(0); // Returns true if the balance is greater than 0
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return false;
  }
};

const ProfileView = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isMember, setIsMember] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [initialUserData, setInitialUserData] = useState<typeof user | null>(
    null
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);

  const router = useRouter();
  const banner = "/assets/img/ProfileBanner.png";
  const GMMug = "/assets/img/GMMug.png";
  const degenSale = "/icons/degenSale.png";
  const newAchievements = "/icons/newAchievements.png";
  const threeMonthBC = "/icons/3monthBC.png";
  const sixMonthBC = "/icons/6monthBC.png";
  const twelveMonthBC = "/icons/12monthBC.png";
  const CD1 = "/icons/Achievements/Achievements/36/1.png";
  const CD2 = "/icons/Achievements/Achievements/37/1.png";
  const CD3 = "/icons/Achievements/Achievements/38/1.png";
  const CD4 = "/icons/Achievements/Achievements/39/1.png";
  const degenPack = "/assets/img/degenPack.gif";
  const DollyPreviewProfilePage = "/assets/img/DollyPreviewProfilePage.gif";
  const [saveError, setSaveError] = useState("");
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
  const navigationClick = (view: string) => {
    if (router.pathname === "/") {
      // Directly change the hash when already on the dashboard and switching views
      window.location.hash = view;
    } else {
      // Use the Link component for navigating between / and /dollys or from /dollys to a dashboard view
      // This part is handled by the conditional rendering logic below
    }
  };
  useEffect(() => {
    setInitialUserData(user);
  }, []);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  // Revert user state and clear selectedFile on cancel
  const handleCancel = () => {
    setUser(initialUserData);
    setSelectedFile(null);
    setImagePreviewUrl(initialUserData?.profile_image_url as string);
    setBirthdayMonth(initialUserData?.birthday_month as string);
    setBirthdayDay(initialUserData?.birthday_day as string);
    setTwitterHandle(initialUserData?.twitter_handle as string);
    setDiscordHandle(initialUserData?.discord_handle as string);
  };

  useEffect(() => {
    const freshCupcakeTitle = "Fresh Cupcake"; // Define the default title
    let titles = Object.values(user?.achievements || {}).reduce(
      (acc: string[], achievement: any) => {
        if (achievement.title && !acc.includes(achievement.title)) {
          acc.push(achievement.title);
        }
        return acc;
      },
      []
    );

    // Ensure "Fresh Cupcake" is always an option and avoid duplicates
    if (!titles.includes(freshCupcakeTitle)) {
      titles = [freshCupcakeTitle, ...titles];
    }

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

  
  useEffect(() => {
    const checkMembership = async () => {
      const bunnyClubMembers = [
    "0x807Bc799519E6943e326380A2A2bc54B597a3Fef",
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
    "0xF11Ce547ff948a03570B20Eac4a4d7b648693324",
    "0x650d492E2F68A665a5dc029bc3f255FE5ec366Fc",
    "0x92926272A0A1A487DC3105bed4F1B01b50b56EEE",
    "0xa5cC1E135C92a4DD1b32A328e1343eB4150461B6",
    "0x5Cf422E9Ff1D79c98C479F8d4e8cbdC7B51E1550",
    "0x05CFB0DE5a75176733C7478e33d3d5999E5859F4",
    "0x78ae230336bb65B0023d78156708783402f303c2",
    "0x8b5e18b1A4BfF36085604e94C9bdE2054C62d026",
    "0x051f1F3920D196cc998D74A56978370b82432D25",
    "0x745461ae3ee10F26e314735b6AF8ee41cD313E2d",
    "0x851a6FDb03A8F5dbCe902bBc8A7763599CBD73FA",
    "0xb62500D5a8b9629763d39a4D05784D6A47A72Ab1",
    "0x7b511800A8d8E7DE24Dd19de3103081824b6f41D",
    "0x1776727f3c60dD67B832F9E0614D7e028E32e063",
    "0x0DE9a66f0F9b714c5b987BDCb37A5E2EF1bDA67A",
    "0x660E2DC25C318946BF85DFa39AbB7c9bE009683F",
    "0xb85b346c305300291af065f8337e8ad6a6659ee3",
    "0xce05070e7afa163a029f87bde875084769729943",
    "0x973Ee618BFd3fb0e49c8A1a0CA2e2E6Aeb930aF3",
    "0x44b54f249a9ac0dff4e0d512c0c585b70ac47c30",
    "0xae034889250fcD370D8e0F0EA3C5641aDcc31200",
    "0x807Bc799519E6943e326380A2A2bc54B597a3Fef",
    "0xc42bf2A3acfA4F2CE8e772a6E05383D277920cE2",
    "0x36eee7D790a5B9e8811fB0C570c883997069DF49",
    "0x5f07cb9fafea4643a5a3891b27aa3ae2981adc30",
    "0x52EbEeEd51f1cacD7D56E9571C5D1D5b9C731afd",
    "0x49666CF3B2A8293da1CA2c5897e99fd7CCD3283C",
    "0x14a74D1811786A3D00a7EcF2162EFb870a127531",
    "0xa6cFb8E7967187FAE9CAdcC99927690608095F3c",
    "0x69bdF5addfF699B480c426338E3E4Ae13389B966",
    "0x013829f626FEA0cD3109c738FB1B09Eb4f50ec4E",
    "0xD57c3c4c3CF9915EB9680cA147203CD3df6BF0bf",
    "0x4119E300F51BdD6A8B8151232504aA08B263EAd2",
    "0x09D5B9CFDDd6104C3e57c1E74E4620b62006fbD9",
    "0x227d8E2092CfC3634A119FF2134d6039Cb920156",
    "0xAa19d4378ab35b932D632e6dA86fFF388C617826",
    "0xC2B10580ac514549A251EBDb622eBEb98514b9E1",
    "0xEBE326d8De3413F8132518dcFd45e6cBFf7E5c27",
    "0xFCf7665775c83193A7f060393aE8AE40c5Ea872b",
    "0xe4522b358E01Ce6893e80c97BC6c02743efE2862",
    "0x6Ee6805d588113c1a8B2737c348889f58279915f",
    "0xFE07263628Bf6126973887F34BE03A5ac91f2E7b",
    "0x02dFde061B9C085A0265c85dCBa106ac9c0Ca806",
    "0x3D545eA5e088B3B5b3700cA9331b2CD981557190",
    "0xe494d61977561d6be41590FbF940091bAE6d392e",
    "0xA309a5bD3602880792BB7A3E64Ffb7B744cbAAFC",
    "0xf4E7D8A84884E308Fb82FfD472d937af1c0AA464",
    "0xF0ef0B0D3A4a066C72dD5C8DbF45ac2447b2FB8B",
    "0xb9e22a2bb81f0e5498c82e88b0dc7c0276cd5cb1",
    "0xa74d7aF1D4BE2633b14453EE19B92810a4Af7472",
    "0x956aF6A0fF66bC34eec332178DdA80c85FBCdf12",
    "0xf5E90465460F8A0944A385981c977eeD40CB18fD",
    "0xB179Ec3179f20452710dc544FCd1486b8e7be4C0",
    "0x0eD6bEC87EDA347e9CB536EE8DDF1038fD556BE7",
    "0xf78Cbc427213561c3851eE845CC4fE504618757a",
    "0x17CADA1844da9119d4F7081C8FF56afe7F3E984b",
    "0x36fc63a184a21866b95b65242fc312af641401fe",
    "0x2F6C9F1C99761142be2Ad32A861A51Cc46A07F25",
    "0xe40dcd3e8587c72cf741293c55d0ecb1fca5a852",
    "0xe56891add612e8d066835baafea60905725fc521",
    "0x4289aD93fd56351407941FC46A2C77d53FC6Da24",
    "0xAb7EAEF74263d85F67B0d2350c40Da28D63f3938",
    "0x6EB7817D9c48c8AAdD68AD694F9B14F3b4e3C450",
    "0x81343d9207B471270B1AEB2b6DF4138c7662b3cE",
    "0xf8540Eb80904c35e149F2359a9e160758355f4B0",
    "0xf42fa3823c40089b0943060D410fCb6bDd21b3c6",
    "0xACa2014d02E56b1b012be117E7319C1257f35663",
    "0x0a995c404f7fBB8E614d7F68c0dBCc7a2f0bA943",
    "0x4ccd91E9fc2E0Ae38352851E010838622ba6579b",
    "0x96edbB1ECd03B988321dB31fDcd18Cc89892Cfa2",
    "0x16fEB4C83C71C36337280c33a78f1011f5a2e549",
    "0x0f2b906FFBf007B0dD5ae88836eAF8240EcF6674",
    "0xf0c43ee266723f424d28bb9134463a6d37d5c4c3",
    "0x9dF4acA87e16F7DD7715fF83f0E0E389fAfE638d",
    "0x67BE56FD6CE9703D2A3F24dB6B9b5F1fbd1e4386",
    "0x77867bef101e2903f820b9E080a06DE7e4395480",
    "0x5cE96292C49a86147636797b279B1078b1Ad8F9e",
    "0x55Abdc04655d590a48BCd1B996115448b71b7a84",
    "0x807Bc799519E6943e326380A2A2bc54B597a3Fef",
    "0xa7758394D8f7fD23b0d9F13E02427B514687394B",
    "0x978ecD8cF1702138110c9ffc1d9B6853088abE20",
    "0xE40DcD3e8587c72Cf741293C55D0ecB1fCa5a852",
    "0xB179Ec3179f20452710dc544FCd1486b8e7be4C0",
    "0x745461ae3ee10F26e314735b6AF8ee41cD313E2d",
    "0x6c6cD01ebbd02254C5Db5263797E366511992d29",
  ];

  const isBunnyClubMember = bunnyClubMembers
  .map((address) => address.toLowerCase())
  .includes(user!.address.toLowerCase());

const provider = new ethers.providers.JsonRpcProvider("https://base-mainnet.g.alchemy.com/v2/Y9AirihU_kvzbWDOO7RPs68bSH5DtFTG");
const ownsNFT = await checkNFTOwnership(user!.address, provider);

setIsMember(isBunnyClubMember || ownsNFT);
};

if (user?.address) {
checkMembership();
}
}, [user]);

  const getWeb3Provider = () => {
    try {
      // Attempt to use MetaMask's provider if available
      if (window.ethereum) {
        return new ethers.providers.Web3Provider(window.ethereum as any);
      } else {
        // Fall back to a default provider (e.g., ethers.js default provider or Infura)
        console.log("MetaMask is not installed, using fallback provider.");
        return ethers.getDefaultProvider();
      }
    } catch (error) {
      console.error("Failed to initialize the Web3 provider:", error);
      return null;
    }
  };
  const provider = getWeb3Provider();

  const handleImageUpload = async (): Promise<string | null> => {
    if (!selectedFile || !user?.UUID) return null;

    // Call your API to get a pre-signed URL and the filePath
    try {
      const response = await fetch("/api/getPresignedUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: user.UUID, // Send user UUID to generate the correct path
          fileName: "Profile.png", // Optional, if you want to specify the file name
        }),
      });

      const { url, filePath } = await response.json();

      // Now use the pre-signed URL to upload the file to S3
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: selectedFile,
      });

      if (uploadResponse.ok) {
        // The file has been uploaded. Construct the URL to the uploaded file
        // Assuming your S3 bucket is public and can directly serve files
        const uploadedUrl = `https://hunnyscloset.s3.amazonaws.com/${filePath}`;
        return uploadedUrl; // Return the URL to the uploaded file
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      return null;
    }
  };

  const calculateFontSize = (nameLength: number) => {
    if (nameLength <= 4) return "text-5xl"; // Larger font size for very short names
    if (nameLength <= 8) return "text-4xl mt-4";
    if (nameLength <= 12) return "text-3xl mt-4";
    if (nameLength <= 16) return "text-2xl mt-4";
    return "text-2xl"; // Smaller font size for longer names
  };

  useEffect(() => {
    // Log the current state of userAtom when Dashboard mounts or when user data changes
    console.log("Current user data in Profile:", user);
    console.log("Bucket name from env:", process.env.S3_BUCKET_NAME);
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
      newProfileImageUrl = await handleImageUpload(); // Ensure this is the only call
      if (!newProfileImageUrl) {
        console.error("Failed to upload new profile image.");
        setSaveError("Failed to upload new profile image.");
        return; // Exit if the upload fails
      }
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

  console.log(provider);
  return (
    <div>
      <ProfileCard
        headerTitle="Profile"
        leftBlockContent={
          <div className="profile-image avatar grid grid-cols-3 card-column w-[102%]">
            <Image
              onClick={() => setIsEditingName(true)}
              loader={customImageLoader}
              src={
                imagePreviewUrl ||
                user?.profile_image_url ||
                "/assets/img/choosePFP.png"
              }
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
                  alt="Edit Profile"
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
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                    if (file) {
                      setImagePreviewUrl(URL.createObjectURL(file));
                    }
                  }}
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
                {availableTitles.length > 1 && (
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
                  <SecondaryButton
                    onClick={() => {
                      handleCancel(); // Assuming handleCancel is implemented to reset form and image preview
                      setIsEditingName(false);
                    }}
                  >
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
          <div className="xs:self-start sm:self-end hideplz">
            {isMember ? (
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
      {claimedFreeMug ? (
        <div></div>
      ) : (
        <Card
          headerTitle="Welcome to Hunnys Closet!"
          leftBlockContent={
            <div className="md:h-[200px]">
              <CupcakePoints points="10" text="Cupcake Points" className={""} />
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
                  className="bg-hunnys-yellow py-2 w-full self-center text-hunnys-blue luckiest shadow-md rounded-full px-4 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all"
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
      )}

      <div className="mt-32">
        <h1 className="luckiest text-center text-[64px] leading-normal mx-8">
          RECENT NEWS
        </h1>
      </div>
      <div className="px-8 mx-auto max-w-7xl md:mt-[-40px]">
        {recentNews.map((item, index) => (
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
      </div>
    </div>
  );
};
export default ProfileView;
