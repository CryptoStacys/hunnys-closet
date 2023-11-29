import { useState, useEffect, useRef } from "react";
import { Trait } from "../../data/global";
import Icon from "../Icon/Icon";
import { useAtom } from "jotai";
import { userAtom, modalAtom, savedAtom } from "../../data/store";

import ApplyButton from "./ApplyButton";
import SecondaryButton from "./SecondaryButton";
import { attributes } from "../../data/config";
import { randomNumber } from "../../utils/randomNumber";
import { motion } from "framer-motion";
import { localStorageKey } from "../../data/config";
import { log } from "console";

export default function DollEditorOptions(props: {
  view: any;
  viewSet: React.Dispatch<React.SetStateAction<string>>;
  tokenSet: Function;
  token: any;
}) {
  const [user, userSet] = useAtom(userAtom);
  const [modal, modalSet] = useAtom(modalAtom);
  const [showSaveModalChecked, setShowSaveModalChecked] = useState(user!.hideSaveChangesModal);

  function getColorsAvailable() {
    const colorsAvailable: string[] = Object.values(user!.colors);
    return colorsAvailable;
  }

  // checks if the user got more traits and only selects a not empty trait if the percentage matches
  function handleSpecialTraits(traits: Trait[], selectPercent: any) {
    // check if user got more than 1 trait to chose from
    let result: any;
    let rolledPercent = randomNumber(0, 100);
    if (traits.length > 1 && rolledPercent <= selectPercent) {
      let filteredTraits = traits.filter((trait: Trait) => trait.name !== "Empty");
      result = filteredTraits[randomNumber(0, filteredTraits.length - 1)];
    } else {
      result = traits.find((ele: Trait) => {
        return ele.name === "Empty";
      });
    }

    return result;
  }

  function randomTrait(traits: Trait[]) {
    // do include empty traits
    // traits = traits.filter((trait: Trait) => trait.name !== "Empty");
    let trait: Trait = traits[randomNumber(0, traits.length - 1)];

    switch (trait.attribute) {
      // 1% only select Frames
      case "Frame":
        trait = handleSpecialTraits(traits, 1);
        break;
      // 1% only select Bodysuit
      case "Bodysuit":
        trait = handleSpecialTraits(traits, 1);
        break;
      case "Hand": // 30% only select Hand
        trait = handleSpecialTraits(traits, 30);
        break;
      case "Tattoo": // 40% only select Tattoo
        trait = handleSpecialTraits(traits, 40);
        break;
    }

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

  function randomizeAll() {
    // Get all traits owned by user
    let traits = user!.traits;

    //// Filter out duplicates
    // don't filter duplicates, the api already filters that
    // let uniqueTraits = new Set();
    // traits = traits.filter((obj: Trait) => {
    //   if (!uniqueTraits.has(obj.name)) {
    //     uniqueTraits.add(obj.name);
    //     return true;
    //   }
    //   return false;
    // });

    // pick one trait per attribute type
    const newToken = attributes.map((attribute) => {
      // Filter only selected attribute
      let filteredTraits = traits.filter((trait: Trait) => trait.attribute === attribute);

      // List of attributes that should not get an Empty trait when randomizing because it looks weird
      const noEmpty = ["Mouth", "Skin", "Eyebrows", "Eyes"];
      if (noEmpty.includes(attribute)) {
        // console.log("attr test filter", attribute);
        filteredTraits = filteredTraits.filter((trait: Trait) => trait.name !== "Empty");
      }
      // if (attributes.includes)
      // console.log("filteredTraits: ", filteredTraits, attribute);
      return randomTrait(filteredTraits);
    });

    props.tokenSet(newToken);
  }

  function disableSHowModal() {
    user!.hideSaveChangesModal = !user!.hideSaveChangesModal;
    setShowSaveModalChecked(user!.hideSaveChangesModal);
    userSet(user);
  }

  

  function unequipAll() {
    if(!user!.hideSaveChangesModal) {
      modalSet({
        active: true,
        title: "Unequip All",
        body: (
          <>
            <div className="mb-3 px-2">
              Do you realy want to unequip all Traits? 
              All traits get set to Empty,
              <br /> do you still want to proceed?
              <br /> 
              <label>
                <input
                  type="checkbox"
                  defaultChecked={showSaveModalChecked}
                  onChange={(e) => {
                    disableSHowModal();
                }}
                />
                Do not show again.
              </label>
              
            </div>
            <div className="grid grid-cols-2">
              <SecondaryButton onClick={() => modalSet({ active: false, title: "", body: <></> })}>
                No, take me back
              </SecondaryButton>
              <ApplyButton
                onClick={() => {
                  modalSet({ active: false, title: "", body: <></> });
                  const newToken = attributes.map(
                    (attribute) =>
                      new Object({
                        name: "Empty",
                        origin_id: 0,
                        token_id: 0,
                        attribute,
                        tags: [],
                      })
                  );
                  props.tokenSet(newToken);
                }}
                text="Yes, I'm sure"
              />
            </div>
          </>
        ),
      });
    } else {
      const newToken = attributes.map(
        (attribute) =>
          new Object({
            name: "Empty",
            origin_id: 0,
            token_id: 0,
            attribute,
            tags: [],
          })
      );
      props.tokenSet(newToken);
    }
    
  }

  return (
    <div className="bg-white rounded-lg mb-3 shadow-lg py-2 px-3 flex justify-between">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <SecondaryButton onClick={unequipAll}>
          <Icon type="unequip" className="w-[20px] h-[20px] fill-[#888] pt-[1px] pb-[4px] ml-[-5px] mr-[5px]" />
          Unequip all
        </SecondaryButton>
        <SecondaryButton onClick={randomizeAll}>
          <Icon type="dice" className="w-[26px] h-[26px] fill-[#888] pt-[2px] pb-[3px] ml-[-5px] mr-[3px]" />
          Randomize all
        </SecondaryButton>
      </div>
      <div className="flex-center">
        <div className="flex-center gap-1">
          {["list", "card", "grid"].map((x, index) => (
            <motion.button
              initial={{ scale: 1.0 }}
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-[3px] bg-hunnys-blue rounded-lg"
              onClick={() => props.viewSet(x)}
              style={{
                background: props.view === x ? "#6510f1" : "#ddd",
              }}
            >
              <Icon type={x} className="h-8 w-8 fill-transparent stroke-[#fff]" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
