import React, { useEffect, useState } from "react";
import axios from "axios";
import BunnyClubBuy from "../Mint/BunnyClubBuy";
import { useAtom } from "jotai";
import { modalAtom, userAtom } from "../../data/store";
import { fetchBalances } from "../../utils/fetchBalances";
import CoinbaseButtonBase from "../Wallet/CoinbaseButtonBase";
import Testimonials from "../Card/Testimonials";
import { ethers } from "ethers";
import { trackLinkClick } from "../../utils/tracking";

const BunnyClubView = () => {
  const [user] = useAtom(userAtom);
  const [membershipOptions, setMembershipOptions] = useState([]);
  const [ethPrice, setEthPrice] = useState(null);
  const [modal, modalSet] = useAtom(modalAtom);
  const [baseBalance, setBaseBalance] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const fetchMembershipOptions = async () => {
    try {
      // URL for your Google Sheet data (update with your actual URL)
      const url =
        "https://sheets.googleapis.com/v4/spreadsheets/1LWUBUTjYHE1SffIWol_gj3j7KxkG7aXnCl7sf2DU6wA/values/A2:I262?key=AIzaSyAjknT53sMDEOdJ3YtCmjgP3VeSTvSGB3U";
      const response = await axios.get(url);
      const options = response.data.values; // Adjust based on actual structure
      setMembershipOptions(options);
    } catch (error) {
      console.error("Failed to fetch membership options:", error);
    }
  };

  const fetchEthPrice = async () => {
    try {
      // Update this URL to point to your backend service
      const response = await axios.get(
        "https://staging-hunnys-closet-2-548f5ed67a1b.herokuapp.com/getEthPrices"
      );
      const ethPriceInUsd = response.data.ethPriceInUsd;
      setEthPrice(ethPriceInUsd);
      return ethPriceInUsd;
    } catch (error) {
      console.error("Failed to fetch ETH price from backend:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchMembershipOptions();
    fetchEthPrice();
    fetchBaseBalance();
  }, []);

  const fetchBaseBalance = async () => {
    const balances = await fetchBalances(user!.address);
    setBaseBalance(balances.baseBalance);
  };

  const cardClass =
    "border rounded-xl max-w-[300px] bg-white hover:shadow-lg transition-transform duration-500 hover:scale-105 m-8 overflow-hidden";
  const imageClass = "m-auto rounded-xl";
  const titleClass = "text-3xl font-bold mb-2 mt-2 text-left luckiest";

  return (
    <div className="grid grid-col max-w-6xl mx-auto">
      <h2 className="w-full text-center my-4 luckiest xs:text-[24px] md:text-[48px]">
        Join the Bunny Club
      </h2>
      <p className="text-center font-poppins text-xl mx-16">
        The most fun way to expand your wardrobe with Hunnys Closet 💛
      </p>
      <div className="grid xs:grid-col md:grid-cols sm:grid-cols-3 justify-center">
        {membershipOptions.map((option, index) => (
          <div key={index} className={cardClass}>
            <img
              src={option[2]}
              alt={`Membership for ${option[0]} months`}
              className={imageClass + " p-4"}
            />
            <div className="p-4">
              <h3 className={titleClass}>
                {option[0]} months: ${option[1]} USD
              </h3>
              {ethPrice && (
                <BunnyClubBuy
                  months={option[0]}
                  price={option[1]}
                  ethPrice={ethPrice}
                  baseBalance={baseBalance}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <h2 className="w-full text-center my-4 luckiest xs:text-[24px] md:text-[48px]">
        What is Bunny Club?
      </h2>
      <div className="flex justify-start">
        <p className="font-poppins  mx-8 text-left xs:text-lg md:text-xl">
          <ul className="list-none">
          {[
            "Receive multiple Closet Shop drops monthly, right to your wallet",
            "Access to members-only drops",
            "Bunny Club Discord Role",
            "Monthly Bunny Club Seasons NFT & Item Set",
            "Bunny Club Marina Seasons NFT & Item Set",
            "Eligible for spontaneous raffles & giveaways",
            "20% off all Hunnys Closet Shop Items",
          ].map((item) => (
            <li key={item} className="flex items-center">
              <span className="mr-2">✨</span> <span>{item}</span>
            </li>
          ))}
        </ul>
        </p>
      </div>
      
      <h2 className="w-full text-center mt-16 luckiest xs:text-[24px] md:text-[48px]">
        What Our Members Say
      </h2>
      {/* Testimonials */}
      <Testimonials />
      <h2 className="w-full text-center my-4 luckiest xs:text-[24px] md:text-[48px]">
        How it works
      </h2>
      <div className="flex justify-start mx-8">
        <p className="font-poppins text-left xs:text-lg md:text-xl">
          <ul className="list-none">
          {[
            "Membership begins upon purchase",
            "Items will be sent to whichever wallet is holding the token at that moment",
            "Hold it for yourself, gift it, or share it with a friend",
            "Bonus: you will receive all items from the month you purchase in",
            "Ex: purchasing on June 30? You will receive all content from June 1-29",
            "Membership cost in ETH is dynamically updated at time of purchase to match USD price",
            "Drops will primarily be received on Polygon on the Hunnys Closet Shop Address: 0x11bc733e719198e2b3746f6841d2818ca87af6da",
          ].map((item) => (
            <li key={item} className="flex items-center">
              <span className="mr-2">✨</span> <span>{item}</span>
            </li>
          ))}
        </ul>
        </p>
      </div>
      <h2 className="text-center mt-12 mb-4 luckiest xs:text-[24px] md:text-[48px]">
        Payment Options
      </h2>
      <p className="text-center font-poppins text-xl mx-16">
        Memberships above paid in ETH, specifically on Base. Want to pay with PayPal / Credit
        Card instead? <br></br>
        <br></br>
        <a
          className="underline"
          target="_blank"
          href="https://hunnys.io/bunnyclub"
          onClick={() =>
            trackLinkClick(
              "bunnyClubFiat",
              user!,
              "https://hunnys.io/bunnyclub"
            )
          }
        >
          Visit our home page for more payment options!
        </a>
      </p>
      {/* Base Chain Balance */}
      <div className="my-8 justify-center self-center text-center">
        <h3 className="text-xl font-bold font-poppins">Current Balance:</h3>
        <p className="text-lg font-poppins">Ξ{baseBalance}</p>
        <CoinbaseButtonBase destinationWalletAddress={user!.address} />
      </div>
    </div>
  );
};

export default BunnyClubView;
