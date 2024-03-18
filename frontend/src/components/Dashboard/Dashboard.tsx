import React, { useState } from "react";
import ProfileButtons from "../ProfileButtons/ProfileButtons";
import { userAtom } from "../../data/store";
import ProfileView from '../DashboardViews/ProfileView';
import ShopView from '../DashboardViews/ShopView'; 
import AchievementsView from '../DashboardViews/AchievementsView'; 
import InventoryView from "../DashboardViews/InventoryView/InventoryView";
import NewsView from "../DashboardViews/NewsView";
import EventsView from "../DashboardViews/EventsView";
import { useAtom } from "jotai";

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('profile');
  // Use userAtom if needed for conditional rendering or passing to components that still require it
  const [user] = useAtom(userAtom);

  const renderView = () => {
    switch (currentView) {
        case 'achievements':
          return <AchievementsView />;
        case 'inventory':
            return <InventoryView />;
        case 'news':
            return <NewsView />;
        case 'events':
            return <EventsView />;
        case 'shop':
            return <ShopView />;
        default:
            // Directly return ProfileView without props since it now accesses userAtom internally
            return <ProfileView />;
    }
  };

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto my-8">
        <ProfileButtons setCurrentView={setCurrentView} currentView={currentView} />
      </div>
      {renderView()}
    </>
  );
};

export default Dashboard;
