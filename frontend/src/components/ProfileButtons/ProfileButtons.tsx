import React from 'react';

interface ButtonProps {
  link: string;
  iconSrc: string;
  text: string;
  onClick: () => void;
}

interface ProfileButtonsProps {
    children?: React.ReactNode; // Now it can accept children props
  }

  const ProfileButton: React.FC<ButtonProps> = ({ iconSrc, text, onClick }) => {
    return (
      <button onClick={onClick} className="flex flex-col homerow items-center justify-center space-y-2">
        <img src={iconSrc} alt="Button Icon" className="rounded-full bg-[#AA7AFA] w-1/2 drop-shadow-2xl" />
        <span className="text-center text-sm text-black luckiest">{text}</span>
      </button>
    );
  };const ProfileButtons: React.FC<{setCurrentView: (view: string) => void}> = ({ setCurrentView }) => {
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
        <div className="flex space-x-4">
          {buttonsData.map((button, index) => (
            <ProfileButton key={index} iconSrc={button.iconSrc} text={button.text} onClick={() => setCurrentView(button.view)} link={''} />
          ))}
        </div>
      </>
    );
  };

export default ProfileButtons;