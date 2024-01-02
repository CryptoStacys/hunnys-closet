import { useState, useEffect, useRef, SetStateAction } from "react";
// import { ethers } from "ethers";
import { useAtom } from "jotai";
import { userAtom, modalAtom, savedAtom } from "../../data/store";
import { useSignMessage } from 'wagmi';
import ApplyButton from "./ApplyButton";
import SecondaryButton from "./SecondaryButton";
import BackButton from "./BackButton";
import Render from "../Render/Render";
import Link from "next/link"
import GridView from "./GridView";
import ListView from "./ListView";
import CardView from "./CardView";
import ItemView from "./ItemView";
import DollEditorOptions from "./DollEditorOptions";
import Icon from "../Icon/Icon";
import { allTraitsAtom } from "../../data/store";

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
  const [allTraits] = useAtom(allTraitsAtom);
  const [user, userSet] = useAtom(userAtom);
  const [saved, setSaved] = useAtom(savedAtom); // tracks if user saved dolly changes
  const [view, viewSet] = useState("grid");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [token, tokenSet] = useState<Trait[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTrait, selectedTraitSet] = useState<Trait>();
  const [modal, modalSet] = useAtom(modalAtom);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dollyImageDataURL, setDollyImageDataURL] = useState("");
  const [selectedHeadline, setSelectedHeadline] = useState("");
  
  function getRandomHeadline() {
    const headlines = [
      "Omg, you look incredible!", "Hupe hupe hooray, you slay all day!", "Wow nice dolly, looks rare", 
      "Hellloooo, cupcake!", "Felt cute, never deleting later", "Gurrrlllll", "Good golly, miss dolly!", 
      "Wow, can you say #colorharmony?", "And just when I thought you couldn't get any cuter", 
      "Umm, I'm obsessed", "Omg can I get a selfie with u?"
    ];
    const randomIndex = Math.floor(Math.random() * headlines.length);
    return headlines[randomIndex];
  }
  
function setRandomHeadline() {
  const headline = getRandomHeadline();
  setSelectedHeadline(headline); // Store the selected headline in state
  return headline;
}

  useEffect(() => {
    console.log("Initial token state:", JSON.stringify(token));
    load();
  }, []);


    // Function to generate tweet URL
    function generateTweetUrl(headline: any) {
      const tweetText = encodeURIComponent(`Just gave my Dolly from @HunnysNFT a makeover, and Bunny Queen Mika said '${headline}'! Unleash your creativity with me at https://closet.hunnys.io`);
      return `https://twitter.com/intent/tweet?text=${tweetText}`;
    }




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

  function downloadDollyImage(dataURL: string) {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "Dolly.png"; // or any other filename you want
    document.body.appendChild(link); // Need to append for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
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
    document.documentElement.scrollTop = 0; // For modern browsers
    document.body.scrollTop = 0; // For older browsers
  }, [token, setSaved]);
  

  async function save() {
    setIsSaving(true);
    const newHeadline = getRandomHeadline();
    setSelectedHeadline(newHeadline);
    setSuccessMessage(""); // Reset success message
    console.log("Token state before save:", JSON.stringify(token));
    let formData = new FormData();
    setIsSaving(true);
    let signature: any = await getSignature(user!.address);

    formData.append("wallet", user!.address);
    formData.append("signature", signature);
    formData.append("token_id", props.id.toString());
    formData.append("data", JSON.stringify({ token: token, name: name }));

    
    try {
      const response = await fetch(`https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/updateClone`, {
        method: "post",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Error saving Dolly');
      }

      updateUserToken(token, props.id);
      setSaved(true); // Set saved to true after successful save
      setIsSaving(false); // Reset isSaving to false

      modalSet({
        active: true,
        title: "",
        body: (
          <div className="text-center p-6">
            <h2 className="text-3xl font-luckiest mb-4 text-[#333]">{newHeadline}</h2>
            {dollyImageDataURL && (
              <>
                <img src={dollyImageDataURL} alt="Your Dolly" className="mx-auto modalDolly" />
                <br></br>
                <p className="mb-2">You can come back and give your Dolly a new look any time - for free!</p>
                <button onClick={() => downloadDollyImage(dollyImageDataURL)} className="bg-hunnys-blue mb-4 text-hunnys-yellow w-full font-luckiest shadow-md rounded-full mt-6 px-3 py-1 xl:text-2xl text-md hover:shadow-lg hover:scale-[1.02] transition-all ">
                  Download
                </button>
                <br></br>
              </>
            )}
            <div className="flex flex-col justify-center">
              <button className="bg-black font-luckiest text-white xl:text-2xl text-md font-bold py-2 px-4 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all" onClick={() => shareOnTwitter(newHeadline)}>
                POST YOUR DOLLY
              </button>
              <br></br>
              <button className="bg-[#5D6FEB] font-luckiest text-white xl:text-2xl text-md font-bold py-2 px-4 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all" onClick={() => shareOnDiscord(newHeadline)}>
                SHARE ON DISCORD
              </button>
              <br></br>
              <button onClick={() => modalSet({ active: false, title: "", body: <></> })} className="bg-hunnys-blue hover:bg-hunnys-blue-700 font-luckiest text-white xl:text-2xl text-md font-bold py-2 px-4 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all">
                DISMISS
              </button>
            </div>
          </div>
        )
      });
    } catch (error) {
      setIsSaving(false);
      setErrorMessage('An error occurred while saving.');
      console.error('Save Error:', error);
    }
  }

  function shareOnTwitter(headline: string) {
    const tweetText = encodeURIComponent(`Just gave my Dolly from @HunnysNFT a makeover, and Bunny Queen Mika said '${headline}'! Unleash your creativity with me at https://closet.hunnys.io`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, '_blank');
  }

  function shareOnDiscord(headline: string) {
    const discordUrl = `https://discord.gg/hunnys`;
    window.open(discordUrl, '_blank');
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
    if(isSaving) {
      return "Saving..";
    } else if (saved) {
      return "Saved!";
    } else {
      return "Save Dolly";
    }
  }

  const calculateTraitCounts = (): Record<string, number> => {
    const counts: Record<string, number> = {};

    console.log(allTraits);
  
    // Check if allTraits is an array and has elements
    if (Array.isArray(allTraits) && allTraits.length > 0) {
      allTraits.forEach((trait: { attribute: string; }) => {
        counts[trait.attribute] = (counts[trait.attribute] || 0) + 1;
      });
    } else {
      // Handle the case where allTraits is not an array or is empty
      console.log("allTraits is not an array or is empty:", allTraits);
    }
  
    return counts;
  };
  
  
  
  
  
  const traitCounts = calculateTraitCounts();

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
        {successMessage && (
          <p className="font-dmsans font-thin self-center text-green-500">{successMessage}</p>
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
          <Render token={token} download dollyId={props.id} onImageLoad={(dataURL: SetStateAction<string>) => setDollyImageDataURL(dataURL)} />

          <div className="bg-white rounded-lg p-4 shadow-lg mt-[65px]">
            <h1 className="font-bold text-xl text-[#666]">Dolly #{props.id}</h1>

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
              {view === "grid" && <GridView token={token} selectedTraitSet={selectedTraitSet} allTraits={allTraits.traits} traitCounts={traitCounts} />}

            </>
          )}
        </div>
      </div>
    </div>
  );
}
