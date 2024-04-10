import React from "react";
import { useAtom } from 'jotai';
import { userAtom } from "../../data/store"; // Adjust path as necessary
import { trackLinkClick } from '../../utils/tracking'; // Ensure the path is correct

interface SecondaryButtonProps {
  onClick?: React.MouseEventHandler;
  title?: string;
  children?: React.ReactNode;
  disableBtn?: boolean;
  className?: string;
  trackId?: string; // New prop for tracking ID
}

export default function SecondaryButton({ onClick, title, children, disableBtn, className, trackId }: SecondaryButtonProps) {
  const [user] = useAtom(userAtom); // Use the userAtom to access the current user's state

  const handleClick: React.MouseEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault(); // Prevent default if needed based on your use case
  
    // Ensure user and trackId are not null/undefined before attempting to track
    if (trackId && user) {
      try {
        // Perform the tracking and ensure URL is handled properly
        await trackLinkClick(trackId, user, "internal"); // Adjust URL handling based on your needs
        console.log(`Tracking performed for: ${trackId}`);
      } catch (error) {
        console.error('Error performing tracking:', error);
      }
    }
  
    // Proceed with original onClick handler if provided
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div className="flex">
      {disableBtn ? (
        <div
          title={title}
          className="select-none bg-[#ddd] flex justify-center items-center text-center px-4 py-1 text-[#777] font-bold rounded-full hover:cursor-pointer"
        >
          {children}
        </div>
      ) : (
        <div
          onClick={handleClick} // Use the modified handleClick
          title={title}
          className={`select-none hover:bg-[#ddd] btn flex justify-center items-center text-center px-4 py-1 text-[#777] hover:text-[#666] font-bold rounded-full hover:cursor-pointer ${className}`}
        >
          {children}
        </div>
      )}
    </div>  
  );
}
