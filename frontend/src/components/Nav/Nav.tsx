import Link from "./../Link/Link";
import { ConnectButton, useAccountModal } from "@rainbow-me/rainbowkit";
import { useAtom } from "jotai";
import { Tooltip } from "react-tooltip";
import { currentViewAtom, setCurrentViewAtom } from '../../data/store';
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  connectedAtom,
  dollEditorVisibleAtom,
  userAtom,
} from "../../data/store";
import { mode } from "../../data/config";
import { useWalletContext } from "@coinbase/waas-sdk-web-react";
import Login from "../Login/Login";
import { useRouter } from "next/router";
import Image from "next/image";
type NavProps = {
  rewardStatus: string;
};

export default function Nav({ rewardStatus }: NavProps) {
  const [connected, setConnected] = useAtom(connectedAtom);
  const [selected, setSelected] = useState<number | string>(-1); // Allow string for temporary ID
  const [copySuccess, setCopySuccess] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openAccountModal } = useAccountModal();
  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [, triggerSetCurrentView] = useAtom(setCurrentViewAtom);
  const handleChangeView = (newView: string) => {
    setCurrentView(newView); // This should now pass TypeScript's type checking
  };
  const [user, setUser] = useAtom(userAtom);
  const [dollEditorVisible, setDollEditorVisible] = useAtom(
    dollEditorVisibleAtom
  );
  const {
    waas,
    error,
    user: waasUser,
    wallet,
    isLoggingIn,
    isCreatingWallet,
  } = useWalletContext();
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const isLoggedIn = connected || user;
  interface ButtonProps {
    iconSrc: string;
    text: string;
    onClick?: () => void;
    isActive: boolean;
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
        <span className="text-center text-sm text-black font-poppins font-bold">
          {text}
        </span>
      </button>
    );
  };
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

  const logout = useCallback(async () => {
    if (waas && waas.logout) {
      await waas.logout();
      setUser(null); // Reset global user state on logout
      setConnected(false); // Indicate that the user is no longer connected
      setDropdownVisible(false);
      router.push("/"); // Redirect to the home page, adjust if your login page has a different route
      console.log("Logout successful.");
    }
  }, [waas, setUser, setConnected, router]);

  const handleAddressCopy = useCallback(() => {
    if (user?.address) {
      navigator.clipboard.writeText(user.address).then(() => {
        setCopySuccess("Address Copied!");
        setTimeout(() => setCopySuccess(""), 2000); // Reset message after 2 seconds
      });
    }
  }, [user?.address]);

  const handleCreateDollyClick = () => {
    // Make the DollEditor visible
    setDollEditorVisible(true);
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    }

    // Bind the event listener only if the dropdown is visible
    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  const renderWaasUserDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-12 bg-white text-black font-bold px-4 py-2 rounded-xl"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        {user?.profile_image_url ? (
          <img
            src={user.profile_image_url}
            alt="Profile"
            width="24"
            height="24"
            className="rounded-full"
          />
        ) : (
          <img
            src="/heart.svg"
            alt="Default Profile"
            width="24"
            height="24"
            className="rounded-full"
          />
        )}
        <span className="mx-24 relative right-8 whitespace-nowrap">
          {user?.profile_name || "Account"}
        </span>
      </button>
      {dropdownVisible && (
        <div className="absolute flex text-left flex-col font-bold left-0 mt-2 py-2 w-48 bg-white outline-none rounded-md shadow-xl z-20">
          <Link to="/">
            <p className="indent-2">Dashboard</p>
            </Link>
          <a
            className="block px-2 py-2 cursor-pointer"
            onClick={handleAddressCopy}
          >
            Account Address:{" "}
            {copySuccess ||
              (user?.address
                ? `${user.address.substring(0, 6)}...${user.address.substring(
                    user.address.length - 4
                  )}`
                : "No Address")}
          </a>
          <a
            className="self-start indent-2 mt-4 cursor-pointer"
            onClick={logout}
          >
            Logout
          </a>
        </div>
      )}
    </div>
  );

  return (
    <nav className="top-2 fixed flex-center z-50 w-full box-border">
      <div className="max-w-[1250px] px-2 mx-6 flex justify-between items-center w-full box-border py-[6px] shadow-md bg-[#6510F1] rounded-2xl">
        <Link to="/" className="">
          <h1 className=" btn font-title text-md md:text-4xl leading-[1.2rem] flex-center md:leading-normal text-[#fff] ml-[10px]">
            {/* HUNNYS{" "} */}
            <div className="mobile-hide">HUNNYS </div>
            <svg
              className="sm:w-7 sm:h-7 sm:mx-1 w-10 h-10 mx-0 fill-hunnys-yellow"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 1440"
            >
              <path d="M1347,420.9v95.3c-2.4,18.2-4.6,36.4-7,54.6c-12,83.3-40.2,163.1-82.9,234.2 c-62.4,108.5-145.7,197.9-236.2,280.8C903.4,1190.3,778,1284.4,646,1367.1c-2.9-6.5-5.7-12.3-8.2-18.3 c-58.2-136.5-139.6-260.6-240.1-366c-52.5-55.6-106.5-109.7-158.8-165.5c-42.4-43.4-77.1-94.3-102.6-150.6 c-30.3-72.1-42.1-151.4-34.2-229.9c3.3-56.5,20.5-111,49.9-158.3c42.8-67.2,104.1-104.5,177.9-119.9c88.3-20.2,180.6-6.1,259.9,39.6 c46.3,25.6,85.5,63.5,113.9,109.9c3.9-7.5,7.5-14.5,11-21.5c24.9-51.9,57.8-99.1,97.4-139.5c58.2-59.3,138.6-87.8,218.8-77.3 c80.7,7.1,156.3,45,212.7,106.6c53.3,58.5,87.9,133.3,98.9,213.8C1343.8,400.7,1345.7,410.9,1347,420.9z" />
            </svg>
            <div className="mobile-hide">CLOSET</div>
            {/* CLOSET */}
          </h1>
        </Link>
        <div className="flex justify-between items-center gap-4">
          {user?.wallet_type === "waas"
            ? renderWaasUserDropdown()
            : connected &&
              user && (
                <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-12 bg-white text-black font-bold px-4 py-2 rounded-xl"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        {user?.profile_image_url ? (
          <img
            src={user.profile_image_url}
            alt="Profile"
            width="24"
            height="24"
            className="rounded-full"
          />
        ) : (
          <img
            src="/heart.svg"
            alt="Default Profile"
            width="24"
            height="24"
            className="rounded-full"
          />
        )}
        <span className="mx-24 relative right-8 whitespace-nowrap">
          {user?.profile_name || "Account"}
        </span>
      </button>
      {dropdownVisible && (
        <div className="absolute flex text-left flex-col font-bold left-0 mt-2 py-2 w-48 bg-white outline-none rounded-md shadow-xl z-20">
          <Link to="/">
            <p className="indent-2">Dashboard</p>
            </Link>
        <a
        className="block px-2 py-2 cursor-default"
        onClick={handleAddressCopy}
      >
        Account Address:{" "}
        {copySuccess ||
          (user?.address
            ? `${user.address.substring(0, 6)}...${user.address.substring(
                user.address.length - 4
              )}`
            : "No Address")}
      </a>
          {openAccountModal && (
        <button className="self-start indent-2 mt-4" onClick={openAccountModal} type="button">Logout</button>
      )}
        </div>
      )}
    </div>
              )}
          {connected && (
            <>
              <Link className="w-4/5 self-center" to="/dollys">
                <button
                  onClick={handleCreateDollyClick}
                  className="bg-hunnys-yellow py-1 w-full self-center text-hunnys-blue luckiest shadow-md rounded-full px-4 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Create A Dolly
                </button>
              </Link>
              <div className="hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg
                width="40px"
                height="40px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 18L20 18"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 12L20 12"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 6L20 6"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
      </div>
      {isMobileMenuOpen && (
  <div className="absolute top-full left-0 w-full">
    {buttonsData.map((button, index) =>
        
        button.view === "dollys" ? (
          <div key={index} className="mb-2">
          <Link key={index} className="w-full" to="/dollys">
          <button
          className="text-sm text-black font-poppins font-bold w-full"
          onClick={() => {
            triggerSetCurrentView(button.view); // Use the atom to change the view
            setIsMobileMenuOpen(false); // Close the menu
          }}
        >
          {button.text}
        </button>
          </Link></div>
        ) : (
          <div key={index} className="mb-2">
          <ProfileButton
          
          key={index}
          iconSrc={button.iconSrc}
          text={button.text}
          onClick={() => {
            triggerSetCurrentView(button.view); // Use the atom to change the view
            setIsMobileMenuOpen(false);
          }}
          isActive={currentView === button.view}
          isMobileMenu={true}
        /></div>
        )
      )}
  </div>
      )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
