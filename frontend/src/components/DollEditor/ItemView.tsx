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

import Image from "next/image";

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
  const [sortedItems, setSortedItems] = useState<any[]>([]);
  const ITEMS_PER_PAGE = 12;  // Display 12 Dollys per page, adjust as needed

  // state to check which color is being edited
  const [selectedColor, selectedColorSet] = useState(-1);

  // User object with all ownership data
  const [user] = useAtom(userAtom);
  const [allTraits] = useAtom(allTraitsAtom);

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

  // Get all traits to choose from
  // function getAllTraits() {
  //   // Get all traits owned by user
  //   // let data = user!.collections.collections[0].tokenData.traitData;
  //   let data = allTraits!.traits;

  //   // Filter only selected attribute
  //   data = data.filter((trait: Trait) => trait.attribute === props.selectedTrait!.attribute);

  //   // Filter out duplicates
  //   let uniqueTraits = new Set();
  //   data = data.filter((obj: Trait) => {
  //     if (!uniqueTraits.has(obj.name)) {
  //       uniqueTraits.add(obj.name);
  //       return true;
  //     }
  //     return false;
  //   });

  //   data = data.sort((a: Trait, b: Trait) => {
  //     if (a.name == "Empty" && b.name !== "Empty") return -1;
  //     return 1;
  //   })
  //   // Always show owned Traits after Empty
  //   let sortedData = data.sort((a: Trait, b: Trait) => {
  //     if (checkForOwnedTrait(a) && !checkForOwnedTrait(b)) return -1;
  //     return 1;
  //   });


  //   // setCurrentPage(1);

  //   // const startIndex = (currentPage - 1) * DOLLYS_PER_PAGE;
  //   // const endIndex = 0 + DOLLYS_PER_PAGE;
  //   // const currentDollys = sortedData.slice(startIndex, endIndex);

  //   // Sorting
  //   return sortedData;
  // }

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
        result = `https://buy.hunnys.io/polygon/asset/0x0b54fbd0139a2da92ff41fd9ed56adcf89d87001:${trait.token_id || ''}`;
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

  function checkForOwnedTrait(trait: Trait) {
    let result = false;

    let userTraits = getTraits();
    let traitMatch = userTraits.findIndex((ele) => { return (ele.name === trait.name) && (ele.attribute === trait.attribute)})
    if(traitMatch !== -1 || trait.name === 'Empty') {
      result = true;
    }

    return result;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = sortedItems.slice(startIndex, endIndex);

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
        </div>
      </div>
      {/* BACKPACK */}
      <div>
        {/* EQUIPPED DYES */}
        {getColors().length > 0 && (
          <>
            <div className="font-bold text-gray-600 mt-6 mb-1">Select your dyes</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3">
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
              ))}
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

              {/* FILTERED AVAILABLE COLORS  */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-3 mb-4 mt-6">
                {getColorsAvailable()
                  .sort()
                  .filter((x) => true)
                  .map((color: string, index: number) => (
                    <motion.button
                      key={index}
                      initial={{
                        background: "#fff",
                        color: "#666",
                        opacity: 0,
                        translateY: -6,
                      }}
                      animate={{
                        opacity: 1,
                        transition: { delay: 0.02 * index },
                        translateY: 0,
                      }}
                      exit={{
                        opacity: 0,
                        translateY: -6,
                      }}
                      whileHover={{
                        scale: 1.06,
                        background: colorNameToRGB(color),
                        color: "#fff",
                        transition: { delay: 0, duration: 0.08 },
                      }}
                      onClick={() => setColor(selectedColor, color)}
                      className="select-none shadow-md rounded-full flex text-sm font-bold"
                    >
                      <div
                        className=" h-[36px] aspect-square rounded-full border-[4px] border-white"
                        style={{
                          background: colorNameToRGB(color),
                        }}
                      ></div>
                      <div className="ml-[-10px] w-full h-[36px] flex-center">{color}</div>
                    </motion.button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* OTHER ITEMS */}
        <div className="mb-12">
          <div className="font-bold pl-1 mt-8 text-[#444]">Items</div>
          <div className="grid grid-cols-4 w-full gap-y-3 gap-x-2 pb-6">
            {/* {getTraits() */}
            {
            //getAllTraits()
              // Always have "Empty" as the first trait in the list
              // .sort((a: Trait, b: Trait) => {
              //   if (a.name == "Empty" && b.name !== "Empty") return -1;
              //   return 1;
              // })
              // // Always show owned Traits after Empty
              // .sort((a: Trait, b: Trait) => {
              //   if (checkForOwnedTrait(a) && !checkForOwnedTrait(b)) return -1;
              //   return 1;
              // })
              currentItems
              .map((trait: Trait, index: number) => (
                <motion.button
                  initial="hidden"
                  animate="visible"
                  variants={variants}
                  key={index}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0px 10px 15px -3px rgb(0,0,0 / 0.1), 0 4px 6px -4px rgb(0,0,0/0.1)",
                    transition: { delay: 0, duration: 0.2 },
                  }}
                  onClick={() => setTraits(trait)}
                  className={`relative ${!checkForOwnedTrait(trait)? ' low-brightness' : ''}`}
                >
                  <div
                    className="absolute right-2 top-2 rounded-full h-[16px] w-[16px] border-[3px] border-white"
                    style={{
                      background: hunnysColors[trait.rarity!.toLocaleLowerCase()],
                    }}
                  ></div>

                    <Image width={600} height={600} priority={true}
                      className="w-full shadow-lg aspect-square flex-center"
                      src={`/${thumbnailPath}/${trait.attribute}/${trait.name}.jpg`}
                      alt={trait.name}
                    />
                    <div style={{backgroundColor: '#a264f4'}} className={`shadow-lg rounded-b-lg text-white w-full h-auto justify-center items-center font-bold break-words py-2 px-2`}>{trait.name}</div>

                </motion.button>
              ))}
            </div>
            <div className="pagination-controls flex">
                <button className={`bg-hunnys-blue paginate text-hunnys-yellow w-full font-title shadow-md rounded-full px-3 py-1 text-4xl hover:shadow-lg hover:scale-[1.02] transition-all ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : ''}`} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                <button className={`bg-hunnys-yellow paginate text-hunnys-blue w-full font-title shadow-md rounded-full px-3 py-1 text-4xl hover:shadow-lg hover:scale-[1.02] transition-all ${currentItems.length < ITEMS_PER_PAGE ? 'opacity-40 cursor-not-allowed' : ''}`} disabled={currentItems.length < ITEMS_PER_PAGE} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
        </div>
      </div>
    </>
  );
}