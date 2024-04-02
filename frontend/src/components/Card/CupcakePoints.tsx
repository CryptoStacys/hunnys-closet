// /components/Card/CupcakePoints.tsx
import React from "react";
import Image from "next/image";

type CupcakePointsProps = {
  points: string | number;
  text: string;
  className?: string;
};

{
  /* 
HOW TO REUSE EASILY ON OTHER PAGES:
<CupcakePoints
        points="NumberOfPoints"
        text="CupcakePoints"
      />
*/
}

const CupcakePoints: React.FC<CupcakePointsProps> = ({ points, text }) => {
  return (
    <div className="bg-[#6510F2] rounded-[30px] xs:w-auto md:w-[200px] md:h-[100%] font-luckiest text-white justify-center content-center xs:px-2 xs:py-4">
      <div className="flex xs:flex-row md:flex-col text-center justify-center">
        <h1 className="flex flex-col self-center text-[48px] mt-4 md:text-[64px]">
          {points} <span className="xs:mt-4 md:mt-8 text-xl md:text-2xl">{text}</span>
        </h1>
      </div>
    </div>
  );
};

export default CupcakePoints;
