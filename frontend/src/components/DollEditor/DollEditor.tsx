import { useState, useEffect, useRef, SetStateAction } from "react";
// import { ethers } from "ethers";
import { useAtom } from "jotai";
import Mint from "../DollGallery/Mint";
import {
  userAtom,
  modalAtom,
  savedAtom,
  dollEditorVisibleAtom,
} from "../../data/store";
import { useSignMessage } from "wagmi";
import ApplyButton from "./ApplyButton";
import SecondaryButton from "./SecondaryButton";
import BackButton from "./BackButton";
import Render from "../Render/Render";
import Link from "next/link";
import GridView from "./GridView";
import ListView from "./ListView";
import CardView from "./CardView";
import ItemView from "./ItemView";
import DollEditorOptions from "./DollEditorOptions";
import Icon from "../Icon/Icon";
import { allTraitsAtom } from "../../data/store";

import { attributes, localStorageToken } from "../../data/config";
import { Attribute, Trait } from "../../data/global";
import { mintNewDolly } from "../../utils/mintDolly";
import { ethers } from "ethers";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { WriteContractResult, waitForTransaction } from "wagmi/actions";

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
        isEligibleForMinting: [],
        name: "Empty",
        colorsApplied: [],
        attribute: attribute,
        tags: [],
        colors: [],
        rarity: "common",
        origin_id: 0,
        isOwned: false,
        id: 0,
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

  const stringifyTrait = (trait: any) =>
    JSON.stringify({ ...trait, token_id: undefined });

  const token1Strings = token1.map(stringifyTrait);
  const token2Strings = token2.map(stringifyTrait);

  return (
    token1Strings.every((t1) => token2Strings.includes(t1)) &&
    token2Strings.every((t2) => token1Strings.includes(t2))
  );
}

export default function DollEditor(props: {
  id: number | string | null; // Allow 'id' to be number, string, or null
  selectDoll: Function;
  isNew?: boolean;
  onDollySaved?: (newId: number) => void;
}) {
  const [allTraits] = useAtom(allTraitsAtom);
  const [user, setUser] = useAtom(userAtom);
  const [saved, setSaved] = useAtom(savedAtom); // tracks if user saved dolly changes
  const [view, viewSet] = useState("grid");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [token, tokenSet] = useState<Attribute[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTrait, selectedTraitSet] = useState<Trait>();
  const [modal, modalSet] = useAtom(modalAtom);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dollyImageDataURL, setDollyImageDataURL] = useState("");
  const [selectedHeadline, setSelectedHeadline] = useState("");
  const isNewDolly = props.isNew;
  const [isMinted, setIsMinted] = useState(false);
  const ETHEREUM_MAINNET_CHAIN_ID = 1; // Ethereum Mainnet
  const prevIdRef = useRef(props.id);
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [, setDollEditorVisible] = useAtom(dollEditorVisibleAtom);

  useEffect(() => {
    setDollEditorVisible(true);
    return () => setDollEditorVisible(false); // Reset on unmount
  }, [setDollEditorVisible]);

  const [showIntroModal, setShowIntroModal] = useState<boolean>(() => {
    // Retrieve the user's preference from localStorage
    const hideIntro = localStorage.getItem("hideIntroModal");
    // If not set or explicitly set to 'false', show the intro modal
    return hideIntro !== "true";
  });

  {
    /* useEffect(() => {
    if (showIntroModal) {
      modalSet({
        active: true,
        title: "The Dressing Room 💛",
        body: (
          <div className="text-center p-6">
            <h3 className="mb-4 font-luckiest text-2xl uppercase">Hey Cupcake! Are you ready to Unleash Your Creativity? 🥰</h3>
            <img className="introModalMika mobile-hide" alt="Bunny Queen Mika" src="/assets/Hunnys_Dressup_Doll_Logo.gif"></img>
            <p className="mt-4 font-luckiest text-xl text-left">HOW IT WORKS:</p>
            <p className="mb-4 text-left">🌈 Here in The Dressing Room, you can give your Dolly endless makeovers, trying on all sorts of stylish outfits and accessories, highlighted by the most harmonious of colors.</p>
            <p className="mb-4 text-left">✨ Different traits are unlocked based on collectibles you might own from within the Hunnys universe and beyond.</p>
            <p className="mb-4 text-left">🎀 We have plenty for you to try for free, and even more for sale with the click of a button!</p>
            <p className="mt-8 font-luckiest text-xl text-left">SAVING:</p>
            <p className="mb-4 text-left">📸 Click the &lsquo;Download&lsquo; button at any point to take a snapshot of your Dolly to keep forever!</p>
            <p className="mb-4 text-left">✅ Love the way you look? Click the &lsquo;Save&lsquo; button at the top to the page! Saving your Dolly&lsquo;s debut look as a digital collectible<span className="font-extrabold"> requires a small, one-time fee.</span></p>
            <p className="mb-4 text-left">💋 But don&lsquo;t fret, sweetie — every saved makeover after that is 100% free, forever and ever.</p>
            <p className="mb-4 mt-8 text-center">Have fun, Cupcake! And be sure to share with us afterwards and let us see how you look 💛</p>
            <div className="mt-4">
              <button 
                onClick={() => modalSet({ active: false, title: "", body: <></> })}
                className="bg-hunnys-blue text-hunnys-yellow w-full uppercase font-luckiest shadow-md rounded-full mt-4 px-3 py-1 xl:text-xl text-md hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                Got It, Let&lsquo;s Start!
              </button>
              <label className="inline-flex items-center mt-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" onChange={(e) => {
                const shouldHide = e.target.checked;
                localStorage.setItem('hideIntroModal', shouldHide ? 'true' : 'false');
                setShowIntroModal(!shouldHide);
              }}/><span className="ml-2 text-gray-700">Got it! Don&lsquo;t show this message again</span>
            </label>
            </div>
          </div>
        )
      });
    }
  }, [showIntroModal]); */
  }

  useEffect(() => {
    if (isNewDolly) {
      console.log("Initializing new Dolly...");
  
      // Define traits to never select and attributes that should not be 'Empty'
      const noSelect = ["Frame", "Bodysuit", "Hand", "Tattoo", "Hat"];
      const noEmpty = ["Mouth", "Skin", "Eyebrows", "Eyes", "Hair Style"];
  
      // Default brand colors configuration
      const brandColors = {
        1: ["HunnysPurple4"],
        2: ["HunnysPurple4", "HunnysYellow4"],
        3: ["HunnysPurple4", "HunnysYellow4", "HunnysPurple2"],
        4: ["HunnysPurple4", "HunnysYellow4", "HunnysPurple2", "HunnysYellow2"],
        5: ["HunnysPurple4", "HunnysYellow4", "HunnysPurple2", "HunnysYellow2", "HunnysPurple6"],
      };
  
      // Map over each attribute to determine its trait
      const defaultAttributes: Attribute[] = attributes.map(attr => {
        // Filter traits from Origin ID 0 for the attribute
        let defaultTraits = allTraits.traits.filter(trait => trait.origin_id === 0 && trait.attribute === attr);
  
        // If the attribute is in the noSelect list, use 'Empty', otherwise select a random trait
        let randomTrait = noSelect.includes(attr) ? {
          isEligibleForMinting: [],
          name: "Empty",
          colorsApplied: [],
          baseColor: ["HunnysPurple1"],
          attribute: attr,
          tags: [],
          colors: [],
          rarity: "common",
          origin_id: 0,
          isOwned: false,
          id: 0,
          token_id: "",
        } : defaultTraits.length > 0 ? defaultTraits[Math.floor(Math.random() * defaultTraits.length)] : {
          isEligibleForMinting: [],
          name: "Empty",
          colorsApplied: [],
          baseColor: ["HunnysPurple1"],
          attribute: attr,
          tags: [],
          colors: [],
          rarity: "common",
          origin_id: 0,
          isOwned: false,
          id: 0,
          token_id: "",
        };
  
        // Exclude 'Empty' for specific attributes
        if (noEmpty.includes(attr) && randomTrait.name === "Empty" && defaultTraits.length > 1) {
          const nonEmptyTraits = defaultTraits.filter(trait => trait.name !== "Empty");
          randomTrait = nonEmptyTraits[Math.floor(Math.random() * nonEmptyTraits.length)];
        }
  
        // Determine colors to apply based on the trait's color requirement
        const colorsToApply = brandColors[randomTrait.colors as keyof typeof brandColors] || [];
        const baseColor = colorsToApply.length > 0 ? colorsToApply[0] : ["HunnysPurple1"];
        return { 
          ...randomTrait, 
          colorsApplied: colorsToApply, 
          baseColor: baseColor,
          token_id: "none",
          rarity: randomTrait.rarity || "common", 
      } as Attribute;
      });
  
      console.log("Default attributes for new Dolly:", defaultAttributes);
      tokenSet(defaultAttributes);
      const existingToken = localStorage.getItem(localStorageToken);
      if (!existingToken) {
        // Since there's no existing token, save the default attributes to localStorage.
        // This simulates a change, making the "Save" button enabled.
        localStorage.setItem(localStorageToken, JSON.stringify(defaultAttributes));
  
        // Additionally, set unsavedChanges to true to enable the "Save" button programmatically.
        setUnsavedChanges(true);
      }
      else if (existingToken && props.id && existingToken !== JSON.stringify(defaultAttributes)) {
        setUnsavedChanges(true);
      }
    } else {
      console.log("Loading existing Dolly with ID:", props.id);
      load();
    }
  }, [isNewDolly, props.id, allTraits]);
   // Ensure allTraits is included in the dependency array if it's fetched or updated externally
  

  interface User {
    address: string;
    signer?: ethers.Signer; // Assuming you're using ethers.js and signer might be optional
  }

  // Updated to use the new mintDolly function with transaction confirmation
  async function mintAndFetchTokenId(userAddress: string): Promise<string | null> {
    console.log("Starting mintAndFetchTokenId");
    try {
      const { hash } = await mintNewDolly(); // Initiates the minting transaction and waits for the hash
      console.log("MintDolly called, transaction hash received:", hash);

      // No need to wait again for transaction confirmation as mintDolly already waits for it.
      console.log("Transaction confirmed, fetching most recent token ID...");

      const fetchedTokenId = await fetchMostRecentTokenId(userAddress);
      console.log(`New Dolly minted with token ID: ${fetchedTokenId}`);
      if (fetchedTokenId) {
        setIsMinted(true);
        props.onDollySaved?.(parseInt(fetchedTokenId, 10));
        return fetchedTokenId;
      } else {
        console.log("Token ID could not be fetched.");
        return null;
      }
    } catch (error) {
      console.error("Error in mintAndFetchTokenId:", error);
      return null;
    }
}


  async function save() {
    console.log("Save function initiated");
    setIsSaving(true);
    setErrorMessage(""); // Reset any previous error messages

  const timeoutDuration = 10000; // 20 seconds
  let timeoutReached = false;

    // Start a timeout to reset saving state if it takes too long
  const timeoutId = setTimeout(() => {
    console.log("Timeout reached, resetting save state.");
    timeoutReached = true;
    setIsSaving(false);
    setErrorMessage("");
  }, timeoutDuration);

  try {
    let newTokenId = props.id?.toString() ?? null; // Existing token ID or null

    if (isNewDolly && !isMinted && user) {
      console.log("Minting new dolly...");
      newTokenId = await mintAndFetchTokenId(user.address);

      if (!newTokenId) {
        console.error("Failed to mint new dolly");
        setErrorMessage("Failed to mint. Please try again.");
        clearTimeout(timeoutId); // Ensure to clear timeout upon early exit
        return; // Early exit from function, as minting failed
      }

      setIsMinted(true);
    }

    if (!user || !newTokenId) {
      throw new Error("User information missing or new token ID not available");
    }

    const formData = new FormData();
    formData.append("wallet", user.address);
    const signature = await getSignature(user.address) as string;
    formData.append("signature", signature);
    formData.append("token_id", newTokenId);
    formData.append("data", JSON.stringify({ token: token, name: "Your Dolly Name" }));

    const response = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/updateClone`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error saving Dolly details");
    }

    const data = await response.json();
    console.log("Save successful", data);
    triggerSuccessModal(data);
    setSaved(true); // Reflect the Dolly is now saved
    if (typeof newTokenId === "number") {
      props.onDollySaved?.(newTokenId);
    }

    // Operation successful, clear the timeout
    clearTimeout(timeoutId);
    if (!timeoutReached) {
      setIsSaving(false);
      console.log("Save operation completed successfully.");
    }
  } catch (error) {
    console.error("Save Error:", error);
    setErrorMessage("Failed to save Dolly. Please try again.");
    if (!timeoutReached) {
      clearTimeout(timeoutId);
      setIsSaving(false); // Ensure to reset saving state on error
    }
  } finally {
    if (!timeoutReached) {
      clearTimeout(timeoutId); // Ensure to clear timeout if finally block is reached
      setIsSaving(false); // Ensure to reset saving state when operation is complete
      console.log("Save operation completed.");
    }
  }
}
  function triggerSuccessModal(data: any) {
    // Modal logic for success message
    const newHeadline = getRandomHeadline();
    modalSet({
      active: true,
      title: "Your Dolly Has Been Saved!",
      body: (
        <div className="text-center p-6">
          <h2 className="text-3xl font-luckiest mb-4 text-[#333] uppercase">
            {newHeadline}
          </h2>
          {dollyImageDataURL && (
            <>
              <img
                src={dollyImageDataURL}
                alt="Your Dolly"
                className="mx-auto modalDolly"
              />
              <br></br>
              <p className="mb-2">
                You can come back and give your Dolly a new look any time - for
                free!
              </p>
              <button
                onClick={() => downloadDollyImage(dollyImageDataURL)}
                className="bg-hunnys-blue mb-4 text-hunnys-yellow w-full font-luckiest shadow-md rounded-full mt-6 px-3 py-1 xl:text-2xl text-md hover:shadow-lg hover:scale-[1.02] transition-all "
              >
                Download
              </button>
              <br></br>
            </>
          )}
          <div className="flex flex-col justify-center">
            <button
              className="bg-black font-luckiest text-white xl:text-2xl text-md font-bold py-2 px-4 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all"
              onClick={() => shareOnTwitter(newHeadline)}
            >
              POST YOUR DOLLY
            </button>
            <br></br>
            <button
              className="bg-[#5D6FEB] font-luckiest text-white xl:text-2xl text-md font-bold py-2 px-4 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all"
              onClick={() => shareOnDiscord(newHeadline)}
            >
              SHARE ON DISCORD
            </button>
            <br></br>
            <button
              onClick={() =>
                modalSet({ active: false, title: "", body: <></> })
              }
              className="bg-hunnys-blue hover:bg-hunnys-blue-700 font-luckiest text-white xl:text-2xl text-md font-bold py-2 px-4 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              DISMISS
            </button>
          </div>
        </div>
      ),
    });
  }

  useEffect(() => {
    const fetchAndSaveTokenId = async () => {
      if (isMinted && user) {
        console.log("Transaction succeeded, fetching most recent token ID...");
        try {
          const newTokenId = await fetchMostRecentTokenId(user.address);
          if (newTokenId) {
            console.log(`Fetched new token ID: ${newTokenId}`);
            // Proceed with saving or any other logic needed after fetching the token ID
          } else {
            console.error("Failed to fetch new token ID");
            // Handle error or failed fetch here
          }
        } catch (error) {
          console.error("Error fetching new token ID:", error);
          // Handle exception from fetching token ID
        }
      }
    };

    fetchAndSaveTokenId();
  }, [isMinted, user]);

  async function fetchMostRecentTokenId(address: string): Promise<string> {
    const url = `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/verifyCloset?wallet=${address}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      // Assuming the most recent Dolly is the last one in the array
      const mostRecentDolly = data.dollys[data.dollys.length - 1];
      const mostRecentTokenId = mostRecentDolly.token_id;
      return mostRecentTokenId; // Return the token ID as a string
    } catch (error) {
      console.error("Error fetching the most recent token ID:", error);
      throw error; // Rethrow the error to be caught in the save function
    }
  }
  function getRandomHeadline() {
    const headlines = [
      "Omg, you look incredible!",
      "Hupe hupe hooray, you slay all day!",
      "Wow nice dolly, looks rare",
      "Hellloooo, cupcake!",
      "Felt cute, never deleting later",
      "Gurrrlllll",
      "Good golly, miss dolly!",
      "Wow, can you say #colorharmony?",
      "And just when I thought you couldn't get any cuter",
      "Umm, I'm obsessed",
      "Omg can I get a selfie with u?",
      "Oh Hunny you’re such a cute bunny!",
      "You’re absolutely aDOLLable",
      "OMG did you wake up like this?",
      "By Royal Decree, you’re fashion icon ready!",
      "With looks like this, you’re out for the kill.",
      "You’re ready for your close up!",
      "Looking like a 1/1 Dolly",
      "You look unstoppable, sweetie!",
      "If looks could kill, I wouldn’t be saying anything right now.",
      "What’s your skincare routine? BC you’re absolutely glowing!",
      "You look so good, Dorothy might bring you a free cup of joe!",
      "This Dolly is GM post worthy",
      "OMG, cupcake those traits look legendary!",
      "You make me feel like Royalty at its best!",
      "The best part of Bunny Kingdom is you!",
      "You’ve got great taste, like a cupcake!",
      "OMG gurl, watch out for the paparazzi",
      "You look super sweet, sugar!",
      "You’re looking like a 10k cutie!",
      "Those colors are always in season!",
      "You look like a real bunny guardian!",
      "This lewk is SO Bunny Club",
      "Hupe-tastic style, cupcake!",
      "The red carpet awaits you!",
      "Lights, camera, DOLLYS!",
      "Those colors with that hair, iconic!",
      "That background, it really brings out your eyes.",
      "Bunny Club Baddie, right here!",
      "Makes me want to right click and save!",
      "Where’s the party because I’m coming with you?",
      "Hupe, there it is!",
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

  useEffect(() => {
    console.log("Selected Trait changed in DollEditor:", selectedTrait);
    if (!selectedTrait) {
      // handle the case where selectedTrait is undefined
      // possibly by setting a default state or fetching necessary data
    }
  }, [selectedTrait]);

  // Function to generate tweet URL
  function generateTweetUrl(headline: any) {
    const tweetText = encodeURIComponent(
      `Just gave my Dolly from @HunnysNFT a makeover, and Bunny Queen Mika said '${headline}'! Unleash your creativity with me at https://closet.hunnys.io`
    );
    return `https://twitter.com/intent/tweet?text=${tweetText}`;
  }

  function logDifferences(currentToken: Trait[], savedToken: Trait[]) {
    const stringifyTrait = (trait: Trait) =>
      JSON.stringify({ ...trait, token_id: undefined });

    currentToken.forEach((currentTrait) => {
      const currentTraitString = stringifyTrait(currentTrait);
      if (
        !savedToken.some(
          (savedTrait) => stringifyTrait(savedTrait) === currentTraitString
        )
      ) {
        console.log("Unsaved change detected in trait:", currentTrait);
      }
    });

    savedToken.forEach((savedTrait) => {
      const savedTraitString = stringifyTrait(savedTrait);
      if (
        !currentToken.some(
          (currentTrait) => stringifyTrait(currentTrait) === savedTraitString
        )
      ) {
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
        //@ts-ignore
        logDifferences(token, savedToken);
      }
    }
    document.documentElement.scrollTop = 0; // For modern browsers
    document.body.scrollTop = 0; // For older browsers
  }, [token, setSaved]);

  function shareOnTwitter(headline: string) {
    const tweetText = encodeURIComponent(
      `Just gave my Dolly from @HunnysNFT a makeover, and Bunny Queen Mika said '${headline}'! Unleash your creativity with me at https://closet.hunnys.io`
    );
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, "_blank");
  }

  function shareOnDiscord(headline: string) {
    const discordUrl = `https://discord.gg/hunnys`;
    window.open(discordUrl, "_blank");
  }

  function updateUserToken(token: any, id: any) {
    for (let i = 0; i < (user?.dollys || []).length; i++) {
      if (user && user?.dollys[i].token_id === id) {
        user.dollys[i].attributes = token;
        setUser(user);
        break;
      }
    }
  }

  
  async function load() {
    // Check if transitioning from a temporary to a non-temporary ID
    const prevId = prevIdRef.current ? prevIdRef.current.toString() : "";
    const currentId = props.id ? props.id.toString() : "";

    // Check if transitioning from a temporary to a non-temporary ID
    if (prevId.includes("temp-") && !currentId.includes("temp-") && currentId !== "") {
      console.log("ID updated from temporary to non-temporary, avoiding reload");
      return;
    }
  
    // Existing logic remains unchanged
    if (props.id === null || (typeof props.id === "string" && props.id.includes("temp-"))) {
      // Initialize with default attributes for a new Dolly
    } else if (typeof props.id === "string" || typeof props.id === "number") {
      const numericId = parseInt(props.id.toString(), 10);
      if (!isNaN(numericId)) {
        try {
          let newToken: any = await getDollMetadata(numericId);
          let attr = newToken.length > 0 ? newToken[0].attributes : [];
          newToken = formatToken(attr) as unknown as Attribute[];
          tokenSet(newToken);
          localStorage.setItem(localStorageToken, JSON.stringify(newToken));
        } catch (error) {
          console.error("Error fetching Dolly metadata:", error);
        }
      } else {
        console.error("ID could not be parsed as a number:", props.id);
      }
    } else {
      console.error("Unhandled ID type:", props.id);
    }
  
    // Update the previous ID ref at the end of the load function
    prevIdRef.current = props.id;
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
              <SecondaryButton
                onClick={() =>
                  modalSet({ active: false, title: "", body: <></> })
                }
              >
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
      });

      // console.log(signature)

      resolve(signature);
    });
  }

  function requestSignatureToken(wallet: string) {
    return new Promise(async (resolve) => {
      fetch(
        // `${serverPath}/dolly/${id}`
        `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/auth?wallet=${wallet}`
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
    console.log("getDollMetadata", id);

    return new Promise(async (resolve) => {
      fetch(
        // `${serverPath}/dolly/${id}`
        `https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/getCloneData?tokenIds[]=${id}`
      )
      
        .then((response) => response.json())
        .then((res) => {
          resolve(res);
          console.log("UserAddress At DollEditor:", user?.address, res, user?.traits);
        })
        .catch((err) => {
          console.log("Error:", err.message);
        });
    });
  }

  function setSavingText() {
    if (isSaving) {
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
      allTraits.forEach((trait: { attribute: string }) => {
        counts[trait.attribute] = (counts[trait.attribute] || 0) + 1;
      });
    } else {
      // Handle the case where allTraits is not an array or is empty
      // console.log("allTraits is not an array or is empty:", allTraits);
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
            <p
              className="font-dmsans font-thin self-center"
              dangerouslySetInnerHTML={{ __html: errorMessage }}
            ></p>
          )}

          <SecondaryButton onClick={load}>
            <Icon
              type="reset"
              className="w-[17px] h-[16px] pr-[1px] mr-[4px] fill-[#888]"
            />
            Reset All Changes
          </SecondaryButton>
          <ApplyButton
            disableBtn={saved || isSaving}
            onClick={save}
            text={setSavingText()}
          />
        </div>
      </div>

      {/* Doll gallery */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] lg:grid-cols-2 gap-6">
        {/* DOLL IMG */}
        <div className="relative aspect-square">
          <Render
            token={token}
            download
            dollyId={props.id}
            onImageLoad={(dataURL: SetStateAction<string>) =>
              setDollyImageDataURL(dataURL)
            }
          />

          <div className="bg-white rounded-lg p-4 shadow-lg mt-[65px]">
            <h1 className="font-bold text-xl text-[#666]">
              {typeof props.id === "string" && props.id.includes("temp-")
                ? "New Dolly"
                : `Dolly #${props.id}`}
            </h1>
          </div>
        </div>

        <div className="">
          {/* CURRENTLY SELECTED ITEM */}
          {selectedTrait && (
            <ItemView
              selectedTrait={selectedTrait}
              selectedTraitSet={selectedTraitSet}
              tokenSet={tokenSet}
            />
          )}

          {/* DISPLAY ALL ITEM SLOTS */}
          {!selectedTrait && (
            <>
              <DollEditorOptions
                token={token}
                tokenSet={tokenSet}
                view={view}
                viewSet={viewSet}
                selectedDollyId={
                  typeof props.id === "number" || typeof props.id === "string"
                    ? props.id
                    : -1
                }
                //@ts-ignore
                currentTraits={token}
                onAttributesUpdated={(updatedAttributes) =>
                  tokenSet(updatedAttributes)
                }
              />
              {view === "list" && (
                <ListView token={token} selectedTraitSet={selectedTraitSet} />
              )}
              {view === "card" && (
                <CardView token={token} selectedTraitSet={selectedTraitSet} />
              )}
              {view === "grid" && (
                <GridView
                  token={token}
                  selectedTraitSet={selectedTraitSet}
                  allTraits={allTraits.traits}
                  traitCounts={traitCounts}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
