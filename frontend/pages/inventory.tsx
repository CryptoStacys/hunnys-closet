import { useAtom } from "jotai";
import { userAtom, allTraitsAtom } from "../src/data/store";
import { attributes, thumbnailPath } from "../src/data/config";
import { useState, useEffect } from "react";
import { hunnysColors } from "../src/data/config";
import { fetchTraits } from '../src/utils/traitUtils'; 
import { handleWethPayment } from '../src/utils/wethPayment';
import { eligibleTokenIds, mintWithWeth } from '../src/utils/eligibleTokens';
import { Trait } from "../src/data/global";
import Image from "next/image";
import Link from "next/link";
import { ethers } from "ethers";
import MintButton from "../../frontend/src/components/Mint/MintButton"
import useUpdateTraits from '../../frontend/src/hooks/useUpdateTraits';

// Inside your Items component
export default function Items() {
  const [user, setUser] = useAtom(userAtom);
  const [categoryFilter, categoryFilterSet] = useState("Background");
  const [rarityFilter, rarityFilterSet] = useState(["common"]);
  const newTrait: any = {};
  const [selectedTrait, selectedTraitSet] = useState(newTrait);
  const [allTraits, setAllTraits] = useAtom(allTraitsAtom);
  const [allAvailableTraits, setAllAvailableTraits] = useState<Trait[]>([]);
  const updateTraits = useUpdateTraits(setAllAvailableTraits, setUser, allAvailableTraits);  
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const bunnyClubMembers = ["0xa7758394D8f7fD23b0d9F13E02427B514687394B",
  "0x55Abdc04655d590a48BCd1B996115448b71b7a84",
  "0x4eE115d0708924B4d3a83e45A428B0e3cb4348e9",
  "0x3a9a9b0a3148599dde1660476c6a47b1272247c6",
  "0xe17d0ac3F7C498924d4920bf279C01536686e014",
  "0x48a19c6B158491325E84c8837ED8Ba95A0403C13",
  "0x9d9d3bca9ae1126244786089d81ba9b289970238",
  "0x1975638d2dfdeee04d11adf6350187af9996dc7c",
  "0x6c6cD01ebbd02254C5Db5263797E366511992d29",
  "0x019Db3aA167aF3B91b6D72a05dD8437aaDd5225E",
  "0x473e12B41bC13d3Ac98C4d06cD549Ba8a704dbf1",
  "0xBcDa92fF0D83448ad2B65C7a59D62FE3A18bF95f",
  "0x650d492E2F68A665a5dc029bc3f255FE5ec366Fc",
  "0x0009C319862f623aCa7b210a905121612fBBDf22",
  "0x7B710AD4c01038E62927cEBb2d5df68cF3463413",
  "0xa5cC1E135C92a4DD1b32A328e1343eB4150461B6",
  "0x5Cf422E9Ff1D79c98C479F8d4e8cbdC7B51E1550",
  "0x78ae230336bb65B0023d78156708783402f303c2",
  "0x8b5e18b1A4BfF36085604e94C9bdE2054C62d026",
  "0xFb203c2E544d1D2D889900883b4bD538Bc914357",
  "0x051f1F3920D196cc998D74A56978370b82432D25",
  "0x16272E839A5C29A3Fa90E670Cb599d233b6943aC"].map(address => address.toLowerCase()); // Replace with actual addresses and convert to lowercase
  const bunnyClubDiscount = 10; // 10% discount
  
// On component mount, fetch all available traits and traits owned by the user (if user exists)
useEffect(() => {
  fetchTraits().then(traits => {
    setAllAvailableTraits(traits);
    console.log("All available traits set:", traits);
  });

  // Rest of the useEffect...
}, [user]);


// In handleMintSuccess, fetch only the traits owned by the user
const handleMintSuccess = async () => {
  if (user) {
    const ownedTraits = await fetchTraits(user.address);

    if (allAvailableTraits) {
      updateTraits(user.address, () => allAvailableTraits);
    } else {
      console.error('allAvailableTraits is undefined');
    }
    // Debugging: Log the ownedTraits structure
    console.log('ownedTraits:', ownedTraits);

    // Check if ownedTraits is defined and is an array
    if (!Array.isArray(ownedTraits)) {
      console.error('No traits data available or data is not an array:', ownedTraits);
      return; // Exit the function if no valid traits data is available
    }

    const updatedTraits = allAvailableTraits.map(trait => {
      const isOwnedNow = ownedTraits.some(ownedTrait => ownedTrait.id === trait.id);
      return { ...trait, isOwned: isOwnedNow };
    });

    setAllAvailableTraits(updatedTraits);
    setUser({ ...user, traits: ownedTraits });
  }
};


  function getItems() {
    if (!user) return [];
    let output = user.traits;

    // Filter duplicates
    let uniqueTraits = new Set();
    output = output.filter((item: any) => {
      if (!uniqueTraits.has(item.name)) {
        uniqueTraits.add(item.name);
        return true;
      }
      return false;
    });

    output = output.filter((item: any) => item.attribute === categoryFilter);

    return output;
  }

  function getAllItems() {
    let data = allAvailableTraits;
  
    data = data.map((trait) => {
      const eligibleToken = eligibleTokenIds.find(eligible => 
        eligible.token_id === (trait.token_id ? trait.token_id.toString() : undefined) &&
        eligible.origin_ids.includes(trait.origin_id)
      );
  
      let price = eligibleToken ? eligibleToken.price : null;
      let isDiscounted = false;
  
      // Check if user is a Bunny Club member and apply discount
      if (user && bunnyClubMembers.includes(user.address.toLowerCase()) && price) {
        const discount = price.mul(bunnyClubDiscount).div(100);
        price = price.sub(discount);
        isDiscounted = true;
      }
  
      return {
        ...trait,
        isEligibleForMinting: !!eligibleToken,
        mintPrice: price,
        isDiscounted
      };
    });
  
    // Filter only selected attribute
    data = data.filter((trait) => trait.attribute === categoryFilter);
  
    // Remove duplicates
    const uniqueTraits = new Set();
    data = data.filter((trait) => {
      if (!uniqueTraits.has(trait.name)) {
        uniqueTraits.add(trait.name);
        return true;
      }
      return false;
    });
  
    // Sorting (if needed, add sorting logic here)
  
    return data;
  }
  
  function checkForOwnedTrait(trait: any) {
    let result = false;

    let userTraits = getTraits();
    let traitMatch = userTraits.findIndex((ele) => { return (ele.name === trait.name) && (ele.attribute === trait.attribute)})
    if(traitMatch !== -1 || trait.name === 'Empty') {
      result = true;
    }

    return result;
  }

   // Get all traits to choose from
   function getTraits() {
    // Get all traits owned by user
    // let data = user!.collections.collections[0].tokenData.traitData;
    let data = user!.traits;

    // Filter only selected attribute
    data = data.filter((trait: any) => trait.attribute === categoryFilter);

    // Filter out duplicates
    let uniqueTraits = new Set();
    data = data.filter((obj: any) => {
      if (!uniqueTraits.has(obj.name)) {
        uniqueTraits.add(obj.name);
        return true;
      }
      return false;
    });

    // Sorting
    return data;
  }

  function getOriginUrl(trait: any) {
    let result = '';

    switch (trait.origin_id) {
      //Hunnys10k
      case 1:
        result = `https://buy.hunnys.io/ethereum/collection/0x5dfeb75abae11b138a16583e03a2be17740eaded?attributes%5B${trait.attribute}%5D=${trait.name}`;
        break;
      //Hunnys OGs
      case 2:
        result = `https://buy.hunnys.io/ethereum/collection/0x64bd44df5590cfe4f0395b05fa0e6f096734bb77`;
        break;
      //Hunnys Seasons
      case 3:
        result = `https://buy.hunnys.io/polygon/asset/0x43668e306dba9172824524fd2c0c6924e710ea5b:${trait.token_id || ''}`;
        break;
      //shop.hunnys.net
      case 4:
        result = `https://buy.hunnys.io/`;
        break;
      //Stacys
      case 5:
        result = `https://buy.hunnys.io/ethereum/collection/0x21ac5f6c96ccb174115b18318e3e340237a55606`;
        break;
      //All Hunnys
      case 6:
        result = `https://buy.hunnys.io/ethereum/collection/0x5dfeb75abae11b138a16583e03a2be17740eaded`;
        break;
      //Old Hunnys Closet Shop
      case 7:
        result = `https://buy.hunnys.io/polygon/asset/0x11bc733e719198e2b3746f6841d2818ca87af6da:${trait.token_id || ''}?old`;
        break;
      //Fame Lady Society
      case 8:
        result = `https://opensea.io/collection/fameladysociety`
        break;
      // New Hunnys Closet Shop
      case 9:
        result = `https://buy.hunnys.io/polygon/asset/0x11bc733e719198e2b3746f6841d2818ca87af6da:${trait.token_id || ''}`;
        break;
      default:
        result = `#`;
        break;
    }


    return result;
  }

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault(); // Prevent the default anchor behavior
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page smoothly
  };

  return (
    <div className="flex justify-center items-center my-4 mx-auto">
      {/* <div> */}
        {/* <div className="relative mx-6 max-w-[1160px] grid grid-cols-[170px_1fr] gap-3"> */}
        <div className="relative mx-6 max-w-[1250px] grid sm:grid-cols-[170px_1fr] grid-cols-[1fr] gap-3">


          <div className="relative bg-white shadow-md rounded-lg p-3 mb-3">
            <div>
              <div className="grid sm:grid-cols-1 grid-cols-2 w-full gap-1 flex-wrap">
                {attributes.map((attribute, index) => (
                  <button
                    key={index}
                    onClick={() => categoryFilterSet(attribute)}
                    className=" text-white flex w-full rounded-md px-2 py-1 font-bold"
                    style={{
                      background: categoryFilter == attribute ? "#6510f1" : "#abf",
                    }}
                  >
                    <Image width={32} height={32}
                      src={`/attributes/${attribute}.svg`}
                      alt={`${attribute} svg icon`}
                      className="h-7 w-7 p-[2px] mr-2"
                    />
                    {attribute}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div id="itemView">
              {selectedTrait.name !== undefined && (
                
                <div className="bg-white rounded-lg shadow-lg mb-4 p-6 grid sm:grid-cols-[150px_1fr] grid-cols-[1fr] gap-4">
                  <div>
                    <Image width={600} height={600}
                      className="sm:h-[150px] h-auto shadow-md rounded-lg"
                      src={`/${thumbnailPath}/${selectedTrait.attribute}/${selectedTrait.name}.jpg`}
                      alt={selectedTrait.name}
                    />
                  </div>
                  <div>
                    <div className="font-bold underline pb-2">{selectedTrait.name}</div>
                    {/* <div className="">Unlock Requirement: {selectedTrait.origin_name}</div> */}

                    {/* ORIGIN */}
                    {
                      selectedTrait.name !== "Empty" && selectedTrait.origin_id >= 1 && selectedTrait.origin_id <= 20 && (
                        <div className="flex py-2">
                          <div>Unlock Requirement</div>
                          <a
                            className="bg-hunnys-black text-white text-center m-auto w-full px-2 py-1 inline-block font-title shadow-md rounded-full text-lg hover:shadow-lg transition-all"
                            target={getOriginUrl(selectedTrait) === '#' ? '_self' : '_blank'}
                            rel={getOriginUrl(selectedTrait) === '#' ? '' : 'noreferrer'}
                            href={getOriginUrl(selectedTrait)}
                          >
                            <div>VIEW</div>
                          </a>
                        </div>
                      )
                    }

                    <div className="pb-2">
                      Rarity:
                      <div
                        className="inline-block ml-2 px-4 py-1 pb-2 text-white font-bold rounded-full"
                        style={{ background: hunnysColors[selectedTrait.rarity.toLowerCase()] }}
                      >
                        {selectedTrait.rarity}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-2 w-full">
              
              {getAllItems()
              .sort((a: any, b: any) => {
                if (checkForOwnedTrait(a) && !checkForOwnedTrait(b)) return -1;
                return 1;
              })
              .map((item, index) => (
                <Link href="#itemView" onClick={handleScroll} key={index}>
                  <button
                    onClick={() => selectedTraitSet(item)}
                    style={{ backgroundColor: '#a264f4' }}
                    className="transition hover:scale-[1.02] shadow-sm hover:shadow-lg grid grid-cols-1 text-white rounded-lg overflow-hidden"
                  >
                    <img
                      className={`w-full  ${!checkForOwnedTrait(item)? ' low-brightness' : ''}`}
                      src={`${thumbnailPath}/${item.attribute}/${item.name}.jpg`}
                      alt={item.name}
                    />
                    <div className={`shadow-lg rounded-b-lg text-white w-full h-auto justify-center items-center font-bold break-words py-2 px-2`}>{item.name}</div>
                    {/* <div className={`w-full flex h-full justify-center items-center font-bold`}>{item.name}</div> */}
                    {item.isEligibleForMinting && (
          <MintButton
            tokenId={item.token_id}
            mintPrice={item.mintPrice}
            onMintSuccess={handleMintSuccess}
            updateTraits={updateTraits}
            userAddress={user?.address}
            mintAction={async () => {
              if (user?.address && item.token_id) {
                await mintWithWeth(user.address, item.token_id, item.mintPrice, provider);
              } else {
                console.error("User address or token ID is undefined");
              }
            }}
            className={item.isDiscounted ? 'discounted-mint-btn' : ''}
          />
        )}


                  </button>
                </Link>
            ))}
            </div>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
}