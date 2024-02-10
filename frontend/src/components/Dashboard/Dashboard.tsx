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

{/* function getButtonMessage(rewardStatus: string) {
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
}*/}


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

export default function Dashboard() {
  return (
    <div className="flex justify-center items-center w-max-full px-6 mx-auto">
      <div className="relative max-w-[1250px]  mx-auto">
      {/* <div className="relative max-w-[1160px] w-full mx-auto"> */}   
      <div className="grid lg:grid-cols-2 grid-cols-1  gap-2 mt-2 mb-2">
      <a rel="noreferrer" target="_blank" href="https://hunnys.io/membership-levels/">
      <div className="dashboardHero"> <img src={"https://cdn.discordapp.com/attachments/900232920046927922/1190773619668824094/Closet_Promo_Image_Graphics_Dashboard_3.png?ex=65a3055a&is=6590905a&hm=9e08cde1ae31e9669148a96cc821f37bebd48ebac01b40a37a5c4c8b8f692bc8&"} alt="" /></div>
      </a>
      <a rel="noreferrer" target="_blank" href="https://opensea.io/collection/hunnys-seasons?search[numericTraits][0][name]=Generation&search[numericTraits][0][ranges][0][min]=3&search[numericTraits][0][ranges][0][max]=3">
      <div className="dashboardHero"> <img src={"https://cdn.discordapp.com/attachments/1131994451787644958/1202674618905927790/8CFB37BB-7E5E-4867-B8FA-C61CA0A4C60E.png?ex=65ce5105&is=65bbdc05&hm=915dbeeace9976d610881cb7de3004abd967eadf28866f097b2fef8b34782e14&"} alt="" /></div>
      </a></div>
        
      
        <div className="grid grid-cols-[1fr] sm:grid-cols-[2fr_1fr] bg-hunnys-blue rounded-2xl relative mb-2">
          <div className="grid grid-cols-[1fr] sm:grid-cols-2 py-8 px-5 mb-12" style={{ zIndex: 1}}>
            <div className="px-5">
            
            <h1 className="sm:text-5xl text-2xl font-title text-white mb-4" style={{ whiteSpace: 'nowrap' }}>
    WELCOME, <span className="text-hunnys-yellow">CUPCAKE!</span>
</h1>
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
                url: "https://buy.hunnys.io/polygon/collection/0x11bc733e719198e2b3746f6841d2818ca87af6da",
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