import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Lazy } from "swiper/modules";

import "swiper/css/pagination";
import "swiper/css/navigation";
// Import Swiper styles
import "swiper/css";
// Import Swiper core and required modules
import SwiperCore from "swiper";
// Install Swiper modules
SwiperCore.use([Navigation]);

// Types for your NFT items and any other props you might need
type NftItem = {
  id: string; // Assuming an ID for each item
  image: string;
  name: string;
  attribute?: string;
  parentImage?: string;
  parentName?: string;
  isOwned?: boolean;
  buttonURL?: string;
};

type GridProps = {
  gridSize: string;
  viewMode: string;
  data: NftItem[];
  isTokenOwned: (tokenName: string, originName: string) => boolean; // Assuming this is your logic to check ownership
};

const GridComponent: React.FC<GridProps> = ({ gridSize, viewMode, data, isTokenOwned }) => {
  // Calculate dynamic classes based on gridSize and viewMode
  const cardClass = `border rounded-xl bg-white hover:shadow-lg transform transition duration-500 hover:scale-105 m-2 overflow-hidden ${
    gridSize === '8x8' ? 'p-0 max-w-xs min-h-64' : 'p-2 d-flex flex-column justify-between'
  }`;
  const imageClass = "m-auto rounded-xl";
  const titleClass = `${gridSize === '8x8' ? 'text-sm' : 'text-lg'} luckiest mb-2 mt-2 text-left`;

  // Render function for itemized data
  const renderItem = (item: NftItem) => (
    <div key={item.id} className={`${cardClass} ${item.isOwned ? '' : 'low-brightness'}`}>
      {item.isOwned && gridSize === '4x3' ? (
        <div className={`${gridSize === '4x3' ? 'm-4' : 'text-xs text-center mr-2 mb-2'} flex flex-row justify-end`}>
          <p className={`${gridSize === '4x3' ? 'text-xl mr-4 text-end' : 'text-xs text-center'} font-poppins font-bold align-middle self-center top-1 relative`}>
            Owned
          </p>
          <img src="/icons/Unlocked.png" alt="Owned & Unlocked" className={`${gridSize === '4x3' ? 'w-[10%]' : 'hidden'}`}></img>
        </div>
      ) : (
        !item.isOwned && gridSize === '4x3' && (
          <div className={`${gridSize === '4x3' ? 'm-4' : 'text-xs text-center mr-2 mb-2'} flex flex-row justify-end`}>
            <p className={`${gridSize === '4x3' ? 'text-xl mr-4 text-end' : 'text-xs text-center'} font-poppins font-bold align-middle self-center top-1 relative`}>
              Not Owned
            </p>
            <img src="/icons/Locked.png" alt="Unowned & Locked" className={`${gridSize === '4x3' ? 'w-[10%]' : 'hidden'}`}></img>
          </div>
        )
      )}
      <img src={item.image} alt={`NFT ${item.name}`} className={`${imageClass}`} loading="lazy" />
      <div className="pt-1">
        <h1 className={titleClass}>{item.name}</h1>
        {item.parentName && (
          <div className="text-center cursor-pointer">
            <img className="max-w-24 max-h-24 mx-auto border-[#C6C6C6] border-2 rounded-xl" src={item.parentImage} alt={`Trait ${item.parentName}`} />
            <p className="text-xs mt-1">Origin: {item.parentName}</p>
          </div>
        )}
      </div>
      {item.buttonURL && (
        <a href={item.buttonURL} target="_blank" rel="noreferrer" className="block mt-2 bg-[#6510F2] text-lg text-white font-bold rounded-full text-center hover:bg-opacity-80">
          VIEW
        </a>
      )}
    </div>
  );

  return (
    <div className={`${gridSize === '8x8' ? 'grid grid-cols-8 gap-4' : 'grid grid-cols-3 gap-4'}`}>
      {data.map((item) => renderItem(item))}
    </div>
  );
};

export default GridComponent;
