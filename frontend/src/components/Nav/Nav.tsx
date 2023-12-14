import Link from "./../Link/Link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAtom } from "jotai";
import { Tooltip } from "react-tooltip";
import React, { useState, useEffect } from "react";
import { connectedAtom } from "../../data/store";
import { mode } from "../../data/config";

type NavProps = {
  rewardStatus: string;
};

export default function Nav({ rewardStatus }: NavProps) {
  const [connected] = useAtom(connectedAtom);
  const [shouldWiggle, setShouldWiggle] = useState(true);

    // This function returns the emoji based on reward status
    const getEmojiForStatus = (status: string): string => {
      type RewardStatus = "Bunny" | "Bunny Knight" | "Bunny Duke" | "Royal Bunny" | "None";
      const statusMapping: Record<RewardStatus, string> = {
          "Bunny": "🐰",
          "Bunny Knight": "⚔️",
          "Bunny Duke": "🏰",
          "Royal Bunny": "👑",
          "None": "👋",
      };
      return statusMapping[status as RewardStatus] || "👋"; // Default to wave if status is unknown
  };
  
  
    // To stop the wiggle effect after 3 seconds
    useEffect(() => {
      setTimeout(() => {
        setShouldWiggle(false);
      }, 15000);
    }, []);

  return (
    <nav className="top-2 fixed flex-center z-50 w-full box-border">
      <div
        // className="max-w-[1160px] px-2 mx-6 flex justify-between items-center w-full box-border py-[6px] shadow-md bg-[#6510F1] rounded-2xl"
        className="max-w-[1250px] px-2 mx-6 flex justify-between items-center w-full box-border py-[6px] shadow-md bg-[#6510F1] rounded-2xl"
        // style={{
        //   backdropFilter: "blur(10px)",
        // }}
      >
        <Link to="/" className="">
          <h1 className=" btn font-title text-md md:text-4xl leading-[1.2rem] flex-center md:leading-normal text-[#fff] ml-[10px]">
            {/* HUNNYS{" "} */}
            <div className="mobile-hide">HUNNYS{" "}</div>
            <svg
              className="sm:w-7 sm:h-7 sm:mx-1 w-10 h-10 mx-0 fill-hunnys-yellow"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 1440"
              // style="fill: rgb(0, 0, 0);"
              // original_string_length="787"
            >
              <path
                d="M1347,420.9v95.3c-2.4,18.2-4.6,36.4-7,54.6c-12,83.3-40.2,163.1-82.9,234.2 c-62.4,108.5-145.7,197.9-236.2,280.8C903.4,1190.3,778,1284.4,646,1367.1c-2.9-6.5-5.7-12.3-8.2-18.3 c-58.2-136.5-139.6-260.6-240.1-366c-52.5-55.6-106.5-109.7-158.8-165.5c-42.4-43.4-77.1-94.3-102.6-150.6 c-30.3-72.1-42.1-151.4-34.2-229.9c3.3-56.5,20.5-111,49.9-158.3c42.8-67.2,104.1-104.5,177.9-119.9c88.3-20.2,180.6-6.1,259.9,39.6 c46.3,25.6,85.5,63.5,113.9,109.9c3.9-7.5,7.5-14.5,11-21.5c24.9-51.9,57.8-99.1,97.4-139.5c58.2-59.3,138.6-87.8,218.8-77.3 c80.7,7.1,156.3,45,212.7,106.6c53.3,58.5,87.9,133.3,98.9,213.8C1343.8,400.7,1345.7,410.9,1347,420.9z"
                // style="fill: rgb(255, 222, 89);"
              />
            </svg>
            <div className="mobile-hide">CLOSET</div>
            {/* CLOSET */}
          </h1>
        </Link>
        <div className="flex justify-between items-center rewardStatus">
          {connected && (
            <>
              {/* {["dollys", "tokens", "inventory"].map((item, index) => ( */}
              <div data-tooltip-id="rewardsTooltip" data-tooltip-place="bottom">
              <span className={`emoji-display ${shouldWiggle ? "wiggle" : ""}`}>
                {getEmojiForStatus(rewardStatus)}
              </span>
              <Tooltip id="rewardsTooltip">
              <div style={{
    display: 'flex', 
    flexDirection: 'column',
    width: '350px',  // Adjust this width to your needs
    wordWrap: 'break-word',
    whiteSpace: 'normal'
  }}>
    {rewardStatus === "Bunny" && (
      <>
        You&apos;re off to a great start, Bunny! Once you hold at least 3 Hunnys 10k NFTs in your wallet,
        you automatically double your monthly Hunnys Seasons rewards, which brings twice as much
        content for free to Hunnys Closet each month!
      </>
    )}
    {rewardStatus === "Bunny Knight" && (
      <>
        Way to go, Bunny Knight! You&apos;re earning double the monthly Hunnys Seasons rewards.
        Keep it up and once you hold 7 Hunnys 10k NFTs, you&apos;ll earn even more!
      </>
    )}
    {rewardStatus === "Bunny Duke" && (
      <>
        Impressive, Bunny Duke! You&apos;re earning triple the monthly Hunnys Seasons rewards.
        Just a few more Hunnys 10k NFTs and you&apos;ll reach the top tier!
      </>
    )}
    {rewardStatus === "Royal Bunny" && (
      <>
        Congratulations, you&apos;re a Royal Bunny! You are currently in the highest tier of rewards
        from holding Hunnys 10k NFTs.
      </>
    )}
    {rewardStatus === "None" && (
      <>
        Welcome to Hunnys Closet!
      </>
    )}
    <br />
    <br />
    This status informs you of how many monthly rewards (Hunnys Seasons NFTs)
    you will receive automatically to this address, so long as you continue to hold
    them through the end of each month!
    <br />
    <br />
    Bunny = 1+ Hunnys = 1 Monthly Reward
    <br />
    Bunny Knight = 3+ Hunnys = 2 Monthly Rewards
    <br />
    Bunny Duke = 7+ Hunnys = 3 Monthly Rewards
    <br />
    Royal Bunny = 12+ Hunnys = 4 Monthly Rewards
  </div>
</Tooltip>
                
                </div>
              {["dollys", "inventory"].map((item, index) => (
                <Link
                  to={"/" + item}
                  key={index}
                  className="link-btn navLinks text-[#fff] font-title uppercase hover:bg-[#ffd54b] transition inline-block text-2xl font-semibold font-content mx-[5px] sm:px-3 px-0 py-[6px] rounded-xl"
                >
                  {item}
                </Link>
              ))}
              <a
                  href="https://buy.hunnys.io/polygon/collection/0x0b54fbd0139a2da92ff41fd9ed56adcf89d87001"
                  target="_blank"
                  className="link-btn navLinks text-hunnys-yellow font-title uppercase hover:bg-hunnys-light-purple transition inline-block text-2xl font-semibold font-content mx-[5px] sm:px-3 px-0 py-[6px] rounded-xl"
                >Shop
                </a>
            </>
          )}

          {mode === "dev" && (
            <>
              <div className="ml-[3px] hidden md:inline-block">
                <ConnectButton accountStatus="address" showBalance={false} chainStatus="name" />
              </div>
              <div className="ml-[3px] md:hidden inline-block">
                <ConnectButton accountStatus="address" showBalance={false} chainStatus="name" />
              </div>
            </>
          )}

          {mode === "prod" && (
            <div className="ml-[3px] md:inline-block">
              <ConnectButton accountStatus={{smallScreen: 'avatar',largeScreen: 'full',}} showBalance={false} chainStatus="name" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
