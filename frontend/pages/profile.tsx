import React from 'react';
import Layout from '../src/components/Layout/Layout';
import Image from 'next/image';
import sparkleBg from '../src/assets/img/sparkle_bg.png';

const ProfilePage: React.FC = () => {
  // Example user data, replace with actual data fetching logic
  const userProfile = {
    username: 'USERNAME',
    level: 7,
    bio: 'ullamco officia adipscing et ipsum ...',
    avatarUrl: '/public/assets/bdSailor.png' // Replace with actual avatar path
    // ... more user profile data
  };

  return (
    <Layout>
      <div className="flex justify-center items-center my-4 mx-auto" style={{ backgroundImage: `url(${sparkleBg.src})` }}>
        <div className="profile-header">
          <Image src="/assets/bdSailor.png" alt="Profile Avatar" width={100} height={100} />
          <h1>{userProfile.username}</h1>
          <span>Level {userProfile.level}</span>
          <p>{userProfile.bio}</p>
          {/* Add more user info here */}
        </div>
        
        {/* Rest of the profile content */}
        <div className="profile-content">
          {/* Modular blocks will be components that we will define and import */}
          <IntroductionBlock />
          <CollectionStatsBlock />
          <DailiesBlock />
          {/* Add more blocks as needed */}
        </div>
      </div>
    </Layout>
  );
};

// Placeholder components for the modular blocks, replace with actual implementations
const IntroductionBlock: React.FC = () => {
  return (
    <div className="introduction-block">
      {/* Content of the introduction block */}
      <h2>Introduction</h2>
      <p>New here? Create your first Dolly!</p>
      {/* More content */}
    </div>
  );
};

const CollectionStatsBlock: React.FC = () => {
  return (
    <div className="collection-stats-block">
      {/* Content of the collection stats block */}
      <h2>Collection Stats</h2>
      {/* More content */}
    </div>
  );
};

const DailiesBlock: React.FC = () => {
  return (
    <div className="dailies-block">
      {/* Content of the dailies block */}
      <h2>Dailies</h2>
      {/* More content */}
    </div>
  );
};

// Don't forget to define corresponding CSS for your components

export default ProfilePage;
