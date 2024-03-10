import React from 'react';

interface ButtonProps {
  link: string;
  iconSrc: string;
  text: string;
  onClick: () => void;
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
        view: 'events',
        iconSrc: '/icons/Events.svg',
        text: 'Events',
      },
      {
        view: 'inventory',
        iconSrc: '/icons/Inventory.svg',
        text: 'Inventory',
      },
      {
        view: 'shop',
        iconSrc: '/icons/Shop.svg',
        text: 'Shop',
      },
      {
        view: 'news',
        iconSrc: '/icons/News.svg',
        text: 'News',
      },
      {
        view: 'achievements',
        iconSrc: '/icons/Achievements.svg',
        text: 'Achievements',
      },
    ];
  
    // No need for handleButtonClick, directly use setCurrentView in onClick
    return (
      <>
        <div className="grid md:grid-cols-6 xs:grid-cols-3 gap-4">
          {buttonsData.map((button, index) => (
            <ProfileButton
              key={index}
              iconSrc={button.iconSrc}
              text={button.text}
              onClick={() => setCurrentView(button.view)}
              link={''}
              isActive={currentView === button.view} // Pass isActive based on the current view
            />
          ))}
        </div>
      </>
    );
  };

export default ProfileButtons;