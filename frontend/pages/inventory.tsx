import { useAtom } from "jotai";
import { userAtom, allTraitsAtom } from "../src/data/store";
import { attributes, thumbnailPath } from "../src/data/config";
import { useState } from "react";
import { hunnysColors } from "../src/data/config";
import Help from "../src/components/Help/Help";
import Icon from "../src/components/Icon/Icon";
import Image from "next/image";
import Link from "next/link";

export default function Items() {
  const [user] = useAtom(userAtom);
  const [categoryFilter, categoryFilterSet] = useState("Background");
  const [rarityFilter, rarityFilterSet] = useState(["common"]);
  const newTrait: any = {};
  const [selectedTrait, selectedTraitSet] = useState(newTrait);
  const [allTraits] = useAtom(allTraitsAtom);

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
    // Get all traits owned by user
    // let data = user!.collections.collections[0].tokenData.traitData;
    let data = allTraits!.traits;

    // console.log('all traits: ', allTraits);

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
        result = `https://buy.hunnys.io/polygon/asset/0x0b54fbd0139a2da92ff41fd9ed56adcf89d87001:${trait.token_id || ''}`;
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
              {/* <Help
            {...{
              title: "Item inventory",
              body: "Stuff you can equip goes in here",
            }}
            className="absolute top-3 right-3"
          /> */}
              {getAllItems()
              .sort((a: any, b: any) => {
                if (checkForOwnedTrait(a) && !checkForOwnedTrait(b)) return -1;
                return 1;
              })
              .map((item: any, index: number) => (
                <Link href="#itemView" onClick={handleScroll} key={index}>
                  <button
                    onClick={() => {
                      selectedTraitSet(item);
                    }}
                    style={{backgroundColor: '#a264f4'}}
                    className="transition hover:scale-[1.02] shadow-sm hover:shadow-lg grid grid-cols-1 text-white rounded-lg overflow-hidden"
                  >
                    <img
                      className={`w-full  ${!checkForOwnedTrait(item)? ' low-brightness' : ''}`}
                      src={`${thumbnailPath}/${item.attribute}/${item.name}.jpg`}
                      alt={item.name}
                    />
                    <div className={`shadow-lg rounded-b-lg text-white w-full h-auto justify-center items-center font-bold break-words py-2 px-2`}>{item.name}</div>
                    {/* <div className={`w-full flex h-full justify-center items-center font-bold`}>{item.name}</div> */}
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
