import { Trait } from "../../data/global";
import { attributes } from "../../data/config";
import Image from "next/image";

export default function ListView(props: {
  token: any;
  selectedTraitSet: React.Dispatch<React.SetStateAction<Trait | undefined>>;
}) {
  // Make sure it's always the same order
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
    <div className="block w-full mb-4 ">
      {getToken().map((trait: Trait, index: number) => (
        <button
          key={index}
          onClick={() => props.selectedTraitSet(trait)}
          className="w-full bg-hunnys-blue shadow-md pl-2 pr-3 py-1 rounded-lg mr-1 mb-1 overflow-hidden grid grid-cols-[40px_1fr]"
        >
          <Image width={32} height={32}
            src={`/attributes/${trait.attribute}.svg`}
            alt={`${trait.attribute} svg icon`}
            className="h-8 w-8 mr-2 py-[3px]"
          />
          <div className="flex items-center justify-between h-full">
            <div className="text-[#eee]">{trait.attribute}</div>
            <div className="font-bold text-white">{trait.name}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
