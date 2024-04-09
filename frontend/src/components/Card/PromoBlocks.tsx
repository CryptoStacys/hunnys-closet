// /components/Card/PromoBlocks.tsx
import React from "react";
import Image from "next/image";

type PromoBlocksProps = {
  points: string | number;
  text: string;
  className?: string;
};

{
  /* 
HOW TO REUSE EASILY ON OTHER PAGES:
<PromoBlocks
        points="NumberOfPoints"
        text="PromoBlocks"
      />
*/
}

const PromoBlocks: React.FC<PromoBlocksProps> = ({ points, text }) => {
  return (
    <div className="bg-[#6510F2] rounded-[30px] xs:w-auto md:w-[200px] md:h-[100%] font-luckiest text-white justify-center content-center xs:px-2 xs:py-4">
      <div className="flex xs:flex-row md:flex-col text-center justify-center">
        <h1 className="flex flex-col self-center mt-4 ">
          {points} <span className="xs:mt-4 md:mt-8">{text}</span>
        </h1>
      </div>
    </div>
  );
};

export default PromoBlocks;
