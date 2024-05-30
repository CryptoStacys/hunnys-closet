//src/components/Dashboard.tsx

import React, { useEffect, useState } from "react";
import ProfileButtons from "../ProfileButtons/ProfileButtons";
import { currentViewAtom, userAtom } from "../../data/store";
import ProfileView from '../DashboardViews/ProfileView';
import ShopView from '../DashboardViews/ShopView'; 
import AchievementsView from '../DashboardViews/AchievementsView'; 
import InventoryView from "../DashboardViews/InventoryView/InventoryView";
import NewsView from "../DashboardViews/NewsView";
import EventsView from "../DashboardViews/EventsView";
import { useAtom } from "jotai";

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [user] = useAtom(userAtom);

  useEffect(() => {
    const onHashChange = () => {
      const newView = window.location.hash.replace('#', '');
      setCurrentView(newView);
    };

    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
console.log("Current View", currentView)
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
        // case 'gallery':
        //     return <GalleryView />;
        // case 'bunnyclub':
        //     return <BunnyClubView />;
        default:
            return <ProfileView />;
    }
  };

  return (
    <>
      <div className="xs:p-0 xs:mb-24 md:p-4 max-w-7xl mx-auto md:my-8">
        <ProfileButtons setCurrentView={setCurrentView} currentView={currentView} />
      </div>
      {renderView()}
    </>
  );
};

export default Dashboard;
