import { attributes, thumbnailPath } from "../../data/config";
import { Trait } from "../../data/global";
import Image from "next/image";

export default function GridView(props: {
  token: any;
  selectedTraitSet: React.Dispatch<React.SetStateAction<Trait | undefined>>;
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
