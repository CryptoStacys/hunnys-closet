import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store"; // Adjust the import path as necessary
import Card from '../Card/Card';
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

const ProfileView = () => {
  const [user, setUser] = useAtom(userAtom);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const banner = "/assets/img/ProfileBanner.png";
  const GMMug = "/assets/GMMug.png";
  const DollyPreviewProfilePage = "/assets/DollyPreviewProfilePage.gif";
  const [saveError, setSaveError] = useState('');
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const [showTooltip, setShowTooltip] = useState(false);

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
  
    try {
      const { Location } = await s3.upload(params).promise();
      return Location; // Return new image URL
    } catch (error) {
      console.error("Failed to upload image:", error);
      return null; // Return null on failure
    }
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
        const response = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "updateProfile",
                wallet: user.wallet,
                profile_name: user.profile_name,
                profile_image_url: user.profile_image_url,
            }),
        });
        const data = await response.json();
        if (data.success) {
            setSaveSuccess(true);
            // Optionally, refresh user data from server to reflect updates
        } else {
            throw new Error(data.message || "Failed to update profile.");
        }
    } catch (error) {
        console.error("Error updating profile: ", error);
        setSaveError('Failed to update profile. Please try again.');
    }
};


const handleSaveProfile = async () => {
  console.log("Saving profile...");
  let imageUrl = user?.profile_image_url; // Default to existing URL

  if (selectedFile) {
    const uploadResult = await handleImageUpload();
    if (uploadResult) imageUrl = uploadResult; // Update imageUrl if upload is successful
  }

  // Update user state with the new image URL
  setUser((prevUser) => {
    if (!prevUser) return null;
    
    return {
      ...prevUser,
      profile_image_url: imageUrl || prevUser.profile_image_url,
    };
  });

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
        <div className="profile-image avatar flex flex-col">
          <Image onClick={() => setIsEditingName(true)} loader={customImageLoader} src={user?.profile_image_url || '/assets/img/choosePFP.png'} alt="Profile Avatar" width={300} height={300} className="rounded-xl cursor-pointer hover:opacity-60 transition ease-in-out delay-75" />
            
          {/* Success message */}
          {saveSuccess && <div>Profile updated successfully!</div>}
          {saveError && <div className="error">{saveError}</div>}
          {!isEditingName ? (
            
        <><Image onClick={() => setIsEditingName(true)} loader={customImageLoader} src='/assets/img/editProfile.png' alt="Profile Avatar" width={151} height={35} className="rounded-xl cursor-pointer mt-4 self-center hover:opacity-60 transition ease-in-out delay-75" /></>
        ) : (
        <>
            <input
            type="text"
            className="bg-white font-poppins border-solid border-2 border-black"
            placeholder="Enter Your Name..."
            value={user?.profile_name}
            onChange={(e) => setUser(prevUser => {
              if (!prevUser) return null;
              return { ...prevUser, profile_name: e.target.value };
          })}

            />
            <input
            className="mt-2 mb-2 w-full"
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <button className="bg-hunnys-yellow  text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-1 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all" onClick={handleSaveProfile}>Save</button>
            <div className="mt-8 m-auto"><SecondaryButton onClick={() => setIsEditingName(false)}>Cancel</SecondaryButton></div>
        </>
        )}
        </div>}
        middleBlockContent={
          <div className="flex flex-col justify-between h-full">
            <div className="text-center">
              <div className="text-2xl luckiest banner">
                {user?.tier || "King Cupcake"}
              </div>
            </div>
            <div className="flex flex-col justify-center items-left">
              <h1 className="font-bold text-purple-700 username bottom-4 relative">
                {user?.profile_name || "Cupcake"}
              </h1>
            </div>
            <div className="text-left">
              <p className="text-[14px] leading-normal">
                It is so nice to see you! I can&apos;t wait to see what you create today. Don&apos;t forget to check out the recent news and events above for the latest happenings in the Bunny Kingdom!
              </p>
            </div>
          </div>
        }
        rightBlockContent={<div className="self-end">
          <Tooltip
            imageUrl="/assets/img/bunnyClubTooltipShadow.png" // The image you want to display in the tooltip
            imageAlt="Bunny Club Description" // Alt text for the tooltip image
            linkUrl="https://hunnys.io/bunnyclub"
            className=""
          >
          <div className="self-end">
          
            <div>
              <Image
                src={"/icons/BunnyClubBadge.svg"}
                alt={"Bunny Club Status"}
                width={120}
                height={120}
              />
            </div>
        </div>
          </Tooltip></div>
}
        footer={<>
        <ProgressBar level={user?.level} cupcakePoints={user?.cupcake_points} /></>}        
      />
        <div className="grid xs:grid-cols-1 lg:grid-cols-2 max-w-5xl m-auto gap-8">
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
      <h1 className="text-left luckiest text-2xl justify-self-center">
        New here? Create your first Dolly!
      </h1>
    </div></div>}
    rightBlockContent={<Image className="rounded-xl" src={DollyPreviewProfilePage} alt={"GM Mug"} width={120} height={120}></Image>}
    footer={<><Link className="w-4/5 self-center" to="/dollys">
        <button className="bg-hunnys-yellow py-2 w-full self-center text-hunnys-blue luckiest shadow-md rounded-full px-4 py-1 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all">Create My Dolly</button>
      </Link></>}
  />
  <Card
    headerTitle="Dailies"
    leftBlockContent={<div className='bg-[#6510F2] rounded-xl luckiest text-2xl text-white p-4 text-center'>10<br></br><span className="text-xl">CUPCAKE POINTS</span></div>}
    middleBlockContent={<h1 className="luckiest text-2xl text-left">Enjoy your free GM Mug!</h1>}
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
    </div>
  );
};
export default ProfileView;
