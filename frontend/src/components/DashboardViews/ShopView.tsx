import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom, allTraitsAtom, userTraitsAtom } from "../../data/store";
import { Token, UserOwnedTraits, Trait } from "../../data/global";
import Event from "../Card/Events";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Lazy } from "swiper/modules";
import MintButton from "../Mint/MintButton";
import useUpdateTraits from "../../hooks/useUpdateTraits";
import { eligibleTokenIds, mintWithWeth } from "../../utils/eligibleTokens";
import { fetchTraits } from "../../utils/traitUtils";

import "swiper/css/pagination";
import "swiper/css/navigation";
// Import Swiper styles
import "swiper/css";
// Import Swiper core and required modules
import SwiperCore from "swiper";
import { ethers } from "ethers";
// Install Swiper modules
SwiperCore.use([Navigation]);

interface InventoryStats {
  [key: string]: {
    total: number;
    owned: number;
  };
}

interface InventoryItem {
  origin_name: string;
  owned: number;
  total: number;
}

// Define a type for the accumulator with a string index signature
interface CategorizedTokens {
  [key: string]: Token[];
}

interface NftItem {
  // Define the structure of your NFT items here
  [index: number]: string;
  [key: string]: any; // Adjust this to match the actual structure
}

interface GroupedByOriginName {
  [originName: string]: NftItem[];
}

interface GroupedByTokenId {
  [tokenId: string]: NftItem[];
}

type CollectionNameMap = {
  [key: string]: string;
};

type AttributeNameMap = {
  [key: string]: string;
};

interface ItemCountsByTokenId {
  [key: string]: number;
}

const ShopView = () => {
  const [user] = useAtom(userAtom);
  const [allTraits] = useAtom(allTraitsAtom);
  const [closetData] = useAtom(allTraitsAtom);
  const [nftData, setNftData] = useState<Array<any>>([]);
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const groupedByOriginName: GroupedByOriginName = {};
  const groupedByTokenId: GroupedByTokenId = {};
  const [filteredData, setFilteredNftData] = useState<string[]>([]);
  const [userOwnedTraits, setUserOwnedTraits] = useState<UserOwnedTraits>({});
  const [groupedNftData, setGroupedNftData] = useState<{
    [key: string]: any[];
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] =
    useState("All Collections");
  const [attributes, setAttributes] = useState<string[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState("All Attributes");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedNftData, setSortedNftData] = useState<any[]>([]);
  const [itemCountsByTokenId, setItemCountsByTokenId] =
    useState<ItemCountsByTokenId>({});
  const [sortType, setSortType] = useState("NotOwned");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState("4x3"); // Default to 4x3 grid
  const [itemsPerPage, setItemsPerPage] = useState(12); // Default to 9 items per page for 4x3 grid
  const [viewMode, setViewMode] = useState("itemized");
  const rarityOrder = [
    "Common",
    "common",
    "Uncommon",
    "uncommon",
    "Rare",
    "rare",
    "Epic",
    "epic",
    "Relic",
    "relic",
    "Legendary",
    "legendary",
    "Mythic",
    "mythic",
    "Immortal",
    "immortal",
  ];
  const [sortedAndFilteredNftData, setSortedAndFilteredNftData] = useState<
    any[]
  >([]);
  const [displayedNftData, setDisplayedNftData] = useState<any[]>([]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [pageTotal, setPageTotal] = useState(
    Math.ceil(nftData.length / itemsPerPage)
  );
  const [inventoryStats, setInventoryStats] = useState<{
    [key: string]: { total: number; owned: number };
  }>({});
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const tokenIdToImageUrlMap: Record<string, string> = {};
  const bunnyClubMembers = ["0xa7758394D8f7fD23b0d9F13E02427B514687394B",
  "0x55Abdc04655d590a48BCd1B996115448b71b7a84",
  "0x4eE115d0708924B4d3a83e45A428B0e3cb4348e9",
  "0x3a9a9b0a3148599dde1660476c6a47b1272247c6",
  "0xe17d0ac3F7C498924d4920bf279C01536686e014",
  "0x48a19c6B158491325E84c8837ED8Ba95A0403C13",
  "0x9d9d3bca9ae1126244786089d81ba9b289970238",
  "0x1975638d2dfdeee04d11adf6350187af9996dc7c",
  "0x6c6cD01ebbd02254C5Db5263797E366511992d29",
  "0x019Db3aA167aF3B91b6D72a05dD8437aaDd5225E",
  "0x745461ae3ee10F26e314735b6AF8ee41cD313E2d",
  "0x0DE9a66f0F9b714c5b987BDCb37A5E2EF1bDA67A",
  "0x473e12B41bC13d3Ac98C4d06cD549Ba8a704dbf1",
  "0xBcDa92fF0D83448ad2B65C7a59D62FE3A18bF95f",
  "0x650d492E2F68A665a5dc029bc3f255FE5ec366Fc",
  "0x0009C319862f623aCa7b210a905121612fBBDf22",
  "0x7B710AD4c01038E62927cEBb2d5df68cF3463413",
  "0xa5cC1E135C92a4DD1b32A328e1343eB4150461B6",
  "0x5Cf422E9Ff1D79c98C479F8d4e8cbdC7B51E1550",
  "0x78ae230336bb65B0023d78156708783402f303c2",
  "0x8b5e18b1A4BfF36085604e94C9bdE2054C62d026",
  "0xFb203c2E544d1D2D889900883b4bD538Bc914357",
  "0x051f1F3920D196cc998D74A56978370b82432D25",
  "0x7b511800A8d8E7DE24Dd19de3103081824b6f41D",
  "0x1776727f3c60dD67B832F9E0614D7e028E32e063",
  "0x247DBa0157DDD215d30d41A70411DbaFbFD6a0F9",
  "0xDbC0019892E644Ad55756Ace79810305E8E4c31d",
  "0xb62500D5a8b9629763d39a4D05784D6A47A72Ab1",
  "0x16272E839A5C29A3Fa90E670Cb599d233b6943aC"]; // Replace with actual addresses
  const bunnyClubDiscount = 20; // 10% discount
  const isBunnyClubMember = bunnyClubMembers
    .map((address) => address.toLowerCase())
    .includes(user!.address.toLowerCase());
  console.log(user?.address, isBunnyClubMember);
  
if (bunnyClubMembers.includes(user!.address)) {
  console.log("Discount should be applied.");
}

const collectionNameMap: CollectionNameMap = {
  default: "Bunny Basics",
  "Hunnys 10k All Holders": "Hunnys 10k All Holders",
  "Hunnys OG": "Hunnys OG",
  "Hunnys Stacys": "Hunnys Stacys",
  "Hunnys 10k": "Hunnys 10k",
  "Fame Lady Society": "Fame Lady Society",
  "New Hunnys Closet Shop": "Hunnys Closet Shop",
  "Hunnys Seasonal": "Hunnys Seasons",
};
  const collectionNameMapExtended = {
    all: "All Collections", // Add this line to include "All Collections" option
    ...collectionNameMap,
  };

  const attributeNameMap: AttributeNameMap = {
    Accessory: "Accessory",
    Background: "Background",
    Bodysuit: "Bodysuit",
    Eyebrows: "Eyebrows",
    Eyes: "Eyes",
    "Face Sticker": "Face Sticker",
    Frame: "Frame",
    "Hair Style": "Hair Style",
    Hand: "Hand",
    Hat: "Hat",
    Mouth: "Mouth",
    Outfit: "Outfit",
    Skin: "Skin",
    Tattoo: "Tattoo",
    Undergarment: "Undergarment",
  };
  const attributeNameMapExtended = {
    all: "All Attributes", // Add this line to include "All Attributes" option
    ...attributeNameMap,
  };

  const currentItems = displayedNftData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  useEffect(() => {
    // Log the current state of userAtom when Dashboard mounts or when user data changes
    console.log("userAtInventory:", inventoryStats);
  }, [user]);

  const reverseCollectionNameMap = Object.fromEntries(
    Object.entries(collectionNameMap).map(([key, value]) => [value, key])
  );

  const reverseAttributeNameMap = Object.fromEntries(
    Object.entries(attributeNameMap).map(([key, value]) => [value, key])
  );

  useEffect(() => {
    const fetchAndGroupData = async () => {
      try {
        const url =
          "https://sheets.googleapis.com/v4/spreadsheets/1JGFS4_mgk3tFH5ScghkOsHCgbO7vnL3vZnm30YYPNLM/values/A2:H262?key=AIzaSyAjknT53sMDEOdJ3YtCmjgP3VeSTvSGB3U";
        const response = await axios.get(url);
        const fetchedNftData = response.data.values;

        // Group data by originName and tokenId in one pass
        const groupedByOriginName: { [key: string]: any[] } = {};
        const groupedByTokenId: { [key: string]: any[] } = {};
        let collectionNames = Array.from(
          new Set(fetchedNftData.map((item: any[]) => item[7] as string))
        ); // Assuming 10th column is originName
        collectionNames = collectionNames.map(
          (name) =>
            collectionNameMap[name as keyof typeof collectionNameMap] || name
        );
        const fetchedAttributes = new Set<string>();
        fetchedNftData.forEach((item: any[]) => {
          const attribute = item[6]; // Assuming 6th column is attribute
          if (attribute) fetchedAttributes.add(attribute);
        });
        setAttributes(["All Attributes", ...Array.from(fetchedAttributes)]);
        setCollections(collectionNames as string[]);
        fetchedNftData.forEach((item: any[]) => {
          const originName = item[7] as string; // Assuming 10th column is originName
          const tokenId = item[0];

          const displayName = collectionNameMap[originName] || originName;
          // Group by originName
          if (!groupedByOriginName[displayName])
            groupedByOriginName[displayName] = [];
          groupedByOriginName[displayName].push(item);

          // Group by tokenId for another purpose (if needed)
          if (!groupedByTokenId[tokenId]) groupedByTokenId[tokenId] = [];
          groupedByTokenId[tokenId].push(item);
        });
        console.log("Fetched NFT Data:", fetchedNftData);
        console.log("Grouped by Origin Name:", groupedByOriginName);

        setNftData(fetchedNftData);
        setGroupedNftData(groupedByOriginName);
        // setGroupedByTokenId(groupedByTokenId); // If you need this for other purposes
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAndGroupData();
  }, []);

  useEffect(() => {
    if (nftData.length > 0) {
      const groupedData = nftData.reduce((acc, item) => {
        const tokenId = item[0];
        if (!acc[tokenId]) {
          acc[tokenId] = [];
        }
        acc[tokenId].push(item);
        return acc;
      }, {});

      setGroupedNftData(groupedData);
    }
    const itemCountsByTokenId: ItemCountsByTokenId = {};

    Object.keys(groupedByTokenId).forEach((tokenId) => {
      itemCountsByTokenId[tokenId] = groupedByTokenId[tokenId].length;
    });

    setItemCountsByTokenId(itemCountsByTokenId);
    console.log(itemCountsByTokenId);
  }, [nftData, user, searchTerm, sortType, currentPage]);

  const ItemBadge = ({ count }: { count: number }) => {
    if (count <= 1) return null; // If this is too restrictive, adjust or remove.
    return (
      <span className="banner">{`+${count - 1} items`}</span> // Example badge
    );
  };

  // Handle sorting, filtering, and pagination
  useEffect(() => {
    // Make sure to adapt this logic to match how you've structured your data.
    let processedData = Object.entries(groupedNftData);

    // Implement filtering by searchTerm
    if (searchTerm) {
      processedData = processedData.filter(([_, items]) =>
        items.some((item) =>
          item.some((field: { toString: () => string }) =>
            field.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    }

    // Implement sorting (adapt this based on your actual sorting logic)
    processedData.sort((a, b) => a[1][0][2].localeCompare(b[1][0][2]));

    // Implement pagination
    const paginatedData = processedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    // Assuming you'll use this state to render the filtered, sorted, and paginated data
    setSortedAndFilteredNftData(paginatedData.map((entry) => entry[1]).flat());
  }, [groupedNftData, searchTerm, sortType, currentPage, itemsPerPage]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCollection(e.target.value);
    setCurrentPage(1);
  };

  const handleAttributeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAttribute(e.target.value);
    setCurrentPage(1);
  };

  // const openLightbox = (imageSrc: string) => {
  //   setSelectedImage(imageSrc);
  // };

  // const closeLightbox = () => {
  //   setSelectedImage(null);
  // };

  const originalCollectionName =
    reverseCollectionNameMap[selectedCollection] || selectedCollection;

  useEffect(() => {
    if (viewMode === "itemized") {
      setSortType("NotOwned");
      setSelectedAttribute("all");
      setCurrentPage(1);
    }
  }, [viewMode]);

  useEffect(() => {
    // Filter and sort based on search term
    const filteredData = Object.entries(groupedNftData).filter(
      ([tokenId, items]) => {
        // Assuming first item's name is the NFT name
        const nftName = items[0][2];
        return nftName.toLowerCase().includes(searchTerm.toLowerCase());
      }
    );

    // Sorting alphabetically by NFT name
    const sortedData = filteredData.sort((a, b) => {
      const nameA = a[1][0][2].toLowerCase();
      const nameB = b[1][0][2].toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    setSortedNftData(sortedData);
  }, [groupedNftData, searchTerm]);

  const calculateFontSize = (text: string | any[]) => {
    if (gridSize === "8x8") {
      // Simple example, adjust logic as needed
      return Math.min(12, (100 / text.length) * 2); // This is a simplistic formula; adjust it as per your design requirements.
    }
    return 16; // Default font size for other views or conditions
  };

  useEffect(() => {
    // Start with filtering if needed based on searchTerm directly on nftData.
    let processedData = searchTerm
      ? nftData.filter(
          (item) =>
            item[1].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item[5].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item[6].toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [...nftData];

    // Then sort processedData based on sortType.
    switch (sortType) {
      case "A-Z":
        processedData.sort((a, b) => a[5].localeCompare(b[5]));
        break;
      case "Z-A":
        processedData.sort((a, b) => b[5].localeCompare(a[5]));
        break;
      case "Owned":
        processedData.sort((a, b) => {
          const aOwned = isTokenOwned(a[5], a[7]) ? -1 : 1;
          const bOwned = isTokenOwned(b[5], b[7]) ? -1 : 1;
          return aOwned - bOwned;
        });
        break;
      case "NotOwned":
        processedData.sort((a, b) => {
          const aOwned = isTokenOwned(a[5], a[7]) ? 1 : -1;
          const bOwned = isTokenOwned(b[5], b[7]) ? 1 : -1;
          return aOwned - bOwned;
        });
        break;
      case "priceLowToHigh":
        processedData.sort((a, b) => parseFloat(a[2]) - parseFloat(b[2]));
        break;
      case "priceHighToLow":
        processedData.sort((a, b) => parseFloat(b[2]) - parseFloat(a[2]));
        break;
      case "RecentlyAdded":
        processedData.sort(
          (a, b) => parseFloat(b[0]) - parseFloat(a[0]) // Assuming IDs are sequential and the higher the number, the newer the addition.
        );
        break;
    }
    if (selectedAttribute !== "all") {
      processedData = processedData.filter(
        (item) => item[6] === selectedAttribute
      );
    }

    setDisplayedNftData(
      processedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
    setPageTotal(Math.ceil(processedData.length / itemsPerPage));
  }, [
    nftData,
    currentPage,
    itemsPerPage,
    selectedAttribute,
    sortType,
    searchTerm,
  ]);

  const isTokenOwned = (
    nftTrait: string,
    originName: string | Token[] | undefined
  ) => {
    const key = `${nftTrait}_${originName}`;
    const owned = userOwnedTraits[key] === true;
    return owned; // Check if the trait is marked as owned
  };

  const originalAttributeName =
    reverseAttributeNameMap[selectedAttribute] || selectedAttribute;

  useEffect(() => {
    // Make sure to adapt this logic to match how you've structured your data.
    let processedData = Object.entries(groupedNftData);

    // Implement filtering by searchTerm
    if (searchTerm) {
      processedData = processedData.filter(([_, items]) =>
        items.some((item) =>
          item.some((field: { toString: () => string }) =>
            field.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    }

    // Implement sorting (adapt this based on your actual sorting logic)
    processedData.sort((a, b) => a[1][0][2].localeCompare(b[1][0][2]));

    // Implement pagination
    const paginatedData = processedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    // Assuming you'll use this state to render the filtered, sorted, and paginated data
    setSortedAndFilteredNftData(paginatedData.map((entry) => entry[1]).flat());
  }, [groupedNftData, searchTerm, sortType, currentPage, itemsPerPage]);

  const renderItemizedData = () => {
    const bunnyClubMembersLowercase = bunnyClubMembers.map(address => address.toLowerCase());
  const userAddressLowercase = user?.address.toLowerCase();
    return displayedNftData.map((item, index) => {
      
      const tokenId = item[0]; // Name of the source token that unlocks the item(s)
      const nftName = item[1]; // Name of the NFT
      let mintPrice = ethers.utils.parseUnits(item[2].toString(), "ether");
      console.log(`Original mintPrice: ${ethers.utils.formatUnits(mintPrice, "ether")}`);
      if (userAddressLowercase && bunnyClubMembersLowercase.includes(userAddressLowercase)) {
        const discount = mintPrice.mul(bunnyClubDiscount).div(100);
        mintPrice = mintPrice.sub(discount);
        console.log(`Discounted mintPrice: ${ethers.utils.formatUnits(mintPrice, "ether")}`);
      }
  
      const formattedMintPrice = ethers.utils.formatUnits(mintPrice, "ether");
      const isEligibleForMinting = true;
      const parentNftImage = item[3]; // Name of the NFT
      const itemImage = item[4]; // Image URL
      const itemName = item[5]; // Name of the item
      const attribute = item[6]; // Name of the source token that unlocks the item(s)
      const originName = item[7]; // Origin name, used to check ownership
      const isOwned = isTokenOwned(item[5], originName); // Adjust the call to match your ownership checking logic
      const originalAttributeName =
        reverseAttributeNameMap[selectedAttribute] || selectedAttribute;
      const filteredData: NftItem[] = nftData.filter((item) => {
        return (
          selectedAttribute === "all" ||
          (item[6]
            .toLowerCase()
            .includes(originalAttributeName.toLowerCase()) &&
            (item[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
              item[2].toLowerCase().includes(searchTerm.toLowerCase()) ||
              item[3].toLowerCase().includes(searchTerm.toLowerCase()) ||
              item[5].toLowerCase().includes(searchTerm.toLowerCase()) ||
              item[7].toLowerCase().includes(searchTerm.toLowerCase()) ||
              item[9].toLowerCase().includes(searchTerm.toLowerCase())))
        );
      });
      // Define card classes
      const cardClass = `${
        gridSize === "8x8" ? "p-0" : "p-2"
      } border p-2 rounded-xl bg-white hover:shadow-lg transform transition duration-500 hover:scale-105 m-2 overflow-hidden`;
      const imageClass = "m-auto rounded-xl";
      const titleClass = `${
        gridSize === "8x8" ? "text-xs" : "text-2xl"
      }  font-bold mb-2 mt-2 text-left luckiest`;

      return (
        <div
          key={index}
          className={`${cardClass}  ${
            gridSize === "8x8"
              ? "max-w-[100px] max-h-[150px]"
              : "d-flex flex-column justify-content-between max-w-[250px] max-h-[600px]"
          }`}
        >
          {gridSize === "4x3" && (
            <>
              <img
                src={itemImage}
                alt={`NFT ${nftName}`}
                className={imageClass}
                loading="lazy"
              />
              <div className="pt-1">
                <h1
                  style={{
                    fontSize: `${Math.max(16, 32 - itemName.length * 0.5)}px`,
                  }}
                  className={titleClass}
                >
                  {itemName}
                </h1>
              </div>
              <div className="text-center cursor-pointer">
                <img
                  className="max-w-24 max-h-24 mx-auto border-[#C6C6C6] border-2 rounded-xl"
                  src={parentNftImage}
                  alt={`Trait ${nftName}`}
                />
                <p className="text-xs mt-1">Origin: {nftName}</p>
              </div>

              <MintButton
                tokenId={tokenId.toString()}
                mintPrice={mintPrice}
                isEligibleForMinting={isEligibleForMinting}
                onMintSuccess={() => console.log("Mint successful!")}
                updateTraits={(userAddress) =>
                  console.log(`Update traits for ${userAddress}`)
                }
                userAddress={user?.address}
                mintAction={async () => {
                  if (!tokenId || !user?.address || !mintPrice) {
                    console.error("Missing tokenId, user address, or mintPrice");
                    return;
                  }
                  try {
                    // Ensure provider is correctly instantiated
                    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
                    await mintWithWeth(user.address, tokenId, mintPrice, provider);
                    console.log("Purchase successful!");
                    // Since this log indicates success, ensure it's only reached if mintWithWeth succeeds
                    // Optionally, call onMintSuccess() here or handle success feedback within this try block
                  } catch (error) {
                    console.error("Purchase failed:", error);
                    // Handle error feedback, then re-throw the error to signal failure to the caller
                    throw error; // This line is crucial for propagating the failure
                  }
                }}
                buttonText={`Ξ${formattedMintPrice}`}
              />
            </>
          )}
        </div>
      );
    });
  };

  const renderCollectionData = () => {
    const bunnyClubMembersLowercase = bunnyClubMembers.map(address => address.toLowerCase());
  const userAddressLowercase = user?.address.toLowerCase();
    // Filter items based on selected collection and searchTerm
    const originalAttributeName =
      reverseAttributeNameMap[selectedAttribute] || selectedAttribute;

    const filteredData: NftItem[] = nftData.filter((item) => {
      return (
        selectedAttribute === "all" ||
        (item[6].toLowerCase().includes(originalAttributeName.toLowerCase()) &&
          (item[1].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item[5].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item[6].toLowerCase().includes(searchTerm.toLowerCase())))
      );
    });

    // Group items by their tokenId
    const groupedByTokenId: { [tokenId: string]: NftItem[] } =
      filteredData.reduce((acc, item) => {
        const tokenId = item[0];
        if (!acc[tokenId]) {
          acc[tokenId] = [];
        }
        acc[tokenId].push(item);
        return acc;
      }, {});

    // Sort grouped items by "Owned" status before slicing for pagination
    const sortedGroupedItems = Object.entries(groupedByTokenId).sort(
      ([tokenIdA, itemsA], [tokenIdB, itemsB]) => {
        const isOwnedANum = isTokenOwned(itemsA[0][2], itemsA[0][7]) ? 1 : 0; // Convert boolean to number
        const isOwnedBNum = isTokenOwned(itemsB[0][2], itemsB[0][7]) ? 1 : 0; // Convert boolean to number
        return isOwnedANum - isOwnedBNum; // Sort such that owned items come first
      }
    );

    const paginatedTokenIds = sortedGroupedItems.slice(startIndex, endIndex);

    // Now, use paginatedTokenIds for mapping and rendering
    return paginatedTokenIds.map(([_tokenId, items], index) => {
      const isEligibleForMinting = true;
      const originName = items[0][7];
      const firstItem = items[0];
      const nftImage = firstItem[3];
      const nftName = firstItem[1];
      const tokenId = firstItem[0];
      let mintPrice = ethers.utils.parseUnits(firstItem[2].toString(), "ether");
      console.log(`Original mintPrice: ${ethers.utils.formatUnits(mintPrice, "ether")}`);
      if (userAddressLowercase && bunnyClubMembersLowercase.includes(userAddressLowercase)) {
        const discount = mintPrice.mul(bunnyClubDiscount).div(100);
        mintPrice = mintPrice.sub(discount);
        console.log(`Discounted mintPrice: ${ethers.utils.formatUnits(mintPrice, "ether")}`);
      }
      const formattedMintPrice = ethers.utils.formatUnits(mintPrice, "ether");
      const isOwned = isTokenOwned(firstItem[5], originName);

      // Container classes
      const cardClass = `${
        gridSize === "8x8" ? "p-0" : "p-2"
      }  border  rounded-xl bg-white hover:shadow-lg transform transition duration-500 hover:scale-105 m-2 overflow-hidden`;
      const imageClass = "m-auto rounded-xl";
      const titleClass = `${
        gridSize === "8x8" ? "text-xs" : "text-2xl"
      }  font-bold mb-2 mt-2 text-left luckiest`;

      return (
        <div
          key={index}
          className={`${cardClass} ${
            gridSize === "8x8"
              ? "max-w-[100px] max-h-[150px]"
              : "max-w-[250px] max-h-[600px]"
          }`}
        >
          <div className="pt-1">
            {/* Only render detailed content for 4x3 grid */}
            {gridSize === "4x3" && (
              <>
                <img
                  src={nftImage}
                  loading="lazy"
                  alt={`NFT ${"tokenId"}`}
                  className={`${imageClass} `}
                />
                <h1
                  style={{
                    fontSize: `${Math.max(16, 32 - nftName.length * 0.5)}px`,
                  }}
                  className={titleClass}
                >
                  {nftName}
                </h1>
                <Swiper
                  pagination={{ clickable: true }}
                  spaceBetween={10}
                  slidesPerView={3}
                  modules={[Pagination]}
                  className="mySwiper"
                >
                  {items.map((item, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="text-center cursor-pointer">
                        <img
                          className="w-full h-auto max-h-24 mx-auto border-[#C6C6C6] border-2 rounded-xl"
                          src={item[4]}
                          alt={`Trait ${item[4]}`}
                        />
                        <p className="text-xs mt-1">
                          {item[6]}: {item[5]}
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <MintButton
                  tokenId={tokenId.toString()}
                  mintPrice={mintPrice}
                  isEligibleForMinting={isEligibleForMinting}
                  onMintSuccess={() => console.log("Mint successful!")}
                  updateTraits={(userAddress) =>
                    console.log(`Update traits for ${userAddress}`)
                  }
                  userAddress={user?.address}
                  mintAction={async () => {
                    if (!tokenId || !user?.address || !mintPrice) {
                      console.error(
                        "Missing tokenId, user address, or mintPrice"
                      );
                      return;
                    }
                    try {
                      // Ensure provider is correctly instantiated
                      const provider = new ethers.providers.Web3Provider(
                        window.ethereum as any
                      );
                      await mintWithWeth(
                        user.address,
                        tokenId,
                        mintPrice,
                        provider
                      );
                      console.log("Mint successful!");
                      // Optionally, call onMintSuccess() here or handle success feedback
                    } catch (error) {
                      console.error("Minting failed:", error);
                      // Handle error feedback
                    }
                  }}
                  buttonText={`Ξ${formattedMintPrice}`}
                />
              </>
            )}
            {/* Simplified content for 8x8 grid */}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="inventory-view p-4 max-w-7xl mx-auto my-8">
     {/* <Event
        headerTitle="Welcome to The Closet Shop!"
        event={
          <h1 className="m-16 w-1/2 text-center self-center">
            All Shop items are priced in Wrapped ETH on the Polygon network.
          </h1>
        }
      />

       Top divider */}
      <div className="border-t-2 border-gray-200 my-8"></div>

      {/* Main content area */}
      <div className="bg-[#EDEDED] mt-4">
        <div
          className="align-center mx-auto flex xs:flex-col sm:flex-row xxl:px-16 justify-between items-center gap-4"
          style={{ maxWidth: "2560px" }}
        >
          {/* Left aligned items */}
          <div className="flex items-center gap-4 flex-grow">
            {/* View by Item/Collection buttons */}
            <button
              className={`view-toggle-btn ${
                viewMode === "itemized" ? "bg-[#6510F2]" : "bg-[#ADADAD]"
              } hover:bg-[#7b2df8] transition ease-in-out delay-75 text-white font-bold py-2 px-4 rounded h-10`}
              onClick={() => {
                setViewMode("itemized");
                setSortType("NotOwned");
                setCurrentPage(1);
              }}
            >
              Item View
            </button>
            <button
              className={`view-toggle-btn ${
                viewMode === "collection" ? "bg-[#6510F2]" : "bg-[#ADADAD]"
              } hover:bg-[#7b2df8] transition ease-in-out delay-75 text-white font-bold py-2 px-4 rounded h-10`}
              onClick={() => {
                setViewMode("collection");
                setSortType("NotOwned");
                setCurrentPage(1);
              }}
            >
              Token View
            </button>

            {/* Search bar */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset the current page to 1 whenever the search term changes
                }}
                className="searchBar indent-2 shadow bg-white font-poppins font-bold rounded h-10 w-full"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1); // Also reset the current page to 1 when clearing the search
                  }}
                  className="clear-search absolute right-2 top-1/2 transform -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <img
                    src="/assets/clearSearchButton.png"
                    alt="clearSearch"
                    className="w-4 h-4"
                  />
                </button>
              )}
            </div>
          </div>

          {/* Right aligned items */}
          <div className="flex items-center">
            {/* Conditionally rendered dropdown based on viewMode */}
            {viewMode === "itemized" ? (
              <>
                <select
                  className="sortDropdown shadow bg-white font-poppins font-bold rounded py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                  onChange={handleSortChange} // Assume this function handles sorting for itemized view
                >
                  <option value="NotOwned">Sort by...</option>
                  <option value="RecentlyAdded">Recently Added</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="A-Z">A to Z</option>
                  <option value="Z-A">Z to A</option>
                  {/* Additional sort options for itemized view */}
                </select>
                <select
                  className="sortDropdown shadow bg-white font-poppins font-bold rounded py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                  onChange={handleAttributeChange} // Assume this function handles sorting/filtering for collection view
                >
                  {Object.entries(attributeNameMapExtended).map(
                    ([value, name]) => (
                      <option key={value} value={value}>
                        {name}
                      </option>
                    )
                  )}
                </select>
              </>
            ) : (
              <>
                <select
                  className="sortDropdown hidden shadow bg-white font-poppins font-bold rounded py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                  onChange={handleSortChange} // Assume this function handles sorting for itemized view
                >
                  <option value="NotOwned">Sort by...</option>
                  <option value="RecentlyAdded">Recently Added</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="A-Z">A to Z</option>
                  <option value="Z-A">Z to A</option>
                  {/* Additional sort options for itemized view */}
                </select>
                <select
                  className="sortDropdown shadow bg-white font-poppins font-bold rounded py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                  onChange={handleAttributeChange} // Assume this function handles sorting/filtering for collection view
                >
                  {Object.entries(attributeNameMapExtended).map(
                    ([value, name]) => (
                      <option key={value} value={value}>
                        {name}
                      </option>
                    )
                  )}
                </select>
              </>
            )}
          </div>
        </div>

        {/* NFT Display */}
        {/* Conditional rendering based on viewMode */}
        {viewMode === "itemized" ? (
          <div
            className={`grid ${
              gridSize === "4x3" ? "lg:grid-cols-4 gap-4" : "lg:grid-cols-8"
            } justify-items-center md:grid-cols-2 sm:grid-cols-1`}
          >
            {renderItemizedData()}
          </div>
        ) : (
          <div
            className={`grid ${
              gridSize === "4x3" ? "lg:grid-cols-4 gap-4" : "lg:grid-cols-8"
            } justify-items-center md:grid-cols-2 sm:grid-cols-1`}
          >
            {renderCollectionData()}
          </div>
        )}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-full"
            />
          </div>
        )}
      </div>
      {/* Pagination controls */}
      <div className="pagination-controls flex md:m-auto justify-between">
        <button
          className={`bg-hunnys-blue paginate text-hunnys-yellow w-full max-w-[180px] font-title shadow-md rounded-full text-4xl hover:shadow-lg hover:scale-[1.02] transition-all ${
            currentPage === 1
              ? "opacity-40 cursor-not-allowed justify-between"
              : ""
          }`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          PREV
        </button>
        <button
          className={`bg-black paginate text-white font-title shadow-md rounded-full text-2xl px-6 hover:shadow-lg hover:scale-[1.02] paginateNum transition-all ${
            currentPage === 1 ? "hidden" : ""
          }`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
        <button
          className={`bg-black paginate text-white font-title shadow-md rounded-full text-2xl px-6 hover:shadow-lg hover:scale-[1.02] transition-all opacity-40 cursor-not-allowed`}
          disabled
        >
          {currentPage}
        </button>
        <button
          className={`bg-black paginate text-white font-title shadow-md rounded-full text-2xl px-6 hover:shadow-lg hover:scale-[1.02] paginateNum  transition-all  ${
            currentPage === pageTotal ? "hidden" : ""
          } ${currentPage >= pageTotal ? "opacity-40 cursor-not-allowed" : ""}`}
          disabled={currentPage >= pageTotal}
          onClick={() => setCurrentPage(pageTotal)}
        >
          {pageTotal}
        </button>
        <button
          className={`bg-hunnys-yellow paginate text-hunnys-blue w-full max-w-[180px] font-title shadow-md rounded-full text-4xl hover:shadow-lg hover:scale-[1.02] transition-all ${
            currentPage >= pageTotal
              ? "opacity-40 cursor-not-allowed justify-between"
              : ""
          }`}
          disabled={currentPage >= pageTotal}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default ShopView;
