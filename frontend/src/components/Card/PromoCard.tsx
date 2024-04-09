// /components/Card/PromoCard.tsx
import React from 'react';
import Image from 'next/image';

type PromoCardProps = {
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

const PromoCard: React.FC<PromoCardProps> = ({ headerTitle, leftBlockContent, middleBlockContent, rightBlockContent, footer }) => {
  return (
    <div className="bg-white pb-4 shadow-lg max-w-7xl xs:mx-[10px] lg:mx-auto my-8 rounded-b-3xl">
      <div className="profile-header justify-center bg-profile-header p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-white font-poppins text-center">{headerTitle}</h1>
      </div>
      <div className="profile-container grid grid-cols-1 md:grid-cols-3 gap-4 m-auto p-4 md:pl-20 md:pr-20">
        <div className="flex justify-center flex-col self-center">{leftBlockContent}</div>
        <div className="flex justify-center flex-col">{middleBlockContent}</div>
        <div className="flex justify-center flex-col self-center">{rightBlockContent}</div>
      </div>
      <div className="flex flex-col justify-center">{footer}</div>
    </div>
  );
};

export default PromoCard;
