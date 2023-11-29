import Icon from "../Icon/Icon";
import SecondaryButton from "./SecondaryButton";
import { randomNumber } from "../../utils/randomNumber";
import { Trait } from "../../data/global";

export default function ItemViewOptions(props: {
  selectedTrait: any;
  setTraits: Function;
  getTraits: Function;
  back: Function;
}) {
  function randomizeTrait() {
    let traits = props.getTraits();

    // remove empty trait
    traits = traits.filter((trait: Trait) => trait.name !== "Empty");
    traits = traits.filter((trait: Trait) => trait.name !== props.selectedTrait.name);
    if (traits.length > 0) {
      props.setTraits(traits[randomNumber(0, traits.length - 1)]);
    }
  }

  function back() {
    props.back();
  }

  function unequipTrait() {
    let traits = props.getTraits();
    let emtyTrait = traits.find((ele: Trait) => {
      return ele.attribute === props.selectedTrait.attribute && ele.name === "Empty";
    });

    props.setTraits(emtyTrait);
  }

  return (
    <div className="bg-white rounded-lg mb-3 shadow-lg py-2 px-3 flex justify-between">
      <SecondaryButton onClick={back}>
        <Icon type="prev" className="w-[15px] h-[15px] fill-[#888] ml-[-2px] mr-[8px]" />
        Back
      </SecondaryButton>
      <div className="flex">
        <SecondaryButton onClick={unequipTrait}>
          <Icon type="unequip" className="w-[26px] h-[26px] fill-[#888] pt-[2px] pb-[3px] ml-[-5px] mr-[3px]" />
          Unequip
        </SecondaryButton>
        <SecondaryButton onClick={randomizeTrait}>
          <Icon type="dice" className="w-[26px] h-[26px] fill-[#888] pt-[2px] pb-[3px] ml-[-5px] mr-[3px]" />
          Randomize
        </SecondaryButton>
      </div>
    </div>
  );
}
