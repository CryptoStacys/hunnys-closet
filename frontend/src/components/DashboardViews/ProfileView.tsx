import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store"; // Adjust the import path as necessary
import Card from '../Card/Card';
import { customImageLoader } from '../../utils/imageLoader';
import Link from "../Link/Link";
import { useAccount } from "wagmi";
import AchievementButton from "../Achievements/AchievementButton";
import { ApiResponse, UUID, User } from "../../data/global";
import AWS from "aws-sdk";
import SecondaryButton from "../DollEditor/SecondaryButton";
import ProgressBar from '../Achievements/ProgressBar';

// Assuming UserProfileType is the type you've defined for your user profile state
interface ProfileViewProps {
    userProfile: User;
    setProfileData: (profile: User) => void;
    profileName: string;
    setProfileName: (name: string) => void;
    profileImageUrl: string;
    setProfileImageUrl: (url: string) => void;
    tier: string;
    level: any,
    cupcakePoints: any,
  }

  const ProfileView: React.FC<ProfileViewProps> = ({
    userProfile,
    setProfileData,
    profileName,
    setProfileName,
    profileImageUrl,
    setProfileImageUrl,
    level,
    cupcakePoints,
    tier,
  }) => {
  const [user] = useAtom(userAtom);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { address, isConnected } = useAccount();
  const [isEditingName, setIsEditingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const banner = "/assets/img/ProfileBanner.png";

  // Configure AWS SDK
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    region: "us-east-2",
  });

  const handleImageUpload = async (): Promise<string | null> => {
    if (!selectedFile || !userProfile?.UUID) return null;
  
    const s3 = new AWS.S3();
    const fileName = "Profile.png";
    const filePath = `accounts/${userProfile.UUID}/${fileName}`;
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
    const imageUrlWithTimestamp = `${Location}?timestamp=${new Date().getTime()}`;
  setProfileImageUrl(imageUrlWithTimestamp);
  };
  
  const handleSaveProfile = async () => {
    let imageUrl = profileImageUrl; // Default to existing URL
  
    // Upload new image if selected
    if (selectedFile && userProfile?.UUID) {
      try {
        const uploadResult = await handleImageUpload();
        if (uploadResult) {
          imageUrl = uploadResult; // Update with new image URL if upload succeeds
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        return; // Exit if image upload fails
      }
    }
  
    // Update profile with potentially new image URL and name
    try {
      await updateProfile({
        ...userProfile,
        profile_name: profileName,
        profile_image_url: imageUrl,
      });
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

    const updateProfile = async (updatedProfile: User) => {
        const { profile_name, profile_image_url } = updatedProfile;
        // Assuming you have a backend endpoint to update the user profile
        try {
          const response = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "updateProfile",
                wallet: address,
                profile_name, // Directly from destructured updatedProfile
                profile_image_url, // Directly from destructured updatedProfile
            }),
          });
          const data = await response.json();
          if (data.success) {
            console.log("Profile updated successfully.");
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          } else {
            throw new Error(data.message || "Failed to update profile.");
          }
        } catch (error) {
          console.error("Error updating profile: ", error);
        }
      };

  

  return (
    <div>
      <Card
        headerTitle="Profile"
        leftBlockContent={
        <div className="profile-image avatar flex flex-col">
          <div className="text-2xl text-center z-50 bg-[#700cf5] rounded-full text-white luckiest">{userProfile?.tier || "King Cupcake"}</div>
            <Image loader={customImageLoader} src={profileImageUrl || '/assets/img/choosePFP.png'} alt="Profile Avatar" width={300} height={300} className="rounded-full border-black border-4 bottom-4 relative z-auto" />
            
          {/* Success message */}
          {saveSuccess && <div>Profile updated successfully!</div>}
          
          {!isEditingName ? (
            
        <><SecondaryButton onClick={() => setIsEditingName(true)}>Edit</SecondaryButton></>
        ) : (
        <>
            <input
            type="text"
            className="bg-white font-poppins border-solid border-2 border-black"
            placeholder="Enter Your Name..."
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            />
            <input
            className="mt-2 mb-2 w-full"
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <button className="bg-hunnys-yellow text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-1 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all" onClick={handleSaveProfile}>Save</button>
            <SecondaryButton onClick={() => setIsEditingName(false)}>Cancel</SecondaryButton>
        </>
        )}
        </div>}
        middleBlockContent={<div>
          
          <div className="profile-name text-2xl">
            <h1 className="font-bold text-purple-700 username m-auto text-center mt-4">
              WELCOME BACK, {profileName || "Cupcake"}!{" "}
            </h1>
            

            {/* Input field for editing name */}
            
          </div></div>}
        rightBlockContent={<div><Image
          src={"/icons/BunnyClubBadge.svg"}
          alt={"Bunny Club Status"}
          width={120}
          height={120}
        ></Image></div>}
        footer={<></>}        
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
        rightBlockContent={<div><div className="mt-4">
          <Link to="/dollys">
            <button className="bg-hunnys-yellow text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-1 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all">
              Create My Dolly
            </button>
          </Link>
        </div></div>} footer={undefined}      />
    </div>
  );
};

export default ProfileView;
