import { attributes, thumbnailPath } from "../../data/config";
import { Trait } from "../../data/global";
import Image from "next/image";
import { useEffect, useState } from 'react';

export default function GridView(props: {
  traitCounts: any;
  token: any;
  selectedTraitSet: React.Dispatch<React.SetStateAction<Trait | undefined>>;
  allTraits: any; // Ensure this is the correct type for your data structure
}) {
  function getToken() {
    // Make sure it's always the same order
    return props.token.sort((a: Trait, b: Trait) => {
      if (attributes.findIndex((x) => x == a.attribute) > attributes.findIndex((x) => x == b.attribute)) {
        return 1;
      } else {
        return -1;
      }
    });
  }
  
  const [traitCounts, setTraitCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    // Call calculateTraitCounts whenever allTraits changes
    setTraitCounts(calculateTraitCounts());
  }, [props.allTraits]);
  const calculateTraitCounts = (): Record<string, number> => {
    const counts: Record<string, number> = {};
  
    console.log(props.allTraits);
  
    // Check if props.allTraits is an array and has elements
    if (Array.isArray(props.allTraits) && props.allTraits.length > 0) {
      props.allTraits.forEach((trait: { attribute: string; }) => {
        counts[trait.attribute] = (counts[trait.attribute] || 0) + 1;
      });
    } else {
      // Handle the case where props.allTraits is not an array or is empty
      console.log("props.allTraits is not an array or is empty:", props.allTraits);
    }
  
    return counts;
  };
  
  
  
  console.log("props.traitCounts:", props.traitCounts);
  
  

  function setSelectImage(trait: any) {
    let result = `${thumbnailPath}/${trait.attribute}/${trait.name}.jpg`;
    if(trait.name === 'Empty') {
      result = `${thumbnailPath}/${trait.attribute}/Choose-${trait.name}.jpg`;
    }

    return result;
  }

  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-4 overflow-scroll max-h-[600px] pr-1">
      {getToken().map((trait: Trait, index: number) => (
        <button
          onClick={() => props.selectedTraitSet(trait)}
          key={index}
          className="hover:cursor-pointer relative bg-white shadow-md rounded-lg"
        >
          <div className={`py-[3px] px-[5px] bg-hunnys-blue flex-center rounded-t-lg flex w-full`}>
            <Image width={32} height={32}
              src={`/attributes/${trait.attribute}.svg`}
              alt={`${trait.attribute} svg icon`}
              className="h-6 w-6 p-[2px] ml-[-4px] fill-white stroke-white"
            />
            <div className="font-bold text-white pl-2 text-sm py-1 rounded-b-lg">
              {trait.attribute}
              {/* Displaying the badge with the count 
              <span className="badge">{props.traitCounts[trait.attribute] || 0}</span>*/}
              {/* <br />
              {trait.name} */}
            </div>
          </div>
          <div className="relative mb-6">
            {trait.name === 'Empty' && (
              <div className="absolute flex flex-center h-full w-full">
                <Image width={600} height={600}
                  className="aspect-square w-20"
                  src={`/choose-icon.png`}
                  alt={trait.name}
                />
              </div>
            )}

            <Image width={600} height={600}
              className="aspect-square"
              src={`/${thumbnailPath}/${trait.attribute}/${trait.name}.jpg`}
              alt={trait.name}
            />
          </div>
          <div style={{backgroundColor: '#a264f4', position: 'absolute', bottom: '0px'}} className=" w-full font-bold text-white text-sm py-[3px] rounded-b-lg">
            {/* <div className="text-sm font-normal">{trait.attribute}</div> */}
            {trait.name}
          </div>
        </button>
      ))}
    </div>
  );
}
