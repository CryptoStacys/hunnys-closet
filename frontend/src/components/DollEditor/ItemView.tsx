// libaries
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// store
import { useAtom } from "jotai";
import { allTraitsAtom, userAtom } from "../../data/store";

// types
import { Trait } from "../../data/global";

// components
import ItemViewSettings from "./ItemViewSettings";
import Icon from "../Icon/Icon";
import Help from "../Help/Help";

// utils
import { randomNumber } from "../../utils/randomNumber";
import capitalize from "../../utils/capitalize";

// data
import colorNames from "../../data/colorNames";
import colorGroups from "../../data/colorGroups";
import { hunnysColors, thumbnailPath } from "../../data/config";
import { localStorageKey } from "../../data/config";
import { ethers } from 'ethers';
import Image from "next/image";
import MintButton from "../Mint/MintButton";
import useUpdateTraits from "../../hooks/useUpdateTraits";
import { eligibleTokenIds, mintWithWeth } from "../../utils/eligibleTokens";
import { fetchTraits } from "../../utils/traitUtils";

export default function ItemView(props: { selectedTrait: Trait; selectedTraitSet: any; tokenSet: any }) {
    // animation variants
    const variants = {
      visible: {
        opacity: 1,
        transition: {
          when: "beforeChildren",
          staggerChildren: 0.08,
        },
      },
      hidden: {
        opacity: 0,
        transition: {
          when: "afterChildren",
        },
      },
    };
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedItems, setSortedItems] = useState<Trait[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 12;
  const [sortOrder, setSortOrder] = useState('A-Z');
  const rarityOrder = ['Common', 'common', 'Uncommon', 'uncommon', 'Rare', 'rare', 'Epic', 'epic', 'Relic', 'relic', 'Legendary', 'legendary', 'Mythic', 'mythic', 'Immortal', 'immortal'];
  const [sortType, setSortType] = useState('default');
  const [user, setUser] = useAtom(userAtom);
  const [allTraits] = useAtom(allTraitsAtom);
  const SPECIAL_WALLET_ADDRESSES = [
  '0xB179Ec3179f20452710dc544FCd1486b8e7be4C0', // Hypebunny.eth
  '0x18875D28714cf2f434909a42585BaF5d42a93c68',  // Rat dev wallet
  '0x55Abdc04655d590a48BCd1B996115448b71b7a84' // Stacys
  ];

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
  "0x0DE9a66f0F9b714c5b987BDCb37A5E2EF1bDA67A",
  "0x0009C319862f623aCa7b210a905121612fBBDf22",
  "0x7B710AD4c01038E62927cEBb2d5df68cF3463413",
  "0xa5cC1E135C92a4DD1b32A328e1343eB4150461B6",
  "0x745461ae3ee10F26e314735b6AF8ee41cD313E2d",
  "0x5Cf422E9Ff1D79c98C479F8d4e8cbdC7B51E1550",
  "0x78ae230336bb65B0023d78156708783402f303c2",
  "0x8b5e18b1A4BfF36085604e94C9bdE2054C62d026",
  "0x247DBa0157DDD215d30d41A70411DbaFbFD6a0F9",
  "0xFb203c2E544d1D2D889900883b4bD538Bc914357",
  "0x7b511800A8d8E7DE24Dd19de3103081824b6f41D",
  "0x1776727f3c60dD67B832F9E0614D7e028E32e063",
  "0xb62500D5a8b9629763d39a4D05784D6A47A72Ab1",
  "0xDbC0019892E644Ad55756Ace79810305E8E4c31d",
  "0x051f1F3920D196cc998D74A56978370b82432D25",
  "0x16272E839A5C29A3Fa90E670Cb599d233b6943aC"].map(address => address.toLowerCase()); // Replace with actual addresses
  const bunnyClubDiscount = 10; // 10% discount
  
  const [allAvailableTraits, setAllAvailableTraits] = useState<Trait[]>([]); // State for all available traits
  const updateTraits = useUpdateTraits(setAllAvailableTraits, setUser); // Custom hook usage
 
  const [isEligibleForMinting, setIsEligibleForMinting] = useState(false);
  const [currentMintedTrait, setCurrentMintedTrait] = useState<Trait | null>(null);

    // Set the current minted trait before calling mintWithWeth
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);   
  
    
  
    // Define handleMintSuccess function
    const handleMintSuccess = async (trait: Trait) => {
      if (user) {
        const ownedTraits = await fetchTraits(user.address);
        console.log('Fetched ownedTraits:', ownedTraits);
        if (ownedTraits && Array.isArray(ownedTraits)) {
          const updatedTraits = allAvailableTraits.map(availableTrait => ({
            ...availableTrait,
            isOwned: ownedTraits.some(ownedTrait => ownedTrait.id === availableTrait.id)
          }));
          setAllAvailableTraits(updatedTraits);
          setUser({ ...user, traits: ownedTraits });
        } else {
          console.error('Error fetching owned traits or the result is not an array:', ownedTraits);
        }
      }
    };
    
    
    
    useEffect(() => {
      if (currentMintedTrait) {
        updateTraitsAfterMint(); // Call this function when currentMintedTrait is set
      }
    }, [currentMintedTrait]);
    
    useEffect(() => {
      console.log("ItemView Mounted. Selected Trait:", props.selectedTrait);
    }, []);
    
  
    // Define updateTraitsAfterMint function
    const updateTraitsAfterMint = async () => {
      if (!user || !user.address || !currentMintedTrait) {
        console.error("User, user address, or current minted trait is undefined");
        return;
      }
      const updatedTraits = sortedItems.map(item => {
        if (item.token_id === currentMintedTrait.token_id) {
          return { ...item, isOwned: true }; // Update isOwned flag for the minted trait
        }
        return item;
      });
      setSortedItems(updatedTraits);
    };
    

    useEffect(() => {
      let sortedData = allTraits.traits.filter(trait =>
        trait.attribute === props.selectedTrait!.attribute &&
        trait.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      // Remove duplicates
      sortedData = sortedData.filter((trait, index, self) =>
        index === self.findIndex(t => t.name === trait.name)
      );
    
      // Extract and temporarily remove 'Empty' trait
      const emptyTraitIndex = sortedData.findIndex(t => t.name === 'Empty');
      let emptyTrait;
      if (emptyTraitIndex > -1) {
        emptyTrait = sortedData.splice(emptyTraitIndex, 1)[0];
      }
    
      // Apply sorting and check eligibility
      sortedData = sortedData.map(trait => {
        const eligibleToken = eligibleTokenIds.find(eligible => 
          eligible.token_id === String(trait.token_id) &&
          eligible.origin_ids.includes(trait.origin_id)
        );
        const isEligible = Boolean(eligibleToken);
        
        return {
          ...trait,
          isEligibleForMinting: isEligible,
          mintPrice: eligibleToken?.price ?? undefined
        };

      }).sort((a, b) => {
        // Sort by 'Empty' trait
        if (a.name === "Empty") return -1;
        if (b.name === "Empty") return 1;
    
        // Sort by owned status
        const aOwned = checkForOwnedTrait(a);
        const bOwned = checkForOwnedTrait(b);
        if (aOwned !== bOwned) {
          return sortType === 'NotOwned' ? aOwned - bOwned : bOwned - aOwned;
        }
    
        // Additional sorting based on sortType
        switch (sortType) {
          case 'A-Z':
            return (a.name ?? '').localeCompare(b.name ?? '');
          case 'Z-A':
            return (b.name ?? '').localeCompare(a.name ?? '');
          case 'Rare to Common':
            return rarityOrder.indexOf(b.rarity ?? '') - rarityOrder.indexOf(a.rarity ?? '');
          case 'Common to Rare':
            return rarityOrder.indexOf(a.rarity ?? '') - rarityOrder.indexOf(b.rarity ?? '');
          default:
            return 0;
        }
      });
    
      // Re-add 'Empty' trait at the start if it was removed
      if (emptyTrait) {
        sortedData.unshift(emptyTrait);
      }

      if (sortType === 'OnSale') {
        sortedData = sortedData.filter(trait => trait.isEligibleForMinting);
      }
    
      setSortedItems(sortedData);
    }, [searchTerm, sortType, allTraits.traits, props.selectedTrait, eligibleTokenIds]);
    

  

  // state to check which color is being edited
  const [selectedColor, selectedColorSet] = useState(-1);



  // Select which filter to use for colors
  const [colorFilter, setColorFilter] = useState("All");


  useEffect(() => {
    
    let data = allTraits!.traits;

    // Filter only selected attribute
    data = data.filter((trait: Trait) => trait.attribute === props.selectedTrait!.attribute);

    // Filter out duplicates
    let uniqueTraits = new Set();
    data = data.filter((obj: Trait) => {
      if (!uniqueTraits.has(obj.name)) {
        uniqueTraits.add(obj.name);
        return true;
      }
      return false;
    });

    data = data.sort((a: Trait, b: Trait) => {
      if (a.name == "Empty" && b.name !== "Empty") return -1;
      return 1;
    })
    // Always show owned Traits after Empty
    let sortedData = data.sort((a: Trait, b: Trait) => {
      if (checkForOwnedTrait(a) && !checkForOwnedTrait(b)) return -1;
      return 1;
    });

    setSortedItems(sortedData);
  }, []);

  useEffect(() => {
    const checkEligibility = async () => {
      const eligibleToken = eligibleTokenIds.find(eligible => eligible.token_id === String(props.selectedTrait.token_id));
      setIsEligibleForMinting(Boolean(eligibleToken));
      console.log("Eligibility checked:", Boolean(eligibleToken)); // Add this line
    };
  
    checkEligibility();
  }, [props.selectedTrait, eligibleTokenIds]);
  



  function closeDyeSelection() {
    selectedColorSet(-1);
    setColorFilter("All");
  }

  function getRarityColor(rarity: string | undefined): string {
    if (rarity === undefined) {
      return "#000";
    }
    return hunnysColors[rarity.toLocaleLowerCase()];
  }

  function setColor(index: number, color: string) {
    // remember the selected color
    localStorage.setItem(`${localStorageKey}-${index}`, color);

    props.selectedTraitSet((trait: Trait) => {
      if (trait.colorsApplied !== undefined) {
        trait.colorsApplied[index] = color;
      }

      // update token for rendering
      props.tokenSet((prev: Trait[]) => {
        prev = prev.filter((prevTrait) => {
          return prevTrait.attribute !== props.selectedTrait.attribute;
        });
        return [...prev, trait];
      });

      return trait;
    });
  }

  function back() {
    props.selectedTraitSet(undefined);
  }

  function getColorsAvailable() {
    // Check if the user's wallet address is one of the special addresses
    if (SPECIAL_WALLET_ADDRESSES.includes(user?.address ?? '')) {
      // If a special wallet, return all colors
      return Object.keys(colorNames);
    }
  
    // Existing logic for getting available colors
    let colorsAvailable: string[] = Object.values(user!.colors);
    const groups: any = colorGroups;
    if (colorFilter !== "All") {
      colorsAvailable = colorsAvailable.filter((x: any) => groups[colorFilter.toLowerCase()].includes(x));
    }
    return colorsAvailable;
  }
  

  // convert hunnys color name to rgb values
  function colorNameToRGB(name: string): string {
    const colors: any = colorNames;
    let newColor = "0,0,0";
    try {
      newColor = `rgba(${colors[name].r}, ${colors[name].g}, ${colors[name].b})`;
    } catch (error) {
      console.error(error);
    }
    return newColor;
  }

  

  // Show colors of current selected trait
  function getColors() {
    if (props.selectedTrait.colorsApplied === undefined || props.selectedTrait.colorsApplied.length === 0) {
      return [];
    } else {
      return props.selectedTrait.colorsApplied;
    }
  }

  // Get all traits to choose from
  function getTraits() {
    // Get all traits owned by user
    // let data = user!.collections.collections[0].tokenData.traitData;
    let data = user!.traits;

    // Filter only selected attribute
    data = data.filter((trait: Trait) => trait.attribute === props.selectedTrait!.attribute);

    // Filter out duplicates
    let uniqueTraits = new Set();
    data = data.filter((obj: Trait) => {
      if (!uniqueTraits.has(obj.name)) {
        uniqueTraits.add(obj.name);
        return true;
      }
      return false;
    });

    // Sorting
    return data;
  }

  // update token with the new trait
  function setTraits(trait: Trait) {
    // close selecting colors UI
    closeDyeSelection();

    // show new selected trait data
    props.selectedTraitSet(trait);

    if(checkForOwnedTrait(trait)) {

      // set token with new trait
      props.tokenSet((prev: Trait[]) => {
        // remove old trait
        prev = prev.filter((prevTrait) => {
          return prevTrait.attribute !== props.selectedTrait.attribute;
        });
  
        // add applied color
        // trait.colorsApplied = [];
  
        // add random or saved colors
        trait = addTraitColor(trait);
  
        prev = [...prev, trait];
  
        prev = checkUndergarment(trait, prev);
  
        // console.log("new token", [...prev, trait]);
        return prev;
      });
    }

  }

  function addTraitColor(trait: Trait) {
    trait.colorsApplied = [];
    // add random or saved colors
    for (let i = 0; i < trait.colors; i++) {
      const storedColor = localStorage.getItem(`${localStorageKey}-${i}`);
      const ownedColors = getColorsAvailable();

      // If the color isn't already saved, just randomize from the owned color list
      if (storedColor === null) {
        trait.colorsApplied[i] = ownedColors[randomNumber(0, ownedColors.length - 1)];
      } else {
        // If there is a color saved, check if it's part of the owned color list
        if (ownedColors.includes(storedColor)) {
          trait.colorsApplied[i] = storedColor;
        } else {
          trait.colorsApplied[i] = ownedColors[randomNumber(0, ownedColors.length - 1)];
        }
      }
    }

    return trait;
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
        result = `https://buy.hunnys.io/polygon/asset/0x11bc733e719198e2b3746f6841d2818ca87af6da:${trait.token_id || ''}`;
        break;
      //Fame Lady Society
      case 8:
        result = `https://opensea.io/collection/fameladysociety`
        break;
      //Old Hunnys Closet Shop
      case 9:
        result = `https://buy.hunnys.io/polygon/asset/0x11bc733e719198e2b3746f6841d2818ca87af6da:${trait.token_id || ''}`;
        break;
      default:
        result = `#`;
        break;
    }


    return result;
  }


  // update token with the new trait
  function checkUndergarment(trait: Trait, prev: Trait[]) {
    // Undergarment check
    let outfitTrait =
      trait.attribute === "Outfit"
        ? trait
        : prev.find((ele: Trait) => {
            return ele.attribute === "Outfit";
          });
    let bodysuitTrait =
      trait.attribute === "Bodysuit"
        ? trait
        : prev.find((prevTrait: Trait) => {
            return prevTrait.attribute === "Bodysuit";
          });
    let undergarmentTrait =
      trait.attribute === "Undergarment"
        ? trait
        : prev.find((ele: Trait) => {
            return ele.attribute === "Undergarment";
          });
    let undergarmentTraitIndex = prev.findIndex((ele: Trait) => {
      return ele.attribute === "Undergarment";
    });
    let newTrait: Trait;

    if (outfitTrait?.name === "Empty" && bodysuitTrait?.name === "Empty") {
      if (undergarmentTrait?.name === "Empty") {
        let allTraits = user!.traits;
        newTrait = allTraits.find((ele: Trait) => {
          return ele.attribute === "Undergarment" && ele.name === "Frilly Bra";
        });
        newTrait = addTraitColor(newTrait);
        prev[undergarmentTraitIndex] = newTrait;
      }
    } else if (outfitTrait?.name !== "Empty" || bodysuitTrait?.name !== "Empty") {
      if (undergarmentTrait?.name !== "Empty") {
        let allTraits = user!.traits;
        newTrait = allTraits.find((ele: Trait) => {
          return ele.attribute === "Undergarment" && ele.name === "Empty";
        });
        newTrait = addTraitColor(newTrait);
        prev[undergarmentTraitIndex] = newTrait;
      }
    }

    return prev;
  }

  function checkForOwnedTrait(trait: Trait): number {
    // Check if the user's wallet address is one of the special addresses
    if (SPECIAL_WALLET_ADDRESSES.includes(user?.address ?? '')) {
      return 1; // Treat all traits as owned for these special wallets
    }
  
    // Existing logic to check if a trait is owned
    let result = false;
    let userTraits = getTraits();
    let traitMatch = userTraits.findIndex((ele) => { 
      return (ele.name === trait.name) && (ele.attribute === trait.attribute)
    });
    if (traitMatch !== -1 || trait.name === 'Empty') {
      result = true;
    }
  
    return result ? 1 : 0;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = sortedItems.slice(startIndex, endIndex);
    const pageTotal = Math.ceil(sortedItems.length / 12);
    
    console.log("ItemView rendering");
    useEffect(() => {
      // Automatically set sortType to 'Owned' on component mount
      setSortType('Owned');
    
      // Rest of your existing useEffect logic...
    }, []); // Empty dependency array to ensure this runs only once on component mount
    
    
    let discountedPrice: ethers.BigNumber | undefined;

let mintPrice = props.selectedTrait.mintPrice;
const isDiscounted = user && bunnyClubMembers.includes(user.address.toLowerCase());

if (mintPrice && ethers.BigNumber.isBigNumber(mintPrice)) {
    discountedPrice = isDiscounted
        ? mintPrice.mul(100 - bunnyClubDiscount).div(100)
        : mintPrice;
} else {
    discountedPrice = undefined; // Set to undefined instead of null
}
  
      // Inside your ItemView component, before the return statement
      let isEligibleForPurchase = false;
      if (props.selectedTrait.isEligibleForMinting && mintPrice && ethers.BigNumber.isBigNumber(mintPrice)) {
          isEligibleForPurchase = !mintPrice.isZero();
      }

return (
  <>
     <ItemViewSettings selectedTrait={props.selectedTrait} getTraits={getTraits} setTraits={setTraits} back={back} />
      <div className="mb-3 grid sm:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_3fr] gap-3">
        <div className="relative mobile-hide">
          <Image width={600} height={600}
            className="w-full rounded-lg shadow-lg aspect-square flex-center"
            src={`/${thumbnailPath}/${props.selectedTrait.attribute}/${props.selectedTrait.name}.jpg`}
            alt={props.selectedTrait.name}
          />
          
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          {/* TOP ROW */}
          <div className="w-full bg-hunnys-blue rounded-t-lg  pl-[12px] pr-[6px] py-[3px] flex justify-between">
            {/* NAME */}
            <div className="font-bold text-white text-xl">{props.selectedTrait.name}</div>

            <button onClick={back}>
              <svg className="w-7 h-7 fill-white" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
              </svg>
            </button>
          </div>

          {/* BOTTOM ROW */}
          <div className="relative h-[115px] flex flex-wrap content-between py-2 px-3 pb-3">
            <div className="w-full grid grid-cols-1 gap-1">
              {/* ATTRIBUTE */}
              <div className="flex justify-between">
                Category
                <div className="flex-center gap-x-2 rounded-full bg-[#444] pl-2 pr-3">
                  <Image width={32} height={32}
                    src={`/attributes/${props.selectedTrait.attribute}.svg`}
                    alt={`${props.selectedTrait.attribute} svg icon`}
                    className="h-7 w-7 py-[3px]"
                  />
                  <div className="text-white font-bold">{props.selectedTrait.attribute}</div>
                </div>
              </div>

              {/* RARITY */}
              <div className="flex justify-between">
                Rarity
                <div
                  className="font-bold text-white rounded-full inline-block px-4 py-1"
                  style={{
                    background: getRarityColor(props.selectedTrait.rarity),
                  }}
                >
                  {props.selectedTrait.rarity?.toLocaleUpperCase()}
                </div>
              </div>
              {/* ORIGIN */}
{
  props.selectedTrait.name !== "Empty" && getOriginUrl(props.selectedTrait) !== '#' && (
    <div className="flex flex-row mt-5 gap-12 items-center justify-between">
      <div>Unlock Requirement</div>
      <a
        className="bg-hunnys-black text-white text-center m-auto w-2/4 px-2 py-1 inline-block font-title shadow-md rounded-full text-lg hover:shadow-lg transition-all"
        target={getOriginUrl(props.selectedTrait) === '#' ? '_self' : '_blank'}
        rel={getOriginUrl(props.selectedTrait) === '#' ? '' : 'noreferrer'}
        href={getOriginUrl(props.selectedTrait)}
      >
        {props.selectedTrait.origin_id >= 1 && props.selectedTrait.origin_id <= 20 && <div>VIEW</div>}
      </a>
    </div>
  )
}

      {isEligibleForPurchase &&(<div className="flex flex-row mt-5 gap-12 items-center justify-between">
          <div>Buy Now</div>
          <MintButton
            tokenId={props.selectedTrait.token_id}
            mintPrice={discountedPrice || ethers.BigNumber.from(0)} // Default to 0 if discountedPrice is undefined
            onMintSuccess={() => handleMintSuccess(props.selectedTrait)}
            updateTraits={updateTraits}
            userAddress={user?.address}
            mintAction={async () => {
              if (user?.address && props.selectedTrait.token_id && discountedPrice) {
                setCurrentMintedTrait(props.selectedTrait); // Set current minted trait
                await mintWithWeth(user.address, props.selectedTrait.token_id, discountedPrice, provider);
                handleMintSuccess(props.selectedTrait); // Call handleMintSuccess after successful mint
              } else {
                console.error("User address or token ID is undefined, or discountedPrice is not available");
              }
            }}
            className={isDiscounted ? 'discounted-mint-btn' : 'test'}
        />
        </div>)}
              {/* INFO */}
              {props.selectedTrait.attribute === "Bodysuit" && (
                <Help
                  {...{
                    displayText: "Incompatible: Hair",
                    title: "Note",
                    body: "Equipping this will remove the hair trait since the traits can't be rendered together.",
                  }}
                  className="mt-1"
                />
              )}
            </div>
          </div>
                {/* Buy Now Button and Icon Placeholder */}
    <div className="mt-4 flex justify-between items-center">
          
          <div className="w-20 h-20"> {/* Placeholder for 80x80 icon */}</div>
        </div>
        </div>
        </div>
        <div>
 {/* EQUIPPED DYES */}
 {getColors().length > 0 && (
          <><div className="font-bold text-gray-600 mt-6 mb-1">
            <div className="font-bold text-gray-600 text-xl mt-6 p-4 mb-1">Select your dyes</div>
            <div className="grid p-8 grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3">
              {getColors().map((color, index) => (
                <motion.button
                  initial={{ scale: 1, rotate: "0deg" }}
                  whileHover={{
                    scale: 1.05,
                    rotate: "1deg",
                    transition: { delay: 0, duration: 0.2 },
                  }}
                  key={index}
                  onClick={() => {
                    if (selectedColor === index) {
                      closeDyeSelection();
                    } else {
                      selectedColorSet(index);
                    }
                  }}
                  className="grid grid-cols-1 shadow-md rounded-lg h-[100px]"
                >
                  {selectedColor === index && (
                    <>
                      <div className="z-30 w-full h-full absolute top-0 left-0 border-[5px] border-hunnys-blue rounded-lg"></div>
                    </>
                  )}
                  <div
                    style={{
                      background: colorNameToRGB(color),
                    }}
                    className="w-full h-full rounded-lg"
                  ></div>
                  <div
                    style={{
                      background: selectedColor === index ? "#6510f1" : "#fff",
                      fontWeight: selectedColor === index ? "600" : "400",
                      color: selectedColor === index ? "#fff" : "#555",
                    }}
                    className="absolute left-0 bottom-0 rounded-b-lg w-full text-sm flex-center pt-2 pb-2 z-20"
                  >
                    {color}
          </div>
        </motion.button>
      ))}</div>
    </div>
</>
)}
        {/* SELECTING NEW DYE */}
        <AnimatePresence>
          {selectedColor > -1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-hunnys-blue shadow-none border-[0px] border-hunnys-blue mt-3 rounded-[15px] px-4 py-1"
            >
              {/* COLOR GROUPING FILTER */}
              <div className="font-bold mt-2 mb-2 flex flex-wrap gap-y-1">
                {["All", ...Object.keys(colorGroups)].sort().map((group, index: number) => (
                  <button
                    key={index}
                    className="text-white rounded-full px-3"
                    onClick={() => setColorFilter(group)}
                    style={{
                      background: colorFilter == group ? hunnysColors.yellow : "none",
                      color: colorFilter == group ? hunnysColors.black : "#fff",
                    }}
                  >
                    {capitalize(group)}
                  </button>
                ))}
              </div>

             {/* FILTERED AVAILABLE COLORS */}
<div className="grid xs:grid-cols-5 sm:grid-cols-6 xl:grid-cols-8 gap-x-3 gap-y-3 mb-4 mt-6">
  {getColorsAvailable()
    .sort()
    .map((color: string, index: number) => (
      <div
        key={index}
        className="relative group overflow-visible " // Set overflow to visible
        style={{ width: '60px', height: '60px' }}
      >
        <motion.button
          initial={{
            border: "4px solid white",
          }}
          animate={{
            opacity: 1,
            transition: { delay: 0.02 * index },
          }}
          whileHover={{
            scale: 1.1,
            border: "4px solid black",
            transition: { delay: 0, duration: 0.08 },
          }}
          onClick={() => setColor(selectedColor, color)}
          className="w-full h-full rounded-lg cursor-pointer dyes" // Keep rounded-lg if you want rounded corners
          style={{
            background: colorNameToRGB(color),
          }}
        />
        <div
          className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 text-center pointer-events-none transition-opacity duration-150 z-10" // Adjusted to float above
        >
          <span
            className="bg-black block text-white py-1 px-3 rounded-md text-xs"
          >
            {color}
          </span>
        </div>
      </div>
    ))}
</div>

            </motion.div>
          )}
        </AnimatePresence>
        </div>
      {/* BACKPACK */}
      
        {/* OTHER ITEMS */}            
        <div className="mb-12">
        <div className="font-bold font-luckiest flex pl-1 mt-8 text-[#444] flex flex-row">
        <select className={`bg-white sortDropdown shadow-lg rounded-b-lg uppercase`} onChange={(e) => {
    setSortType(e.target.value);
    setCurrentPage(1); // Reset currentPage to 1
  }}>
              <option value="default">Default Sort</option>
              <option className="bg-hunnys-yellow" value="OnSale">On Sale</option>
              <option value="Rare to Common">Rare to Common</option>
              <option value="Common to Rare">Common to Rare</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            {/* <option value="Newest">Sort by Newest</option> */}
              <option value="Owned">Sort by Owned</option>
              <option value="NotOwned">Sort by Not Owned</option>
            </select>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search traits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input ml-8 float-end bg-white searchBar indent-2 border-black"
              />
              {searchTerm && (
                <button
                
                  onClick={() => setSearchTerm('')}
                  className="clear-search clearSearch right-6 top-0.5 relative"
                  aria-label="Clear search"
                ><img src='/assets/clearSearchButton.png' alt='clearSearch' className="w-4">
                 </img>
                </button>
              )}
            </div>
          </div>
          

          <div className="grid grid-cols-4 w-full gap-y-3 gap-x-2 pb-6 break-words ">
  {currentItems.map((trait: Trait) => {
    
    // Check if user is eligible for a discount
    const isDiscounted = user && bunnyClubMembers.includes(user.address.toLowerCase());
    // Calculate discounted price if eligible
    const discountedPrice = isDiscounted && trait.mintPrice
      ? trait.mintPrice.mul(100 - bunnyClubDiscount).div(100)
      : trait.mintPrice;

    return (
          <div className="grid-item mt-4" key={trait.name + trait.token_id}>
                <motion.button
                  initial="hidden"
                  animate="visible"
                  variants={variants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0px 10px 15px -3px rgb(0,0,0 / 0.1), 0 4px 6px -4px rgb(0,0,0/0.1)",
                    transition: { delay: 0, duration: 0.2 },
                  }}
                  onClick={() => setTraits(trait)}
                  className={`relative ${!checkForOwnedTrait(trait) ? 'low-brightness' : ''} `}
                >
                  {trait.isEligibleForMinting ? (
        // Render image for eligible traits
        <img 
          src="https://hunnys.io/wp-content/uploads/2024/02/Copy-of-Hunnys-Closet-Mockups-Website-1.png" // Replace with actual image path
          alt="Minting Eligible"
          className="absolute forSale right-2 top-4 shadow-xl"
        />
      ) : (
        // Render rarity dot for other traits
        <div
          className="absolute right-2 top-4 rounded-full h-[16px] w-[16px] border-[3px] border-white"
          style={{ background: hunnysColors[trait.rarity!.toLocaleLowerCase()] }}
        ></div>
      )}

                    <Image width={600} height={600} priority={true}
                      className="w-full shadow-lg aspect-square flex-center"
                      src={`/${thumbnailPath}/${trait.attribute}/${trait.name}.jpg`}
                      alt={trait.name}
                    />
                    <div style={{backgroundColor: '#a264f4'}} className={`shadow-lg rounded-b-lg text-white w-full h-auto justify-center items-center font-bold  py-2 px-2`}>{trait.name}</div>

                </motion.button>
                {/* Add the MintButton if the trait is eligible for minting 
                
                {trait.isEligibleForMinting && (
                  <MintButton
                    tokenId={trait.token_id}
                    mintPrice={discountedPrice}
                    onMintSuccess={() => handleMintSuccess(trait)}
                    updateTraits={updateTraits}
                    userAddress={user?.address}
                    mintAction={async () => {
                      if (user?.address && trait.token_id) {
                        setCurrentMintedTrait(trait); // Set current minted trait
                        await mintWithWeth(user.address, trait.token_id, discountedPrice, provider);
                        handleMintSuccess(trait); // Call handleMintSuccess after successful mint
                      } else {
                        console.error("User address or token ID is undefined");
                      }
                    }}
                    className={isDiscounted ? 'discounted-mint-btn' : 'test'}
                  />
                )}*/}
              </div>
            );
          })}
        </div>
            <div className="pagination-controls flex md:m-auto justify-between">
            <button className={`bg-hunnys-blue paginate text-hunnys-yellow w-full max-w-[180px] font-title shadow-md rounded-full text-4xl hover:shadow-lg hover:scale-[1.02] transition-all ${currentPage === 1 ? 'opacity-40 cursor-not-allowed justify-between' : ''}`} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>PREV</button>
            <button className={`bg-black paginate text-white font-title shadow-md rounded-full text-2xl px-6 hover:shadow-lg hover:scale-[1.02] paginateNum transition-all ${currentPage === 1 ? 'hidden' : ''}`}  onClick={() => setCurrentPage(1)}>1</button>
            <button className={`bg-black paginate text-white font-title shadow-md rounded-full text-2xl px-6 hover:shadow-lg hover:scale-[1.02] transition-all opacity-40 cursor-not-allowed`} disabled>{currentPage}</button>
            <button className={`bg-black paginate text-white font-title shadow-md rounded-full text-2xl px-6 hover:shadow-lg hover:scale-[1.02] paginateNum  transition-all  ${currentPage === pageTotal ? 'hidden' : ''} ${currentItems.length < ITEMS_PER_PAGE ? 'opacity-40 cursor-not-allowed' : ''}`} disabled={currentItems.length < ITEMS_PER_PAGE} onClick={() => setCurrentPage(pageTotal)}>{pageTotal}</button>
            <button className={`bg-hunnys-yellow paginate text-hunnys-blue w-full max-w-[180px] font-title shadow-md rounded-full  text-4xl hover:shadow-lg hover:scale-[1.02] transition-all ${currentItems.length < ITEMS_PER_PAGE ? 'opacity-40 cursor-not-allowed justify-between' : ''}`} disabled={currentItems.length < ITEMS_PER_PAGE} onClick={() => setCurrentPage(currentPage + 1)}>NEXT</button>
                </div>
        </div>
    </>
  );
}