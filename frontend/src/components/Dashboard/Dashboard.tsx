// import bg from "./../assets/img/bg.png";
// import crown from "./assets/crown.png";
// import one from "./assets/1.webp";
// import two from "./assets/2.webp";
// import three from "./assets/3.webp";
// import tutorial1 from "./assets/tutorial1.webp";
// import tutorial2 from "./assets/tutorial2.webp";
// import tutorial3 from "./assets/tutorial3.webp";
// import hunnysGif from "./assets/Hunnys_Dressup_Doll_Logo.gif";
// import hunnysDollysSeasons from "./assets/Hunnys_Digital_Dolly_Doll_Collectible_NFT.png";
// import arrow from "./assets/arrow.webp";

const bg = "/assets/img/bg.png";
const crown = "/assets/crown.png";
const dorothy = "/assets/DorothyDemo.png";
const wendy = "/assets/WendyWerewolf.png";
const retro = "/assets/RetroMonstys.png";
const hunnyweenMain = "/assets/hunnyweenMain.png";
const hunnyweengif = "/assets/HunnyweenGIF.gif";
const one = "/assets/1.webp";
const two = "/assets/2.webp";
const three = "/assets/3.webp";
const rbCheer = "/assets/rbCheer.png";
const BQset = "/assets/BQset.gif";
const rbBikini = "/assets/rbBikini.png";
const rbHorny = "/assets/rbHorny.png";
const bdPink = "/assets/bdPink.png";
const bdSailor = "/assets/bdSailor.png";
const bkAlien = "/assets/bkAlien.png";
const bkBubblegum = "/assets/bkBubblegum.png";
const bkFlowerCrown = "/assets/bkFlowerCrown.png";
const tutorial1 = "/assets/tutorial1.webp";
const tutorial2 = "/assets/tutorial2.webp";
const tutorial3 = "/assets/tutorial3.webp";
const tutorial4 = "/assets/tutorial4.webp";
const hunnysGif = "assets/Hunnys_Dressup_Doll_Logo.gif";
const ClosetHunnyweenHero = "/assets/ClosetHunnyweenHero.png";
const hunnysDollysSeasons = "/assets/Hunnys_Digital_Dolly_Doll_Collectible_NFT.png";
const hunnysDollysSeasons2 = "/assets/dollys750.png";
const hunnysDollysSeasons3 = "/assets/dollys430.png";
const arrow = "/assets/arrow.webp";


import Link from "../Link/Link";
import Image from 'next/image';

type DashboardProps = {
  rewardStatus: string;
};

function getButtonMessage(rewardStatus: string) {
  switch (rewardStatus) {
      case "Bunny":
          return "JOURNEY TOWARDS BUNNY KNIGHT!";
      case "Bunny Knight":
          return "ASCEND TO BUNNY DUKE!";
      case "Bunny Duke":
          return "BECOME A ROYAL BUNNY!";
      case "Royal Bunny":
          return "EXPAND YOUR COLLECTION!";
      default:
          return "BECOME A MEMBER";
  }
}


function Button({ children, colors }: any) {
  let displayColors = "bg-hunnys-yellow text-hunnys-blue";
  if (colors === "inverted") {
    displayColors = "bg-hunnys-blue text-hunnys-yellow";
  }
  return (
    <button
      className={`${displayColors} w-full font-title shadow-md rounded-full px-8 py-1 text-4xl hover:shadow-lg hover:scale-[1.05] hover:rotate-[0.5deg] transition-all`}
    >
      {children}
    </button>
  );
}

function LeafIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      viewBox="503.3 549.1 990.3 938.1"
      zoomAndPan="magnify"
      className="fill-hunnys-blue w-24"
    >
      <path
        d="M 1272.449219 716.25 C 805.5625 714.148438 554.917969 932.128906 533.472656 1383.371094 C 533.203125 1389.039062 524.90625 1389.351562 524.113281 1383.730469 C 503.285156 1236.300781 507.316406 1101.941406 544.734375 985.140625 C 668.246094 599.648438 1139.339844 549.078125 1473.601562 671.078125 C 1490.261719 677.160156 1493.628906 698.648438 1479.78125 709.730469 C 1219.050781 918.210938 1254.539062 1487.21875 619.917969 1240.621094 C 719.035156 932.589844 922.242188 741.71875 1272.449219 716.25"
        fillRule="evenodd"
      />
    </svg>
  );
}
function ShopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      viewBox="2.0 4.0 40.0 40.0"
      zoomAndPan="magnify"
      className="fill-hunnys-blue w-24"
    >
      <path d="M14 36c-2.21 0-3.98 1.79-3.98 4s1.77 4 3.98 4 4-1.79 4-4-1.79-4-4-4zm-12-32v4h4l7.19 15.17-2.7 4.9c-.31.58-.49 1.23-.49 1.93 0 2.21 1.79 4 4 4h24v-4h-23.15c-.28 0-.5-.22-.5-.5 0-.09.02-.17.06-.24l1.79-3.26h14.9c1.5 0 2.81-.83 3.5-2.06l7.15-12.98c.16-.28.25-.61.25-.96 0-1.11-.9-2-2-2h-29.57l-1.9-4h-6.53zm32 32c-2.21 0-3.98 1.79-3.98 4s1.77 4 3.98 4 4-1.79 4-4-1.79-4-4-4z" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg className="fill-hunnys-blue w-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1440">
      <path d="M1347,420.9v95.3c-2.4,18.2-4.6,36.4-7,54.6c-12,83.3-40.2,163.1-82.9,234.2 c-62.4,108.5-145.7,197.9-236.2,280.8C903.4,1190.3,778,1284.4,646,1367.1c-2.9-6.5-5.7-12.3-8.2-18.3 c-58.2-136.5-139.6-260.6-240.1-366c-52.5-55.6-106.5-109.7-158.8-165.5c-42.4-43.4-77.1-94.3-102.6-150.6 c-30.3-72.1-42.1-151.4-34.2-229.9c3.3-56.5,20.5-111,49.9-158.3c42.8-67.2,104.1-104.5,177.9-119.9c88.3-20.2,180.6-6.1,259.9,39.6 c46.3,25.6,85.5,63.5,113.9,109.9c3.9-7.5,7.5-14.5,11-21.5c24.9-51.9,57.8-99.1,97.4-139.5c58.2-59.3,138.6-87.8,218.8-77.3 c80.7,7.1,156.3,45,212.7,106.6c53.3,58.5,87.9,133.3,98.9,213.8C1343.8,400.7,1345.7,410.9,1347,420.9z" />
    </svg>
  );
  // do
}

export default function Dashboard({ rewardStatus }: DashboardProps) {
  return (
    <div className="flex justify-center items-center w-max-full px-6 mx-auto">
      <div className="relative max-w-[1250px] w-full mx-auto">
      {/* <div className="relative max-w-[1160px] w-full mx-auto"> */}   
      <div className="grid sm:grid-cols-[0fr_2fr] dashboardHero aspect-w-16 aspect-h-9 grid-cols-[1fr] gap-2 mt-2 mb-2" style={{gridAutoRows: '1fr'}}>
      
          
          
          <div className="relative text-white py-8 rounded-2xl mb-2 overflow-hidden">
            <div className="mx-auto px-8 max-w-[360px] rounded-xl">
            
              
            </div>
            <div className="absolute bottom-8 w-full z-50 px-8">
              <div className="max-w-[300px] mx-auto flex justify-center items-center">
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[1fr] sm:grid-cols-[2fr_1fr] bg-hunnys-blue rounded-2xl relative mb-2">
          <div className="grid grid-cols-[1fr] sm:grid-cols-2 py-8 px-5 mb-12" style={{ zIndex: 1}}>
            <div className="px-5">
            {rewardStatus === "None" ? ( <>
            <h1 className="sm:text-5xl text-2xl font-title text-white mb-4" style={{ whiteSpace: 'nowrap' }}>
    WELCOME, <span className="text-hunnys-yellow">CUPCAKE!</span>
</h1>

</>) : ( <>
<h1 className="sm:text-5xl text-2xl font-title text-white mb-4" style={{ whiteSpace: 'nowrap' }}>
    WELCOME, <span className="text-hunnys-yellow">{rewardStatus}!</span>
</h1></>)}
            </div>


              <div>
                {/* Empty div */}
              </div>
          
            {[
              { text: "CREATE A DOLLY", img: tutorial1, desc: 'Create your Dolly base that lives in your digital wallet! The only cost is your gas fee.' },
              { text: "MIX N' MATCH", img: tutorial2, desc: 'Customize your Dolly with items you own in your digital wallet. Dye, style and unleash your creativity!' },
              { text: "SAVE & SHARE", img: tutorial3, desc: 'Save your Dolly in your digital wallet and show off your updates for all to see. Enjoy limitless revisions with no additional cost!' },
              { text: "COLLECT & GROW", img: tutorial4, desc: 'Collect new traits by buying Hunnys 10k, OGs, Seasons, Stacys and other digital collectibles to unlock more traits!' },
            ].map((item, index) => (
              <div className="flex justify-center items-center px-3 mb-5" key={'home-item-' + index} style={{ flexDirection: 'column'}}>
                <div className="relative">
                  <div style={{ backgroundColor: '#C9A9FF'}} className="z-50 absolute top shadow-md w-10 h-10 rounded-full flex justify-center items-center font-title text-lg top-[-6px] left-[-6px]">
                    {index + 1}
                  </div>
                  <div className="z-10 relative shadow-lg overflow-hidden w-[100px] h-[100px] rounded-full">
                    <Image width={600} height={600} src={item.img} alt="" />
                  </div>
                </div>
                  <div className="text-center mt-3 font-title text-4xl text-white">{item.text}</div>
                  <div className="text-center mt-3 text-lg text-white">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center flex-wrap mobie-hunnys-wrapper">
            <div>
              {/* <h1 className="text-5xl font-title text-white mb-4">
                How to <span className="text-hunnys-yellow">use</span>
              </h1> */}
              <img className="mikagif" src={hunnysGif} alt="" />
            </div>
          </div>

          <div className="hunnys-dolly-link-btn">
            <Link to="/dollys">
              <button
                  className={`bg-hunnys-yellow text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-1 text-4xl hover:shadow-lg hover:scale-[1.02] transition-all`}
                >
                  CREATE A DOLLY
                </button>
            </Link>
          </div>

          
        </div>

        {/* <div className="grid grid-cols-[2fr_3fr] gap-2">
          <div className="relative text-white py-2 bg-hunnys-green shadow-md text-center rounded-2xl mb-2 overflow-hidden h-[350px]">
            <span className="relative z-50 pl-3 font-bold font-title text-2xl ">December theme</span>
            <div className="absolute bottom-4 w-full z-50 px-8">
              <div className="max-w-[300px] mx-auto flex justify-center items-center">
                <Button>Shop the drop</Button>
              </div>
            </div>
            <Image className="absolute bottom-0 z-10" src="https://hunnys.io/wp-content/uploads/2022/11/6.png" alt="" />
          </div>
          <div className="relative text-white py-2 bg-hunnys-light-blue shadow-md text-center rounded-2xl mb-2 overflow-hidden h-[350px]">
            <div className="absolute bottom-4 w-full z-50 px-8 ">
              <div className="max-w-[300px] mx-auto flex justify-center items-center">
                <Button>Shop now</Button>
              </div>
            </div>
            <img
              className="absolute bottom-0 h-full z-10"
              src="https://hunnys.io/wp-content/uploads/2022/11/6.png"
              alt=""
            />
          </div>
        </div> */}

        <div className="grid gap-2 rounded-3xl bg-hunnys-blue shadow-md">
        {rewardStatus === "None" ? (
          // This is your original content for the "None" status
        <>
          <div className="relative text-white overflow-hidden font-bold">
            <div className="grid sm:grid-cols-[2fr_3fr] grid-cols-[1fr] px-12 py-12 gap-12">
              <div className="grid grid-cols-[60px_1fr]">
                <Image width={600} height={600} src={crown} alt="crown" className=" p-3" />
                <div className="flex items-center">
                  <div className="ml-2 text-4xl font-title ">
                    BECOME A <span className="text-hunnys-yellow">MEMBER</span>
                  </div>
                </div>
              </div>
              <div className="text-xl" style={{wordWrap: 'break-word',
    whiteSpace: 'break-spaces'}}>
                Buy a Hunnys 10k to automatically recieve monthly art airdrops. <br />
                Each airdrop unlocks exclusive closet items!
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-[3fr_1fr_3fr_1fr_3fr] grid-cols-[1fr] pb-12">
            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  OWN A 10K <br />
                  <br />
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={one} className="w-full h-full" alt="" />
                </div>
              </div>
              <div></div>
            </div>
            <div className="flex justify-center items-center">
              <Image width={600} height={600} className="max-w-[40px] mt-[80px] rotate-180" src={arrow} alt="" />
            </div>

            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  GET MONTHLY <br />
                  THEMED AIRDROPS
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={two} className="w-full h-full" alt="" />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Image width={600} height={600} className="max-w-[40px] mt-[80px] rotate-180" src={arrow} alt="" />
            </div>

            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  UNLOCK EXCLUSIVE <br />
                  CLOSET ITEMS
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={three} className="w-full h-full" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-12 mx-auto max-w-[85%] w-full">
            <a href="https://buy.hunnys.io/ethereum/collection/0x5dfeb75abae11b138a16583e03a2be17740eaded" target="_blank">
              <Button>BECOME A MEMBER</Button>
            </a>
          </div>
          </>
        ) : (
          // This is the new content for users with a reward status
          <>
          {rewardStatus === "Bunny" && (
              // Placeholder content for "Bunny"
              <>
                  <div className="relative text-white overflow-hidden font-bold">
            <div className="grid sm:grid-cols-[2fr_3fr] grid-cols-[1fr] px-12 py-12 gap-12">
              <div className="grid grid-cols-[60px_1fr]">
                <Image width={600} height={600} src={crown} alt="crown" className=" p-3" />
                <div className="flex items-center">
                  <div className="ml-2 text-5xl font-title ">
                    OH HEYYY, <span className="text-hunnys-yellow">BUNNY!</span>
                  </div>
                </div>
              </div>
              <div className="text-xl" style={{wordWrap: 'break-word',
    whiteSpace: 'break-spaces'}}>
                You&apos;re off to a great start, Bunny! Once you hold at least <span className="text-hunnys-yellow">THREE</span> Hunnys 10k NFTs in your wallet,
        you automatically double your monthly Hunnys Seasons rewards. <br /> <br />
        That means TWICE as much content for FREE in Hunnys Closet - every single month! Here&apos;s how it works...
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-[3fr_1fr_3fr_1fr_3fr] grid-cols-[1fr] pb-12">
            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  OWN A 10K <br />
                  <br />
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={one} className="w-full h-full" alt="" />
                </div>
              </div>
              <div></div>
            </div>
            <div className="flex justify-center items-center">
              <Image width={600} height={600} className="max-w-[40px] mt-[80px] rotate-180" src={arrow} alt="" />
            </div>

            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  GET MONTHLY <br />
                  THEMED AIRDROPS
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={two} className="w-full h-full" alt="" />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Image width={600} height={600} className="max-w-[40px] mt-[80px] rotate-180" src={arrow} alt="" />
            </div>

            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  UNLOCK EXCLUSIVE <br />
                  CLOSET ITEMS
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={three} className="w-full h-full" alt="" />
                </div>
              </div>
            </div>
          </div>
              </>
          )}

          {rewardStatus === "Bunny Knight" && (
              // Placeholder content for "Bunny Knight"
              <>
                  <div className="relative text-white overflow-hidden font-bold">
            <div className="grid sm:grid-cols-[2fr_3fr] grid-cols-[1fr] px-12 py-12 gap-12">
              <div className="grid grid-cols-[60px_1fr]">
                <Image width={600} height={600} src={crown} alt="crown" className=" p-3" />
                <div className="flex items-flex">
                  <div className="ml-2 text-5xl font-title ">
                    CHEERS, <span className="text-hunnys-yellow">BUNNY KNIGHT!</span>
                  </div>
                </div>
              </div>
              <div className="text-xl" style={{wordWrap: 'break-word',
    whiteSpace: 'break-spaces'}}>
                Way to go, Bunny Knight! You&apos;re earning double the monthly Hunnys Seasons rewards. <br /><br />
                Did you know that being a Bunny Knight means you receive <span className="text-hunnys-yellow">TWO</span> free Hunnys Seasons rewards, delivered to you for free, every single month? <br /><br />
                Once you&apos;ve collected at least <span className="text-hunnys-yellow">SEVEN</span> Hunnys 10k tokens, we&apos;ll be calling you Bunny Duke! <br /><br />
                Here are some types of Hunnys you might be interested in to get you there!
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-[3fr_1fr_3fr_1fr_3fr] grid-cols-[1fr] pb-12 px-8">
            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  Alien Hunnys
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={bkAlien} className="w-full h-full" alt="" />
                </div>
              </div>
              <div></div>
            </div>
            <div className="flex justify-center items-center">
            </div>

            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  BubbleGum Babes
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={bkBubblegum} className="w-full h-full" alt="" />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
            </div>

            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  Flower Crowns
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={bkFlowerCrown} className="w-full h-full" alt="" />
                </div>
              </div>
            </div>
          </div>
              </>
          )}

          {rewardStatus === "Bunny Duke" && (
              // Placeholder content for "Bunny Duke"
              <>
                  <div className="relative text-white overflow-hidden font-bold">
            <div className="grid sm:grid-cols-[2fr_3fr] grid-cols-[1fr] px-12 py-12 gap-12">
              <div className="grid grid-cols-[60px_1fr]">
                <Image width={600} height={600} src={crown} alt="crown" className=" p-3" />
                <div className="flex items-flex">
                  <div className="ml-2 text-5xl font-title ">
                    GREETINGS, <span className="text-hunnys-yellow">BUNNY DUKE!</span>
                  </div>
                </div>
              </div>
              <div className="text-xl" style={{wordWrap: 'break-word',
    whiteSpace: 'break-spaces'}}>
                It greatly pleases the Queen to have you in her presence, Bunny Duke! <br /><br />
                Did you know that being a Bunny Duke means you receive <span className="text-hunnys-yellow">THREE</span> free Hunnys Seasons rewards, delivered to you for free, every single month? <br /><br />
                You&apos;re almost at the highest tier of Monthly Rewards; a Royal Bunny. <br /><br />
                Ready to receive your crown? As soon as you&apos;ve collected at least 12 Hunnys 10k tokens, check back here - we&apos;ll be ready to celebrate your Royal status! <br/> <br/>
                Here are some you might like:
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-[3fr_1fr_3fr_1fr_3fr] grid-cols-[1fr] pb-12 px-8">
            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  Cheer Squad
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={rbCheer} className="w-full h-full" alt="" />
                </div>
              </div>
              <div></div>
            </div>
            <div className="flex justify-center items-center">
            </div>

            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  Pretty in Pink
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={bdPink} className="w-full h-full" alt="" />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
            </div>

            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  Sailor Scouts
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={bdSailor} className="w-full h-full" alt="" />
                </div>
              </div>
            </div>
          </div>
              </>
          )}

          {rewardStatus === "Royal Bunny" && (
              // Placeholder content for "Royal Bunny"
              <>
                  <div className="relative text-white overflow-hidden font-bold">
            <div className="grid sm:grid-cols-[2fr_3fr] grid-cols-[1fr] px-12 py-12 gap-12">
              <div className="grid grid-cols-[60px_1fr]">
                <Image width={600} height={600} src={crown} alt="crown" className=" p-3" />
                <div className="flex items-flex">
                  <div className="ml-2 text-5xl font-title ">
                    OMG, YOU&apos;RE A <span className="text-hunnys-yellow">ROYAL BUNNY!</span>
                  </div>
                </div>
              </div>
              <div className="text-xl" style={{wordWrap: 'break-word',
    whiteSpace: 'break-spaces'}}>
                What an honor for us to have such royalty join us in the Hunnys Closet! <br /><br />
                Did you know that being a Royal Bunny means you receive <span className="text-hunnys-yellow">FOUR</span> free Hunnys Seasons rewards, delivered to you for free, every single month? <br /><br />
                But don&apos;t let us stop you; there are still HUNDREDS of different traits out there to collect. <br /><br />
                Every Hunny you own unlocks ALL of its traits for unlimited use in Hunnys Closet. <br /><br />
                Here are some you might like: 
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-[3fr_1fr_3fr_1fr_3fr] grid-cols-[1fr] pb-12 px-8">
            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  Cheer Squad
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={rbCheer} className="w-full h-full" alt="" />
                </div>
              </div>
              <div></div>
            </div>
            <div className="flex justify-center items-center">
            </div>

            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  Bikini Babes
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={rbBikini} className="w-full h-full" alt="" />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
            </div>

            <div className="flex justify-center items-center">
              <div className="">
                <div className="text-center mt-3 font-title text-3xl text-white mb-4">
                  Horny Hunnys
                </div>
                <div className="relative rounded-full mx-auto overflow-hidden">
                  <Image width={600} height={600} src={rbHorny} className="w-full h-full" alt="" />
                </div>
              </div>
            </div>
          </div>
              </>
          )}
        <div className="mb-12 mx-auto max-w-[85%] w-full">
                <a href="https://buy.hunnys.io/ethereum/collection/0x5dfeb75abae11b138a16583e03a2be17740eaded" target="_blank">
                    <Button>{getButtonMessage(rewardStatus)}</Button>
                </a>
            </div>
        </>
    )}
</div>
        <div style={{ backgroundColor: '#700CF5'}} className="grid gap-2 rounded-3xl shadow-md mt-2 px-12 py-12">
          <div className="text-white font-title text-[3rem] text-center mb-6">
            <span className="text-hunnys-yellow">MORE </span>
            INFO
          </div>
          <div className="grid sm:grid-cols-3 grid-cols-[1fr]">
            {[
              {
                title: "SEASONS",
                text: "Each Hunnys Seasons NFT on polygon unlocks 1-10 limited edition items for the closet.",
                link: "SEASONS",
                icon: <LeafIcon />,
                url: "https://buy.hunnys.io/polygon/collection/0x43668e306dba9172824524fd2c0c6924e710ea5b",
              },
              {
                title: "SHOP",
                text: "Buy single items or packs in the shop. Use them to customize, gift or trade.",
                link: "STORE",
                icon: <ShopIcon />,
                url: "https://buy.hunnys.io/polygon/collection/0x5F0fEFD26189F651143D209cf5B357B6677DFA81",
              },
              {
                title: "SUBMIT",
                text: "Want to see your idea added to the closet? Head over to our Discord and submit your concept!",
                link: "DISCORD",
                url: "https://discord.com/channels/852293715174096948/1151939540437696612/1151939540437696612",
                icon: <HeartIcon />,
              },
            ].map((item, index) => (
              <div style={{ backgroundColor: '#E3D2FF'}} className="relative rounded-xl max-w-[280px] w-full mx-auto mb-5" key={'shop-list-' + index}>
                <div className="flex justify-center items-center my-6">{item.icon}</div>
                <div className="text-hunnys-blue font-title text-3xl text-center">{item.title}</div>
                <div className="max-w-[150px] mx-auto py-8 mb-14">{item.text}</div>
                <div className="absolute bottom-3 w-full px-4 mb-3">
                  <a href={item.url} target="_blank">
                    <Button colors="inverted">{item.link}</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
}
