//src/components/Nav.tsx

import Link from "./../Link/Link";
import { useAtom } from "jotai";
import { Tooltip } from "react-tooltip";
import {
  activeDollyComponentAtom,
  currentViewAtom,
  setCurrentViewAtom,
} from "../../data/store";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  connectedAtom,
  dollEditorVisibleAtom,
  userAtom,
} from "../../data/store";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "../../hooks/useAuth";

type NavProps = {
  rewardStatus: string;
};

export default function Nav({ rewardStatus }: NavProps) {
  const [connected, setConnected] = useAtom(connectedAtom);
  const [selected, setSelected] = useState<number | string>(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [activeDollyComponent] = useAtom(activeDollyComponentAtom);
  const [user, setUser] = useAtom(userAtom);
  const [dollEditorVisible, setDollEditorVisible] = useAtom(
    dollEditorVisibleAtom
  );
  const { logout } = useAuth();
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

  const ProfileButton: React.FC<ButtonProps & { isMobileMenu?: boolean }> = ({
    iconSrc,
    text,
    onClick,
    isActive,
    isMobileMenu = false,
  }) => {
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

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 flex items-center justify-between w-full h-[60px] bg-white shadow-lg px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Hunny's Closet"
              width={120}
              height={40}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center space-x-6">
            {buttonsData.map((button, index) => (
              <ProfileButton
                key={index}
                iconSrc={button.iconSrc}
                text={button.text}
                onClick={() => setCurrentView(button.view)}
                isActive={currentView === button.view}
              />
            ))}

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600"
              >
                <span>{user?.username || user?.email}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        {isLoggedIn && (
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-pink-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && isLoggedIn && (
        <div className="fixed top-[60px] left-0 right-0 bg-white shadow-lg z-40 md:hidden">
          <div className="flex flex-col p-4 space-y-4">
            {buttonsData.map((button, index) => (
              <ProfileButton
                key={index}
                iconSrc={button.iconSrc}
                text={button.text}
                onClick={() => {
                  setCurrentView(button.view);
                  setIsMobileMenuOpen(false);
                }}
                isActive={currentView === button.view}
                isMobileMenu={true}
              />
            ))}
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
