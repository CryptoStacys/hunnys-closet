import React from 'react';
import Image from 'next/image';
import sparkleBg from '../../assets/img/sparkle_bg.png';
import Layout from '../Layout';

const ProfilePage: React.FC = () => {
  // Example user data, replace with actual data fetching logic
  const userProfile = {
    username: 'USERNAME',
    level: 7,
    bio: 'ullamco officia adipiscing et ipsum ...',
    avatarUrl: '/path/to/avatar.png', // Replace with actual avatar path
  };

  return (
    <Layout>
    <div className="bg-purple-200 p-4 rounded-lg shadow-lg max-w-5xl mx-auto my-8" style={{ backgroundImage: `url(${sparkleBg.src})` }}>
      <div className="profile-header text-center p-4">
        <div className="avatar mb-4 inline-block">
          <Image src={userProfile.avatarUrl} alt="Profile Avatar" width={100} height={100} className="rounded-full" />
        </div>
        <h1 className="text-2xl font-bold text-purple-700">{userProfile.username}</h1>
        <span className="text-purple-500">Level {userProfile.level}</span>
        <p className="text-purple-600 mt-2">{userProfile.bio}</p>
      </div>
      
      <div className="profile-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <IntroductionBlock />
        <CollectionStatsBlock />
        <DailiesBlock />
      </div>
    </div>
    </Layout>
  );
};

const IntroductionBlock: React.FC = () => {
  return (
    <div className="introduction-block bg-purple-300 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Introduction</h2>
      <p className="mt-2">New here? Create your first Dolly!</p>
      <button className="bg-purple-500 text-white px-4 py-2 rounded-full mt-4 hover:bg-purple-600 transition">Create My Dolly</button>
    </div>
  );
};

const CollectionStatsBlock: React.FC = () => {
  return (
    <div className="collection-stats-block bg-purple-300 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Collection Stats</h2>
      {/* Add content and stats here */}
    </div>
  );
};

const DailiesBlock: React.FC = () => {
  return (
    <div className="dailies-block bg-purple-300 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Dailies</h2>
      {/* Add daily challenges or content here */}
    </div>
  );
};

export default ProfilePage;