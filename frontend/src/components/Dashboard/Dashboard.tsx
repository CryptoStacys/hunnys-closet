import React, { useEffect, useState } from "react";
import ProfileButtons from "../ProfileButtons/ProfileButtons";
import { ApiResponse, User, UUID } from "../../data/global";
import { useAccount } from "wagmi";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import ProfileView from '../DashboardViews/ProfileView'; 
import AchievementsView from '../DashboardViews/AchievementsView'; 
import InventoryView from "../DashboardViews/InventoryView";
import NewsView from "../DashboardViews/NewsView";
import EventsView from "../DashboardViews/EventsView";

const Dashboard: React.FC = () => {
  const [profileName, setProfileName] = React.useState("");
  const [profileImageUrl, setProfileImageUrl] = React.useState("");
  const [userProfile, setUserProfile] = React.useState<User | null>(null);
  const { address, isConnected } = useAccount();
  const [user, setUser] = useAtom(userAtom);
  const [currentView, setCurrentView] = useState<string>('profile');
  const dollyCount = user?.dollys?.length || 0;
  

  const renderView = () => {
    switch (currentView) {
        case 'achievements':
          return <AchievementsView fetchUserProfile={fetchUserProfile} />;
        case 'inventory':
            return <InventoryView />;
        case 'news':
            return <NewsView />;
        case 'events':
            return <EventsView />;
        default:
            if (userProfile) {
                return (
                    <ProfileView
                    userProfile={userProfile}
                    setProfileData={setUserProfile}
                    profileName={profileName}
                    setProfileName={setProfileName}
                    profileImageUrl={profileImageUrl}
                    setProfileImageUrl={setProfileImageUrl}
                    tier={""}
                    level={undefined}
                    cupcakePoints={undefined}                    />
                );
            }
    }
    // Optionally render a placeholder or nothing if userProfile is null
    return null;
};

  
  useEffect(() => {
    if (isConnected && address) {
      fetchUserProfile(address)
        .then((profile) => {
          if (profile && profile.success) {
            setUserProfile(profile.data); // Set the full user profile object here
            setUser(profile.data);
            setProfileName(profile.data.profile_name || ""); // Make sure to use the correct key from your response
            setProfileImageUrl(profile.data.profile_image_url || ""); // Make sure to use the correct key from your response
          }
        })
        .catch((error) => {
          console.error("Fetching user profile failed:", error);
        });
    }
  }, [address, isConnected, setUserProfile]);
  
  const fetchUserProfile = async (
    walletAddress: string
  ): Promise<ApiResponse> => {
    const response = await fetch(
      `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts?action=getProfile&wallet=${walletAddress}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    const apiResponse: ApiResponse = await response.json();
    return apiResponse;
  };

  useEffect(() => {
    console.log("User Profile State:", userProfile); // Check the structured userProfile state
    console.log("Profile Name State:", profileName); // Check the profileName state
    console.log("Profile Image URL State:", profileImageUrl); // Check the profile_image_url state
  }, [userProfile, profileName, profileImageUrl]);
  

  return (
    <>
      <div className="p-4 max-w-5xl mx-auto my-8">
        <ProfileButtons setCurrentView={setCurrentView} />
      </div>
      {renderView()}
      
    </>
  );
};


export default Dashboard;
