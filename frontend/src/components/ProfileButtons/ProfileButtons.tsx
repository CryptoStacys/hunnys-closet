import React from 'react';
import Link from "../Link/Link";

interface ButtonProps {
  iconSrc: string;
  text: string;
  onClick?: () => void;
  isActive: boolean;
}

interface ProfileButtonsProps {
    children?: React.ReactNode; // Now it can accept children props
  }

  const ProfileButton: React.FC<ButtonProps> = ({ iconSrc, text, onClick, isActive }) => {
    return (
      <button onClick={onClick} className="flex flex-col items-center justify-center space-y-2">
        <img src={iconSrc} alt="Button Icon" className={`rounded-full w-1/2 drop-shadow-2xl hover:bg-[#7b2df8] transition ease-in-out delay-75 ${isActive ? 'bg-[#6510F2]' : 'bg-[#AA7AFA]'}`} />
        <span className="text-center text-sm text-black font-poppins font-bold">{text}</span>
      </button>
    );
  };

  const ProfileButtons: React.FC<{setCurrentView: (view: string) => void, currentView: string}> = ({ setCurrentView, currentView }) => {
    // Adjust buttonsData to include a view name instead of link
    const buttonsData = [
      {
        view: 'profile',
        iconSrc: '/icons/Profile.svg',
        text: 'Profile',
      },
      {
        view: 'dollys',
        iconSrc: '/icons/Dollys.svg',
        text: 'Dollys',
      },
      {
        view: 'inventory',
        iconSrc: '/icons/Inventory.svg',
        text: 'Inventory',
      },
      {
        view: 'achievements',
        iconSrc: '/icons/Achievements.svg',
        text: 'Achievements',
      },
      {
        view: 'events',
        iconSrc: '/icons/Events.svg',
        text: 'Events',
      },
      {
        view: 'news',
        iconSrc: '/icons/News.svg',
        text: 'News',
      },
      {
        view: 'shop',
        iconSrc: '/icons/Shop.svg',
        text: 'Shop',
      },
    ];
  
    // No need for handleButtonClick, directly use setCurrentView in onClick
    return (
      <div className="grid md:grid-cols-7 xs:grid-cols-3 gap-4">
        {buttonsData.map((button, index) => (
          button.view === 'dollys' ? (
            <Link key={index} className="w-full" to="/dollys">
              <button className="flex flex-col items-center justify-center space-y-2 w-full">
                <img src={button.iconSrc} alt="Button Icon" className="rounded-full w-1/2 drop-shadow-2xl hover:bg-[#7b2df8] transition ease-in-out delay-75 bg-[#AA7AFA]" />
                <span className="text-center text-sm text-black font-poppins font-bold">{button.text}</span>
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
        ))}
      </div>
    );
  };

export default ProfileButtons;