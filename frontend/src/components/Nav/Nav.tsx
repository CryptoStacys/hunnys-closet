//src/components/Nav.tsx

import Link from "./../Link/Link";
import { ConnectButton, useAccountModal } from "@rainbow-me/rainbowkit";
import { useAtom } from "jotai";
import { Tooltip } from "react-tooltip";
import {
  activeDollyComponentAtom,
  currentViewAtom,
  setCurrentViewAtom,
} from "../../data/store";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import {
  connectedAtom,
  dollEditorVisibleAtom,
  userAtom,
} from "../../data/store";
import { useWalletContext } from "@coinbase/waas-sdk-web-react";
import { useRouter } from "next/router";
import Image from "next/image";
import Help from "../Help/Help";
import CoinbaseButtonEth from "../Wallet/CoinbaseButtonEth";
import CoinbaseButtonPolygon from "../Wallet/CoinbaseButtonPolygon";
import CoinbaseButtonBase from "../Wallet/CoinbaseButtonBase";
import { fetchBalances } from "../../utils/fetchBalances";
import { trackLinkClick } from "../../utils/tracking";
import { User } from "../../data/global";
type NavProps = {
  rewardStatus: string;
};

export default function Nav({ rewardStatus }: NavProps) {
  const [connected, setConnected] = useAtom(connectedAtom);
  const [isMember, setIsMember] = useState(false);
  const [selected, setSelected] = useState<number | string>(-1); // Allow string for temporary ID
  const [copySuccess, setCopySuccess] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openAccountModal } = useAccountModal();
  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [ethBalance, setEthBalance] = useState("");
  const [polygonBalance, setPolygonBalance] = useState("");
  const [baseBalance, setBaseBalance] = useState("");
  const [activeDollyComponent] = useAtom(activeDollyComponentAtom);
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

  useEffect(() => {
    const updateBalances = async () => {
      if (user?.address) {
        const { ethBalance, polygonBalance, baseBalance } = await fetchBalances(
          user.address
        );
        setEthBalance(ethBalance);
        setPolygonBalance(polygonBalance);
        setBaseBalance(baseBalance);
      }
    };

    updateBalances();
  }, [user?.address]);

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
    {
      view: "bunnyclub",
      iconSrc: "/icons/BunnyClub.svg",
      text: "Bunny Club",
    },
    {
      view: "dollys",
      iconSrc: "/icons/Dollys.svg",
      text: "Create A Dolly",
    },
  ];
  console.log("From Nav:", currentView);
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

  const checkNFTOwnership = async (userAddress: any, provider: ethers.providers.Provider | ethers.Signer | undefined) => {
    const contractAddress = "0x95c1ab4c5ba7f583abb211239d3dd1beae806a11";
    const erc721ABI = ["function balanceOf(address owner) external view returns (uint256)"];
    const contract = new ethers.Contract(contractAddress, erc721ABI, provider);
  
    try {
      const balance = await contract.balanceOf(userAddress);
      return balance.gt(0); // Returns true if the balance is greater than 0
    } catch (error) {
      console.error("Error checking NFT ownership:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkMembership = async () => {
      const bunnyClubMembers = [
    "0xa7758394D8f7fD23b0d9F13E02427B514687394B",
    "0x55Abdc04655d590a48BCd1B996115448b71b7a84",
    "0x4eE115d0708924B4d3a83e45A428B0e3cb4348e9",
    "0x3a9a9b0a3148599dde1660476c6a47b1272247c6",
    "0xe17d0ac3F7C498924d4920bf279C01536686e014",
    "0x48a19c6B158491325E84c8837ED8Ba95A0403C13",
    "0x9d9d3bca9ae1126244786089d81ba9b289970238",
    "0x1975638d2dfdeee04d11adf6350187af9996dc7c",
    "0x6c6cD01ebbd02254C5Db5263797E366511992d29",
    "0x019Db3aA167aF3B91b6D72a05dD8437aaDd5225E",
    "0x247DBa0157DDD215d30d41A70411DbaFbFD6a0F9",
    "0x473e12B41bC13d3Ac98C4d06cD549Ba8a704dbf1",
    "0xBcDa92fF0D83448ad2B65C7a59D62FE3A18bF95f",
    "0x650d492E2F68A665a5dc029bc3f255FE5ec366Fc",
    "0x92926272A0A1A487DC3105bed4F1B01b50b56EEE",
    "0x5Cf422E9Ff1D79c98C479F8d4e8cbdC7B51E1550",
    "0x05CFB0DE5a75176733C7478e33d3d5999E5859F4",
    "0x78ae230336bb65B0023d78156708783402f303c2",
    "0x8b5e18b1A4BfF36085604e94C9bdE2054C62d026",
    "0x051f1F3920D196cc998D74A56978370b82432D25",
    "0x16272E839A5C29A3Fa90E670Cb599d233b6943aC",
    "0x745461ae3ee10F26e314735b6AF8ee41cD313E2d",
    "0x851a6FDb03A8F5dbCe902bBc8A7763599CBD73FA",
    "0xb62500D5a8b9629763d39a4D05784D6A47A72Ab1",
    "0x7b511800A8d8E7DE24Dd19de3103081824b6f41D",
    "0x1776727f3c60dD67B832F9E0614D7e028E32e063",
    "0x0DE9a66f0F9b714c5b987BDCb37A5E2EF1bDA67A",
    "0x660E2DC25C318946BF85DFa39AbB7c9bE009683F",
    "0xb85b346c305300291af065f8337e8ad6a6659ee3",
    "0xa5cC1E135C92a4DD1b32A328e1343eB4150461B6",
    "0xce05070e7afa163a029f87bde875084769729943",
    "0x973Ee618BFd3fb0e49c8A1a0CA2e2E6Aeb930aF3",
    "0x44b54f249a9ac0dff4e0d512c0c585b70ac47c30",
  ];

  const isBunnyClubMember = bunnyClubMembers
  .map((address) => address.toLowerCase())
  .includes(user!.address.toLowerCase());

const provider = new ethers.providers.JsonRpcProvider("https://base-mainnet.g.alchemy.com/v2/Y9AirihU_kvzbWDOO7RPs68bSH5DtFTG");
const ownsNFT = await checkNFTOwnership(user!.address, provider);

setIsMember(isBunnyClubMember || ownsNFT);
};

if (user?.address) {
checkMembership();
}
}, [user]);

  const handleCreateDollyClick = () => {
    // Make the DollEditor visible
    setDollEditorVisible(true);
  };
  const handleMobileMenuClick = (view: string) => {
    setIsMobileMenuOpen(false); // Always close the mobile menu

    if (router.pathname === "/") {
      // Directly change the hash when already on the dashboard and switching views
      window.location.hash = view;
    } else {
      // Use the Link component for navigating between / and /dollys or from /dollys to a dashboard view
      // This part is handled by the conditional rendering logic below
    }
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
          <Link to="/" onClick={() => setDropdownVisible(!dropdownVisible)}>
            <p className="indent-2">Dashboard</p>
          </Link>
          <a
            className="block px-2 py-2 cursor-default"
            onClick={handleAddressCopy}
          >
            Account Address:{" "}
            <div className="flex flex-row">
              {copySuccess ||
                (user?.address
                  ? `${user.address.substring(0, 6)}...${user.address.substring(
                      user.address.length - 4
                    )}`
                  : "No Address")}
              <Image
                src={"/icons/clickToCopy.svg"}
                alt={"Click To Copy"}
                width={20}
                height={20}
                className="ml-2"
              ></Image>
            </div>
          </a>
          <div className="flex px-2 py-2">
            <img src="/icons/eth.svg" alt="ETH" width="24" height="24" />
            <span className="ml-2 mr-6">Ξ{ethBalance.substring(0, 6)}</span>
            <Help
              {...{
                title: "What is this?",
                body: "This is your balance on the Ethereum Network!\n \nYou can use this to create your Dolly and save it in your digital wallet.\n\n Remember, this is simply a one-time fee for saving your Dolly. Afterwards, you can continue to save & update your Dolly for free, forever!",
                className: "",
                footer: (
                  <div className="flex flex-col justify-center m-auto items-center font-bold">
                    Need to purchase more?<br></br>
                    <br></br>
                    <CoinbaseButtonEth
                      destinationWalletAddress={user?.address || ""}
                    />
                  </div>
                ),
              }}
            />
          </div>
          <div className="flex items-center px-2 py-2">
            <img src="/icons/weth.svg" alt="WETH" width="24" height="24" />
            <span className="ml-2 mr-6">Ξ{polygonBalance.substring(0, 6)}</span>
            <Help
              {...{
                title: "What is this?",
                body: "This is your balance on the Polygon Network!\n \nYou can use this to purchase items inside of the Hunnys Closet Shop tab! All items purchased are saved right inside of your digital wallet and are for use for your Dolly.",
                className: "",
                footer: (
                  <div className="flex flex-col justify-center m-auto items-center font-bold">
                    Need to purchase more?<br></br>
                    <br></br>
                    <CoinbaseButtonPolygon
                      destinationWalletAddress={user?.address || ""}
                    />
                  </div>
                ),
              }}
            />
          </div>
          <div className="flex px-2 py-2">
            <img src="/icons/base.png" alt="ETH" width="24" height="24" />
            <span className="ml-2 mr-6">Ξ{baseBalance.substring(0, 6)}</span>
            <Help
              {...{
                title: "What is this?",
                body: "This is your balance on the Base Network!\n\nYou can use this to join the Hunnys Bunny Club!",
                className: "",
                footer: (
                  <><div className="flex flex-col justify-center m-auto items-center font-bold">
                    <Link
                      className="w-4/5 self-center"
                      to="/#bunnyclub"
                      trackId="bunnyClubJoin"
                      onClick={() => {
                        setCurrentView("bunnyclub");
                      }}
                    >
                      <div className="text-center">
                        <button className="bg-hunnys-yellow py-2 mb-8 w-4/5 self-center justify-center text-hunnys-blue luckiest shadow-md rounded-full px-4 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all">
                          Join the Club
                        </button>
                      </div>
                    </Link>
                  </div><div className="flex flex-col justify-center m-auto items-center font-bold">
                      Need to purchase more?<br></br>
                      <br></br>
                      <CoinbaseButtonBase
                        destinationWalletAddress={user?.address || ""} />
                    </div></>
                ),
              }}
            />
          </div>
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
        <div className="flex justify-between items-center gap-4">
          <Link to="/" className="" onClick={() => setCurrentView("profile")}>
            <h1 className=" btn font-title lg:text-3xl large:text-4xl md:text-2xl xs:text-xl tn:text-2xl leading-[1.2rem] flex-center md:leading-normal text-[#fff] ml-[10px]">
              {/* HUNNYS{" "} */}
              <div className="xs:hidden sm:inline">HUNNYS </div>
              <svg
                className="xs:w-7 xs:h-7 sm:mx-1 mx-0 fill-hunnys-yellow"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 1440"
              >
                <path d="M1347,420.9v95.3c-2.4,18.2-4.6,36.4-7,54.6c-12,83.3-40.2,163.1-82.9,234.2 c-62.4,108.5-145.7,197.9-236.2,280.8C903.4,1190.3,778,1284.4,646,1367.1c-2.9-6.5-5.7-12.3-8.2-18.3 c-58.2-136.5-139.6-260.6-240.1-366c-52.5-55.6-106.5-109.7-158.8-165.5c-42.4-43.4-77.1-94.3-102.6-150.6 c-30.3-72.1-42.1-151.4-34.2-229.9c3.3-56.5,20.5-111,49.9-158.3c42.8-67.2,104.1-104.5,177.9-119.9c88.3-20.2,180.6-6.1,259.9,39.6 c46.3,25.6,85.5,63.5,113.9,109.9c3.9-7.5,7.5-14.5,11-21.5c24.9-51.9,57.8-99.1,97.4-139.5c58.2-59.3,138.6-87.8,218.8-77.3 c80.7,7.1,156.3,45,212.7,106.6c53.3,58.5,87.9,133.3,98.9,213.8C1343.8,400.7,1345.7,410.9,1347,420.9z" />
              </svg>
              <div className="xs:hidden sm:inline">CLOSET</div>
              {/* CLOSET */}
            </h1>
          </Link>
        </div>
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
                      <Link
                        to="/"
                        onClick={() => setDropdownVisible(!dropdownVisible)}
                      >
                        <p className="indent-2">Dashboard</p>
                      </Link>
                      <a
                        className="block px-2 py-2 cursor-default"
                        onClick={handleAddressCopy}
                      >
                        Account Address:{" "}
                        <div className="flex flex-row">
                          {copySuccess ||
                            (user?.address
                              ? `${user.address.substring(
                                  0,
                                  6
                                )}...${user.address.substring(
                                  user.address.length - 4
                                )}`
                              : "No Address")}
                          <Image
                            src={"/icons/clickToCopy.svg"}
                            alt={"Click To Copy"}
                            width={20}
                            height={20}
                            className="ml-2"
                          ></Image>
                        </div>
                      </a>
                      <div className="flex px-2 py-2">
                        <img
                          src="/icons/eth.svg"
                          alt="ETH"
                          width="24"
                          height="24"
                        />
                        <span className="ml-2 mr-6">
                          Ξ{ethBalance.substring(0, 6)}
                        </span>
                        <Help
                          {...{
                            title: "What is this?",
                            body: "This is your balance on the Ethereum Network!\n \nYou can use this to create your Dolly and save it in your digital wallet.\n\n Remember, this is simply a one-time fee for saving your Dolly. Afterwards, you can continue to save & update your Dolly for free, forever!",
                            className: "",
                            footer: (
                              <div className="flex flex-col justify-center m-auto items-center font-bold">
                                Need to purchase more?<br></br>
                                <br></br>
                                <CoinbaseButtonEth
                                  destinationWalletAddress={user?.address || ""}
                                />
                              </div>
                            ),
                          }}
                        />
                      </div>
                      <div className="flex items-center px-2 py-2">
                        <img
                          src="/icons/weth.svg"
                          alt="WETH"
                          width="24"
                          height="24"
                        />
                        <span className="ml-2 mr-6">
                          Ξ{polygonBalance.substring(0, 6)}
                        </span>
                        <Help
                          {...{
                            title: "What is this?",
                            body: "This is your balance on the Polygon Network!\n \nYou can use this to purchase items inside of the Hunnys Closet Shop tab! All items purchased are saved right inside of your digital wallet and are for use for your Dolly.",
                            className: "",
                            footer: (
                              <div className="flex flex-col justify-center m-auto items-center font-bold">
                                Need to purchase more?<br></br>
                                <br></br>
                                <CoinbaseButtonPolygon
                                  destinationWalletAddress={user?.address || ""}
                                />
                              </div>
                            ),
                          }}
                        />
                      </div>
                      <div className="flex px-2 py-2">
            <img src="/icons/base.png" alt="ETH" width="24" height="24" />
            <span className="ml-2 mr-6">Ξ{baseBalance.substring(0, 6)}</span>
            <Help
              {...{
                title: "What is this?",
                body: "This is your balance on the Base Network!\n\nYou can use this to join the Hunnys Bunny Club!",
                className: "",
                footer: (
                  <><div className="flex flex-col justify-center m-auto items-center font-bold">
                    <Link
                      className="w-4/5 self-center"
                      to="/#bunnyclub"
                      trackId="bunnyClubJoin"
                      onClick={() => {
                        setCurrentView("bunnyclub");
                      }}
                    >
                      <div className="text-center">
                        <button className="bg-hunnys-yellow py-2 mb-8 w-4/5 self-center justify-center text-hunnys-blue luckiest shadow-md rounded-full px-4 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all">
                          Join the Club
                        </button>
                      </div>
                    </Link>
                  </div><div className="flex flex-col justify-center m-auto items-center font-bold">
                      Need to purchase more?<br></br>
                      <br></br>
                      <CoinbaseButtonBase
                        destinationWalletAddress={user?.address || ""} />
                    </div></>
                ),
              }}
            />
          </div>
                      {openAccountModal && (
                        <button
                          className="self-start indent-2 mt-4"
                          onClick={openAccountModal}
                          type="button"
                        >
                          Logout
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
          {connected && (
            <>
              <Link
                className="w-4/5 self-center xs:hidden md:inline"
                to="/dollys"
                trackId="createDolly"
              >
                <button
                  onClick={() => {
                    handleCreateDollyClick();
                    setCurrentView("");
                  }}
                  className="bg-hunnys-yellow py-1 w-full self-center text-hunnys-blue luckiest shadow-md rounded-full md:px-0 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Create A Dolly
                </button>
              </Link>
              <a
                href="https://discord.gg/hunnys"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackLinkClick("viewDiscord", user!, "https://discord.gg/hunnys")}
              >
                <Image
                  src={"/icons/NavDiscord.svg"}
                  alt={"Hunnys Discord"}
                  width={50}
                  height={50}
                  className="cursor-pointer xs:hidden md:inline"
                />
              </a>
              <a
                href="https://x.com/hunnysnft"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackLinkClick("viewX", user!, "https://x.com/hunnysnft")}
              >
                <Image
                  src={"/icons/NavX.svg"}
                  alt={"Hunnys X"}
                  width={38}
                  height={38}
                  className="cursor-pointer xs:hidden md:inline"
                />
              </a>
              {connected && isMember ? (
                <a
                href="https://closet.hunnys.io/#bunnyclub"
                onClick={() => trackLinkClick("viewBunnyClubExistingMember", user!)}
              >
                <Image
                  src="/icons/BunnyClubNavOn.svg"
                  alt="Bunny Club Member"
                  width={70}
                  height={70}
                  className="xs:hidden md:inline"
                />
                </a>
              ) : (
                <a
                  href="https://closet.hunnys.io/#bunnyclub"
                  onClick={() => trackLinkClick("viewBunnyClub", user!)}
                >
                  <Image
                    src={"/icons/BunnyClubNavOff.svg"}
                    alt={"Bunny Club Status"}
                    width={70}
                    height={70}
                    className="cursor-pointer xs:hidden md:inline"
                  />
                </a>
              )}
              <div
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
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
                <div className="absolute top-full left-0 w-full bg-white rounded-b-md shadow-lg text-center">
                  {currentView === "dollys" ? (
                    // When on /dollys, show only the Dashboard option
                    <div className="my-2">
                      <Link
                        to="/"
                        className="w-full text-4xl text-black luckiest"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setCurrentView("profile");
                        }}
                      >
                        <p className="indent-2">Back to Dashboard</p>
                      </Link>
                    </div>
                  ) : (
                    // Otherwise, show the full list of options
                    buttonsData.map((button, index) => (
                      <div key={index} className="my-6">
                        {button.view === "dollys" ? (
                          // Use Link for navigating to /dollys
                          <Link
                            className="bg-hunnys-yellow py-2 w-full self-center text-hunnys-blue luckiest shadow-md rounded-full px-4 text-2xl hover:shadow-lg hover:scale-[1.02] transition-all"
                            to="/dollys"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setCurrentView("dollys");
                            }}
                          >
                            {button.text}
                          </Link>
                        ) : (
                          // Directly handle hash change without using Link when already on the dashboard
                          <button
                            className="w-full text-4xl text-black luckiest"
                            onClick={() => handleMobileMenuClick(button.view)}
                          >
                            {button.text}
                          </button>
                        )}
                      </div>
                    ))
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
