import { useState, useEffect, useRef } from "react";
// import { ethers } from "ethers";
import { useAtom } from "jotai";
import { userAtom, modalAtom, savedAtom } from "../../data/store";
import { useSignMessage } from 'wagmi';
import ApplyButton from "./ApplyButton";
import SecondaryButton from "./SecondaryButton";
import BackButton from "./BackButton";
import Render from "../Render/Render";
import GridView from "./GridView";
import ListView from "./ListView";
import CardView from "./CardView";
import ItemView from "./ItemView";
import DollEditorOptions from "./DollEditorOptions";
import Icon from "../Icon/Icon";

import { attributes, localStorageToken } from "../../data/config";
import { Trait } from "../../data/global";

// if token is missing attributes, just add empty trait there
function formatToken(input: Trait[]) {
  if (!input) {
    input = [];
  }
  // console.log("dolleditor formattoken input", input);
  attributes.map((attribute) => {
    if (input.filter((x) => x.attribute === attribute).length <= 0) {
      // console.log(attribute, "doesn't exist");
      input.push({
        name: "Empty",
        colorsApplied: [],
        attribute: attribute,
        tags: [],
        colors: [],
        rarity: "common",
        origin_id: 0
      });
    }
  });
  return input;
}

// Helper function for comparing tokens
function areTokensEqual(token1: any[], token2: any[]) {
  if (token1.length !== token2.length) {
    return false;
  }

  const stringifyTrait = (trait: any) => JSON.stringify({ ...trait, token_id: undefined });

  const token1Strings = token1.map(stringifyTrait);
  const token2Strings = token2.map(stringifyTrait);

  return token1Strings.every(t1 => token2Strings.includes(t1)) &&
         token2Strings.every(t2 => token1Strings.includes(t2));
}

export default function DollEditor(props: { id: number; selectDoll: Function }) {
  const [user, userSet] = useAtom(userAtom);
  const [saved, setSaved] = useAtom(savedAtom); // tracks if user saved dolly changes
  const [view, viewSet] = useState("grid");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [token, tokenSet] = useState<Trait[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTrait, selectedTraitSet] = useState<Trait>();
  const [modal, modalSet] = useAtom(modalAtom);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    console.log("Initial token state:", JSON.stringify(token));
    load();
  }, []);
  
  function logDifferences(currentToken: Trait[], savedToken: Trait[]) {
    const stringifyTrait = (trait: Trait) => JSON.stringify({ ...trait, token_id: undefined });
  
    currentToken.forEach(currentTrait => {
      const currentTraitString = stringifyTrait(currentTrait);
      if (!savedToken.some(savedTrait => stringifyTrait(savedTrait) === currentTraitString)) {
        console.log("Unsaved change detected in trait:", currentTrait);
      }
    });
  
    savedToken.forEach(savedTrait => {
      const savedTraitString = stringifyTrait(savedTrait);
      if (!currentToken.some(currentTrait => stringifyTrait(currentTrait) === savedTraitString)) {
    //    console.log("Missing saved trait in current token:", savedTrait);
      }
    });
  }
  
  useEffect(() => {
    const savedTokenString = localStorage.getItem(localStorageToken);
    if (savedTokenString) {
      const savedToken = JSON.parse(savedTokenString);
      const isSaved = areTokensEqual(token, savedToken);
      setSaved(isSaved);
      if (!isSaved) {
        logDifferences(token, savedToken);
      }
    }
  }, [token, setSaved]);
  

  async function save() {
    console.log("Token state before save:", JSON.stringify(token));
    let formData = new FormData();
    setIsSaving(true);
    let signature: any = await getSignature(user!.address);

    formData.append("wallet", user!.address);
    formData.append("signature", signature);
    formData.append("token_id", props.id.toString());
    formData.append("data", JSON.stringify({ token: token, name: name }));

    
    fetch(`https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/updateClone`, {
            method: "post",
            body: formData,
        })
        .then(response => response.json().then(data => {
          if (!response.ok) {
              const formattedMessage = data.message
                  .replace(/<trait>/g, '<span class="text-red-500 font-luckiest">')
                  .replace(/<\/trait>/g, '</span>')
                  .replace(/<attribute>/g, '<span class="text-red-500 font-luckiest">')
                  .replace(/<\/attribute>/g, '</span>');
              throw new Error(formattedMessage || 'An unexpected error occurred, please visit discord.gg/hunnys for help!');
          }
          return data;
      }))      
      .then(data => {
        setIsSaving(false);
        if (data.status === 200) {
            updateUserToken(token, props.id);
            setUnsavedChanges(false);
            setSaved(true); // Update the saved state to true upon successful save
        }
    })
    .catch(error => {
        setIsSaving(false);
        setErrorMessage(error.message);
        console.log('Error:', error.message);
    });
      
      console.log("Token state after save:", JSON.stringify(token));
    }

  function updateUserToken(token: any, id: any) {
    for (let i = 0; i < (user?.dollys || []).length; i++) {
      if(user && user?.dollys[i].token_id === id) {
        user.dollys[i].attributes = token;
        userSet(user);
        break;
      }
    }
  }

  async function load() {
    let newToken: any = await getDollMetadata(props.id);
    let attr = newToken.length > 0 ? newToken[0].attributes : [];
    newToken = formatToken(attr);

    tokenSet(newToken);

    // Remember the original state of the token
    localStorage.setItem(localStorageToken, JSON.stringify(newToken));
  }

  function getSignature(wallet: string) {
    return new Promise(async function (resolve) {
      let signatureToken: any = await requestSignatureToken(wallet);

      let signature: any = await formatSignature(signatureToken.authToken);

      resolve(signature);
    });
  }

  function unselectDolly() {
    console.log("Attempting to unselect Dolly, saved state:", saved);
    if (!saved) {
      modalSet({
        active: true,
        title: "Unsaved changes",
        body: (
          <>
            <div className="mb-3 px-2">
              You haven&apos;t saved the current setup of your Dolly yet, bb!
              <br /> Do you still want to proceed?
            </div>
            <div className="grid grid-cols-2">
              <SecondaryButton onClick={() => modalSet({ active: false, title: "", body: <></> })}>
                No, take me back
              </SecondaryButton>
              <ApplyButton
                onClick={() => {
                  modalSet({ active: false, title: "", body: <></> });
                  setSaved(true);
                  props.selectDoll(-1);
                }}
                text="Yes, I'm sure"
              />
            </div>
          </>
        ),
      });
    } else {
      props.selectDoll(-1);
    }
  }

  const { signMessageAsync } = useSignMessage();

  function formatSignature(signatureToken: string) {
    return new Promise(async function (resolve) {
      const signature = await signMessageAsync({
        // message: message.prepareMessage(),
        message: signatureToken,
      })

      // console.log(signature)

      resolve(signature);
    });
  }

  function requestSignatureToken(wallet: string) {
    return new Promise(async (resolve) => {
      fetch(
        // `${serverPath}/dolly/${id}`
        `https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/auth?wallet=${wallet}`
      )
        .then((response) => response.json())
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("Error:", err.message);
        });
    });
  }

  function getDollMetadata(id: number) {
    // console.log("getDollMetadata", id);

    return new Promise(async (resolve) => {
      fetch(
        // `${serverPath}/dolly/${id}`
        `https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/getCloneData?tokenIds[]=${id}`
      )
        .then((response) => response.json())
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("Error:", err.message);
        });
    });
  }

  function setSavingText() {
    
      let text = "Save Dolly";
      if(isSaving) {
        text = "Saving..";
      } else if ( saved) {
        text = "Saved!"
      }

      return text;
  }
  

  return (
    <div className="min-h-screen max-w-[1250px] mx-6">
    {/* <div className="min-h-screen max-w-[1160px] mx-6"> */}
      {/* Title */}
      {/* <h1 className="text-[#555] font-bold py-1">Dress up your Dolly</h1> */}

      {/* BUTTONS */}
      <div className="flex justify-between gap-2 bg-white px-3 py-2 shadow-md mb-6 rounded-lg mobile-line-height">
        <BackButton onClick={unselectDolly} text="Change Dolly" />
        <div className="flex">
        {errorMessage && (
  <p className="font-dmsans font-thin self-center" dangerouslySetInnerHTML={{ __html: errorMessage }}></p>
)}
          <SecondaryButton onClick={load}>
            <Icon type="reset" className="w-[17px] h-[16px] pr-[1px] mr-[4px] fill-[#888]" />
            Reset All Changes
          </SecondaryButton>
          <ApplyButton disableBtn={saved || isSaving} onClick={save} text={setSavingText()} />
        </div>
      </div>

      {/* Doll gallery */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] lg:grid-cols-2 gap-6">
        {/* DOLL IMG */}
        <div className="relative aspect-square">
        {/* 'Preview' flag on Dolly image
        <p className="z-40 select-none absolute top-7 bg-white rounded-r-md pr-4 pl-3 py-1 tracking-wide shadow-md font-bold">
            Preview
          </p> */}
          <Render token={token} download dollyId={props.id} />
          {/* asd */}
          <div className="bg-white rounded-lg p-4 shadow-lg mt-[65px]">
            <h1 className="font-bold text-xl text-[#666]">Dolly #{props.id}</h1>
            {/* <h1 className="border-b border-[#ddd] mb-2 font-bold text-xl text-[#666]">Dolly #{props.id}</h1> */}

            {/* <a
              className="font-bold text-blue-700 underline"
              target="_blank"
              rel="noreferrer"
              href={`https://testnets.opensea.io/assets/goerli/0xfbc56b6a79e76ceca94f405a9d1c24c8b9eb4f42/${props.id}`}
            >
              OpenSea
            </a> */}
          </div>
        </div>

        <div className="">
          {/* CURRENTLY SELECTED ITEM */}
          {selectedTrait && (
            <ItemView selectedTrait={selectedTrait} selectedTraitSet={selectedTraitSet} tokenSet={tokenSet} />
          )}

          {/* DISPLAY ALL ITEM SLOTS */}
          {!selectedTrait && (
            <>
              <DollEditorOptions token={token} tokenSet={tokenSet} view={view} viewSet={viewSet} />
              {view === "list" && <ListView token={token} selectedTraitSet={selectedTraitSet} />}
              {view === "card" && <CardView token={token} selectedTraitSet={selectedTraitSet} />}
              {view === "grid" && <GridView token={token} selectedTraitSet={selectedTraitSet} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
