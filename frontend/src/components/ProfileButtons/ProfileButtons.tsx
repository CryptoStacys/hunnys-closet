import React, { useEffect, useRef, useState } from "react";
import Link from "../Link/Link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Lazy, Navigation, Pagination, Mousewheel } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import Swiper core and required modules
import SwiperCore from "swiper";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
// Install Swiper modules
SwiperCore.use([Navigation]);

interface ButtonProps {
  iconSrc: string;
  text: string;
  onClick?: () => void;
  isActive: boolean;
}

interface ProfileButtonsProps {
  children?: React.ReactNode; // Now it can accept children props
}

const ProfileButton: React.FC<ButtonProps & { isMobileMenu?: boolean }> = ({ iconSrc, text, onClick, isActive, isMobileMenu = false }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center space-y-2 profileButtons"
    >
      {!isMobileMenu && (
        <img
          src={iconSrc}
          alt="Button Icon"
          className={`rounded-full w-1/2 drop-shadow-2xl hover:bg-[#7b2df8] transition ease-in-out delay-75 ${
            isActive ? "bg-[#6510F2]" : "bg-[#AA7AFA]"
          }`}
        />
      )}
      <span className="text-center text-sm text-black font-poppins font-bold xs:text-[24px] md:text-[12px] md:mb-0 xs:mb-6">
        {text}
      </span>
    </button>
  );
};

const ProfileButtons: React.FC<{
  setCurrentView: (view: string) => void;
  currentView: string;
}> = ({ setCurrentView, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null); 
  useEffect(() => {
    function handleClickOutside(event: { target: any; }) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
  
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  
  // Adjust buttonsData to include a view name instead of link
  const buttonsData = [
    {
      view: "profile",
      iconSrc: "/icons/Profile.svg",
      text: "Profile",
    },
    {
      view: "dollys",
      iconSrc: "/icons/Dollys.svg",
      text: "Dollys",
    },
    {
      view: "inventory",
      iconSrc: "/icons/Inventory.svg",
      text: "Inventory",
    },
    {
      view: "achievements",
      iconSrc: "/icons/Achievements.svg",
      text: "Achievements",
    },
    {
      view: "events",
      iconSrc: "/icons/Events.svg",
      text: "Events",
    },
    {
      view: "news",
      iconSrc: "/icons/News.svg",
      text: "News",
    },
    {
      view: "shop",
      iconSrc: "/icons/Shop.svg",
      text: "Shop",
    },
  ];

  // No need for handleButtonClick, directly use setCurrentView in onClick
  return (
    <>
      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {/* Hamburger Icon */}
        <svg
          width="40px"
          height="40px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 18L20 18"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M4 12L20 12"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M4 6L20 6"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <div className={`hidden md:grid md:grid-cols-7 xs:grid-cols-4 gap-4`}>
        {buttonsData.map((button, index) =>
          button.view === "dollys" ? (
            <Link key={index} className="w-full " to="/dollys">
              <button className="flex flex-col items-center justify-center space-y-2 w-full ">
                <img
                  src={button.iconSrc}
                  alt="Button Icon"
                  className="rounded-full w-1/2 drop-shadow-2xl hover:bg-[#7b2df8] transition ease-in-out delay-75 bg-[#AA7AFA]"
                />
                <span className="text-center text-sm text-black font-poppins font-bold">
                  {button.text}
                </span>
              </button>
            </Link>
          ) : (
            <ProfileButton
              key={index}
              iconSrc={button.iconSrc}
              text={button.text}
              onClick={() => setCurrentView(button.view)}
              isActive={currentView === button.view}
            />
          )
        )}
      </div>
      <div
        className={`absolute md:hidden ${
          isMenuOpen ? "block" : "hidden"
        } bg-white shadow-lg rounded-lg p-4 z-50`}
        ref={menuRef}
      >
        {/* Dropdown menu for mobile */}
        {buttonsData.map((button, index) =>
        
          button.view === "dollys" ? (
            <div key={index} className="xs:mb-8">
            <Link key={index} className="w-full " to="/dollys">
              <button className="">
                
                <span className="text-center xs:text-[24px] md:text-sm text-black font-poppins font-bold ">
                  {button.text}
                </span>
              </button>
            </Link></div>
          ) : (
            <div key={index} className="mb-2 ">
            <ProfileButton
            
            key={index}
            iconSrc={button.iconSrc}
            text={button.text}
            onClick={() => {
              setCurrentView(button.view);
              setIsMenuOpen(false);
            }}
            isActive={currentView === button.view}
            isMobileMenu={true}
          /></div>
          )
        )}
      </div>
    </>
  );
};

export default ProfileButtons;
