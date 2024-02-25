// /components/Card/Card.tsx
import React from 'react';
import Image from 'next/image';

type CardProps = {
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

const Card: React.FC<CardProps> = ({ headerTitle, leftBlockContent, middleBlockContent, rightBlockContent, footer }) => {
  return (
    <div className="bg-white pb-4 shadow-lg max-w-5xl mx-auto my-8 rounded-b-3xl">
      <div className="profile-header justify-center bg-profile-header p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-white font-poppins">{headerTitle}</h1>
      </div>
      <div className="profile-container grid grid-cols-3 gap-12 m-auto pl-20 pr-20">
        <div className="mt-4 flex justify-center flex-col">{leftBlockContent}</div>
        <div className="mt-4 flex justify-center flex-col">{middleBlockContent}</div>
        <div className="mt-4 flex  flex-col">{rightBlockContent}</div>
      </div>
      <div className="mt-4 flex flex-col justify-center">{footer}</div>
    </div>
  );
};

export default Card;
