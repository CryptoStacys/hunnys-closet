// /components/Card/ProfileCard.tsx
import React from 'react';
import Image from 'next/image';

type ProfileCardProps = {
  headerTitle: string;
  leftBlockContent: React.ReactNode;
  middleBlockContent: React.ReactNode;
  rightBlockContent: React.ReactNode;
  footer: React.ReactNode;
};

{/* 
HOW TO REUSE EASILY ON OTHER PAGES:
<Card
        headerTitle="HEADER TITLE"
        leftBlockContent={<div>CONTENT LEFT</div>}
        middleBlockContent={<div>CONTENT MIDDLE</div>}
        rightBlockContent={<div>CONTENT RIGHT</div>}
        footer={<></>}
      />
*/}

const ProfileCard: React.FC<ProfileCardProps> = ({ headerTitle, leftBlockContent, middleBlockContent, rightBlockContent, footer }) => {
  return (
    <div className="bg-white pb-4 shadow-lg max-w-7xl mx-auto my-8 rounded-b-3xl">
      <div className="profile-header justify-center bg-profile-header p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-white font-poppins">{headerTitle}</h1>
      </div>
      <div className="grid grid-cols-3 xs:grid-cols-1 tn:grid-cols-2 sm:grid-cols-3 gap-4 md:gap-12 m-auto p-4 md:pl-20 md:pr-20">
        <div className="flex justify-center flex-col">{leftBlockContent}</div>
        <div className="flex justify-center flex-col sm:max-w-[100%] ">{middleBlockContent}</div>
        <div className="flex flex-col justify-start items-start">{rightBlockContent}</div>
      </div>
      <div className="flex flex-col justify-center">{footer}</div>
    </div>
  );
};

export default ProfileCard;
