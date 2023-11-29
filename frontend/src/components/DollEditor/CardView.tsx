import { Trait } from "../../data/global";
import { attributes, thumbnailPath } from "../../data/config";
import Image from "next/image";

export default function CardView(props: {
  token: any;
  selectedTraitSet: React.Dispatch<React.SetStateAction<Trait | undefined>>;
}) {
  // Make sure it's always the same order
  function getToken() {
    // Make sure it's always the same order
    return props.token.sort((a: Trait, b: Trait) => {
      if (attributes.findIndex((x) => x == a.attribute) > attributes.findIndex((x) => x == b.attribute)) {
        return 1;
      }
    });
  }

  return (
    <div className="relative mb-4 grid grid-cols-2 gap-2">
      {getToken().map((trait: Trait, index: number) => (
        <button
          key={index}
          onClick={() => props.selectedTraitSet(trait)}
          className="bg-hunnys-blue shadow-md rounded-lg mr-1 mb-1 overflow-hidden grid grid-cols-[100px_1fr]"
        >
          <Image width={600} height={600}
            className="w-full h-full"
            src={`/${thumbnailPath}/${trait.attribute}/${trait.name}.jpg`}
            alt={trait.name}
          />

          <div className="flex-center w-full h-full">
            <div className="grid grid-cols-1 w-full">
              <Image width={600} height={600}
                src={`/attributes/${trait.attribute}.svg`}
                alt={`${trait.attribute} svg icon`}
                className="h-8 w-8 mx-auto pb-[3px]"
              />
              <div className="text-[#ddf] pt-[2px] text-center">{trait.attribute}</div>
              <div className="font-bold text-white text-center">{trait.name}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
