import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom, allTraitsAtom, userTraitsAtom } from "../../../data/store";
import { Token, UserOwnedTraits } from "../../../data/global";
import Event from '../../Card/Events';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Lazy } from 'swiper/modules';

import 'swiper/css/pagination';
import 'swiper/css/navigation';
// Import Swiper styles
import 'swiper/css';
// Import Swiper core and required modules
import SwiperCore from 'swiper';
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

const InventoryView = () => {
  const [user] = useAtom(userAtom);
  const [allTraits] = useAtom(allTraitsAtom);
  const [closetData] = useAtom(allTraitsAtom);
  const [nftData, setNftData] = useState<Array<any>>([]);
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const groupedByOriginName: GroupedByOriginName = {};
  const groupedByTokenId: GroupedByTokenId = {};
  const [userOwnedTraits, setUserOwnedTraits] = useState<UserOwnedTraits>({});
  const [groupedNftData, setGroupedNftData] = useState<{
    [key: string]: any[];
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('Bunny Basics');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedNftData, setSortedNftData] = useState<any[]>([]);
  const [sortType, setSortType] = useState("Owned");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState('3x3'); // Default to 3x3 grid
  const [itemsPerPage, setItemsPerPage] = useState(9); // Default to 9 items per page for 3x3 grid
  const [viewMode, setViewMode] = useState('itemized');
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
  const [pageTotal, setPageTotal] = useState(Math.ceil(nftData.length / itemsPerPage));
  const [inventoryStats, setInventoryStats] = useState<{ [key: string]: { total: number; owned: number } }>({});
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const tokenIdToImageUrlMap: Record<string, string> = {};
  const toggleGridSize = () => {
    if (gridSize === '3x3') {
      setGridSize('8x8');
      setItemsPerPage(64); // Adjust for 8x8 grid
    } else {
      setGridSize('3x3');
      setItemsPerPage(9); // Adjust back for 3x3 grid
    }
  };
  useEffect(() => {
    // Reset the current page to 1 whenever the viewMode changes
    setCurrentPage(1);
  }, [viewMode, gridSize]); // Dependency array includes viewMode to trigger the effect when it changes
  
  const collectionNameMap: CollectionNameMap = {
    'default': 'Bunny Basics',
    'Hunnys 10k All Holders': 'Hunnys 10k All Holders',
    'Hunnys OG': 'Hunnys OG',
    'Hunnys Stacys': 'Hunnys Stacys',
    'Hunnys 10k': 'Hunnys 10k',
    'New Hunnys Closet Shop': 'Hunnys Closet Shop',
    'Hunnys Seasonal': 'Hunnys Seasons',
  };
  
  const currentItems = displayedNftData.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    // Log the current state of userAtom when Dashboard mounts or when user data changes
    console.log('userAtInventory:', inventoryStats);
  }, [user]);

  
  const reverseCollectionNameMap = Object.fromEntries(
    Object.entries(collectionNameMap).map(([key, value]) => [value, key])
  );
  
  useEffect(() => {
    const fetchAndGroupData = async () => {
      try {
        const url =
          "https://sheets.googleapis.com/v4/spreadsheets/1JXPvvxTPbxPARLpbV0e2U5TdFvdik1duQkLWWLZJ42Y/values/A2:Z1400?key=AIzaSyAjknT53sMDEOdJ3YtCmjgP3VeSTvSGB3U";
          const response = await axios.get(url);
          const fetchedNftData = response.data.values;
          
          // Group data by originName and tokenId in one pass
          const groupedByOriginName: { [key: string]: any[] } = {};
          const groupedByTokenId: { [key: string]: any[] } = {};
          let collectionNames = Array.from(new Set(fetchedNftData.map((item: any[]) => item[9] as string))); // Assuming 10th column is originName
          collectionNames = collectionNames.map(name => collectionNameMap[name as keyof typeof collectionNameMap] || name);

          setCollections(collectionNames as string[]);
          fetchedNftData.forEach((item: any[]) => {
            const originName = item[9] as string; // Assuming 10th column is originName
            const tokenId = item[0];
            
            const displayName = collectionNameMap[originName] || originName;
            // Group by originName
            if (!groupedByOriginName[displayName]) groupedByOriginName[displayName] = [];
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
    if (user && user.tokens) {
      const categorizedTokens = user.tokens.reduce<CategorizedTokens>((acc, token) => {
        const originName = token.origin_name || 'Unknown';
        if (!acc[originName]) acc[originName] = [];
        acc[originName].push(token);
        return acc;
      }, {});
      
      // Calculating inventory stats part remains the same
      const newInventoryStats = Object.keys(categorizedTokens).reduce<{ [key: string]: { total: number; owned: number } }>((acc, category) => {
        const tokens = categorizedTokens[category];
        const owned = tokens.length;
        const total = tokens.length; // Adjust according to your logic
        
        acc[category] = { total, owned };
        return acc;
      }, {});
  
      setInventoryStats(newInventoryStats);
    }
  }, [user]);
  
  
  useEffect(() => {
    if (user && user.traits) {
      const ownedTraits = user.traits.reduce<UserOwnedTraits>((acc, trait) => {
        const key = `${trait.name}_${trait.origin_name}`; // Unique key combining name and origin

        acc[key] = true; // Mark as owned
        return acc;
      }, {});
      setUserOwnedTraits(ownedTraits); // Update state with transformed traits
      console.log("User-Owned Traits Mapping:", ownedTraits);
    }

  }, [user]);
  

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
  }, [nftData, user, searchTerm, sortType, currentPage]);

  

  // Handle sorting, filtering, and pagination
useEffect(() => {
  // Make sure to adapt this logic to match how you've structured your data.
  let processedData = Object.entries(groupedNftData);

  // Implement filtering by searchTerm
  if (searchTerm) {
    processedData = processedData.filter(([_, items]) =>
      items.some(item => item.some((field: { toString: () => string; }) => field.toString().toLowerCase().includes(searchTerm.toLowerCase())))
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
  setSortedAndFilteredNftData(paginatedData.map(entry => entry[1]).flat());
}, [groupedNftData, searchTerm, sortType, currentPage, itemsPerPage]);


const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSortType(e.target.value);
  setCurrentPage(1); // Reset to first page on sort change
};

const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSelectedCollection(e.target.value);
  setCurrentPage(1);
  };

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

 

  useEffect(() => {
    if (user && user.tokens) {
      // First, categorize tokens by origin_name
      const categorizedTokens = user.tokens.reduce<Record<string, Token[]>>((acc, token) => {
        const originName = token.origin_name || 'Unknown'; // Ensure this matches your data structure
        if (!acc[originName]) {
          acc[originName] = [];
        }
        acc[originName].push(token);
        return acc;
      }, {});
  
      // Then, calculate inventory stats for each category
      const inventoryStats = Object.keys(categorizedTokens).reduce<Record<string, { total: number; owned: number }>>((acc, category) => {
        const tokens = categorizedTokens[category];
        const owned = tokens.filter(token => token.isOwned).length;
        acc[category] = {
          total: tokens.length,
          owned: owned,
        };
        return acc;
      }, {});
  
      setInventoryStats(inventoryStats);
    }
  }, [user]);
  


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

  const getStatsByOriginName = (inventoryStats: InventoryStats, originName: string) => {
    const stats = inventoryStats[originName];
    return stats ? { owned: stats.owned, total: stats.total } : { owned: 0, total: 0 }; // Return existing stats or default to zero
  };

  const InventoryStatsGrid = ({ inventoryStats }: { inventoryStats: InventoryStats }) => {
    const hunnysSeasonalStats = getStatsByOriginName(inventoryStats, "Hunnys Seasonal");
    const hunnys10kStats = getStatsByOriginName(inventoryStats, "Hunnys 10k");
    const hunnysOGStats = getStatsByOriginName(inventoryStats, "Hunnys OG");
    const hunnysStacysStats = getStatsByOriginName(inventoryStats, "Hunnys Stacys");
    const totalTraitsStats = getStatsByOriginName(inventoryStats, "Hunnys Stacys" && "Hunnys Seasonal" && "Hunnys 10k" && "Hunnys OG" && "Default");
    return (
      <div className="inventory-grid-container bg-white text-white p-4">
        <div className="grid grid-rows-2 grid-cols-3 gap-x-24 gap-y-12">
          <div className="stat-card luckiest">
            <p className="stat-title">Rank</p>
            <p className="stat-value">COMING SOON</p>
          </div>
          <div className="stat-card luckiest">
            <p className="stat-title">Level</p>
            <p className="stat-value">{user?.level}</p>
          </div>
          <div className="stat-card luckiest">
            <p className="stat-title">Cupcake Points</p>
            <p className="stat-value">{user?.cupcake_points}</p>
          </div>
          <div className="stat-card luckiest">
            <p className="stat-title">Hunnys Seasons</p>
            <p className="stat-value">{hunnysSeasonalStats.total}/179</p>
          </div>
          <div className="stat-card luckiest">
            <p className="stat-title">Owned Traits</p>
            <p className="stat-value">{user?.traits.length}/{allTraits.traits.length}</p>
          </div>
          <div className="stat-card luckiest">
            <p className="stat-title">Hunnys 10k</p>
            <p className="stat-value">{hunnys10kStats.total}</p>
          </div>
        {/*  <div className="stat-card luckiest">
            <p className="stat-title">Hunnys OGs</p>
            <p className="stat-value">{hunnysOGStats.total}</p>
          </div>
          <div className="stat-card luckiest">
            <p className="stat-title">Stacys</p>
            <p className="stat-value">{hunnysStacysStats.total}</p>
          </div>
           Add more stat cards as needed */}
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    // Start with filtering if needed based on searchTerm directly on nftData.
    let processedData = searchTerm
      ? nftData.filter((item) =>
          item[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
          item[2].toLowerCase().includes(searchTerm.toLowerCase()) ||
          item[3].toLowerCase().includes(searchTerm.toLowerCase()) ||
          item[5].toLowerCase().includes(searchTerm.toLowerCase()) ||
          item[7].toLowerCase().includes(searchTerm.toLowerCase()) ||
          item[9].toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [...nftData];
  
    // Then sort processedData based on sortType.
    switch (sortType) {
      case "A-Z":
        processedData.sort((a, b) => a[3].localeCompare(b[3]));
        break;
      case "Z-A":
        processedData.sort((a, b) => b[3].localeCompare(a[3]));
        break;
      case "Owned":
        processedData.sort((a, b) => {
          const aOwned = isTokenOwned(a[2], a[9]) ? -1 : 1;
          const bOwned = isTokenOwned(b[2], b[9]) ? -1 : 1;
          return aOwned - bOwned;
        });
        break;
      case "NotOwned":
        processedData.sort((a, b) => {
          const aOwned = isTokenOwned(a[2], a[9]) ? 1 : -1;
          const bOwned = isTokenOwned(b[2], b[9]) ? 1 : -1;
          return aOwned - bOwned;
        });
        break;
      // Add any other sort cases here.
    }
  
    // After sorting, paginate the processedData to set displayedNftData.
    const newDisplayedData = processedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setDisplayedNftData(newDisplayedData);
  
    // Update pageTotal based on the total number of items after filtering but before pagination.
    setPageTotal(Math.ceil(processedData.length / itemsPerPage));
  }, [nftData, currentPage, itemsPerPage, searchTerm, sortType, viewMode]);

const isTokenOwned = (nftTrait: string, originName: string | Token[] | undefined) => {
  const key = `${nftTrait}_${originName}`;
  const owned = userOwnedTraits[key] === true;
  return owned; // Check if the trait is marked as owned

};
  
useEffect(() => {
  const tokens = user?.tokens || [];
  
  // Mapping from trait identifiers to image URLs of owned tokens
  const traitToImageUrlMap = tokens.flatMap(token => 
      token.attributes
          .filter((attr: { value: any; }) => userOwnedTraits[`${attr.value}_${token.origin_name}`]) // Ensure the trait is owned
          .map((attr: { trait_type: any; }) => ({
              [attr.trait_type]: token.img_url
          }))
  ).reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const updatedDisplayedNftData = displayedNftData.map(item => {
      const newItem = { ...item };
      if (newItem.origin_name === "Hunnys 10k" && traitToImageUrlMap[newItem.attribute]) {
          newItem.img_url = traitToImageUrlMap[newItem.attribute]; // Replace with the token's image URL
      }
      return newItem;
      
  });

  setDisplayedNftData(updatedDisplayedNftData);
}, [user?.tokens, userOwnedTraits]);




const handleCollectClick = async (nft: { origin_name: string; }) => {
  if (nft.origin_name === 'Default') {
    // Default tokens are automatically owned, no action required
    console.log('Token is automatically owned.');
  }
}

const renderItemizedData = () => {
  
  return displayedNftData.map((item, index) => {
    const buttonURL = item[10]; // Adjust based on actual structure
    const itemImage = item[8]; // Image URL
    const nftName = item[3]; // Name of the NFT
    const nftImage = item[1]; // Name of the NFT
    const itemAttribute = item[5]; // Name of the item
    const itemName = item[2]; // Name of the item
    const parentNft = item[0]; // Name of the source token that unlocks the item(s)
    const parentNftImage = item[11]; // Name of the source token that unlocks the item(s)
    const originName = item[9]; // Origin name, used to check ownership
    const isOwned = isTokenOwned(item[2], originName); // Adjust the call to match your ownership checking logic
    
    // Define card classes
    const cardClass = "border p-2 rounded-xl bg-white hover:shadow-lg transform transition duration-500 hover:scale-105 m-2 overflow-hidden";
    const imageClass = "m-auto rounded-xl";
    const titleClass = `${gridSize === '8x8' ? 'text-xs' : 'text-2xl'}  font-bold mb-2 mt-2 text-left luckiest`;
    return (
      <div key={index} className={`${cardClass} ${isOwned ? '' : 'low-brightness'} ${gridSize === '8x8' ? 'max-w-[100px] max-h-[150px]' : 'px-4 max-w-[250px] max-h-[600px]'}`}>
        {/* Owned/Not Owned indicator and NFT Image */}
        {isOwned ? (
            <><div className={`${gridSize === '3x3' ? 'm-4' : 'text-xs text-center mr-2 mb-2'} flex flex-row justify-end`}><p className="text-end font-poppins font-bold align-middle self-center mr-4 top-1 relative ">Owned</p><img src="/icons/Unlocked.png" alt={"Owned & Unlocked"} className={`${gridSize === '3x3' ? 'w-[10%]' : 'hidden'}`}></img></div></>
          ) : (
            <><div className={`${gridSize === '3x3' ? 'm-4' : 'text-xs text-center mr-2 mb-2'} flex flex-row justify-end`}><p className="text-end font-poppins font-bold align-middle self-center mr-4 top-1 relative ">Not Owned</p><img src="/icons/Locked.png" alt={"Unowned & Locked"} className={`${gridSize === '3x3' ? 'w-[10%]' : 'hidden'}`}></img></div></>
          )}
        <img src={itemImage} alt={`NFT ${nftName}`} className={`${imageClass} ${gridSize === '8x8' ? 'w-20 h-20' : 'w-64 h-64'}`} loading="lazy"/>
        <div className="pt-1">
          <h1 className={titleClass}>{itemName}</h1>
          {/* VIEW button, conditional rendering based on 'buttonURL' */}
          {buttonURL !== 'NA' && (
            <a href={buttonURL} target="_blank" rel="noreferrer" className="block mt-2 bg-[#6510F2] text-lg text-white font-bold px-2 py-1 rounded-full text-center hover:bg-opacity-80">
              VIEW
            </a>
          )}
        </div>
          {/* Only render detailed content for 3x3 grid */}
          {gridSize === '3x3' && (
            <>
              
                
                    <div className="text-center cursor-pointer">
                      <img className="max-w-24 max-h-24 mx-auto border-[#C6C6C6] border-2 rounded-xl" src={parentNftImage} alt={`Trait ${nftName}`} />
                      <p className="text-xs mt-1">Origin: {originName}</p>
                    </div>
              
            </>
          )}
          {/* Simplified content for 8x8 grid */}
          {gridSize === '8x8' && (
            <>
            <div className="text-center">
              <p className="text-xs mt-1">{itemAttribute}</p>
            </div>
            </>
          )}
        </div>
    );
  });
};

const renderCollectionData = () => {
  // Filter items based on selected collection and searchTerm
  const originalCollectionName = reverseCollectionNameMap[selectedCollection] || selectedCollection;

  const filteredData: NftItem[] = nftData.filter(item => {
    return item[9].toLowerCase().includes(originalCollectionName.toLowerCase()) && (
      item[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[2].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[3].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[5].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[7].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[9].toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Group items by their tokenId
  const groupedByTokenId: { [tokenId: string]: NftItem[] } = filteredData.reduce((acc, item) => {
    const tokenId = item[0];
    if (!acc[tokenId]) {
      acc[tokenId] = [];
    }
    acc[tokenId].push(item);
    return acc;
  }, {});

  // Sort grouped items by "Owned" status before slicing for pagination
  const sortedGroupedItems = Object.entries(groupedByTokenId).sort(([tokenIdA, itemsA], [tokenIdB, itemsB]) => {
    const isOwnedANum = isTokenOwned(itemsA[0][2], itemsA[0][9]) ? 1 : 0; // Convert boolean to number
    const isOwnedBNum = isTokenOwned(itemsB[0][2], itemsB[0][9]) ? 1 : 0; // Convert boolean to number
    return isOwnedBNum - isOwnedANum; // Sort such that owned items come first
  });

  const paginatedTokenIds = sortedGroupedItems.slice(startIndex, endIndex);

  // Now, use paginatedTokenIds for mapping and rendering
  return paginatedTokenIds.map(([_tokenId, items], index) => {
    // Now TypeScript knows the structure of items
    const buttonURL = items[0][10];
    const originName = items[0][9];
    const firstItem = items[0];
    const nftImage = firstItem[1];
    const nftName = firstItem[3];
    const isOwned = isTokenOwned(firstItem[2], originName);

    // Container classes
    const cardClass = "border p-2 rounded-xl bg-white hover:shadow-lg transform transition duration-500 hover:scale-105 m-2 overflow-hidden";
    const imageClass = "m-auto rounded-xl";
    const titleClass = `${gridSize === '8x8' ? 'text-xs' : 'text-2xl'}  font-bold mb-2 mt-2 text-left luckiest`;


    return (
      <div key={index} className={`${cardClass} ${isOwned ? '' : 'low-brightness'} ${gridSize === '8x8' ? 'max-w-[100px] max-h-[150px]' : 'max-w-[250px] max-h-[600px]'}`}>
        {isOwned ? (
            <><div className={`${gridSize === '3x3' ? 'm-4' : 'text-xs text-center mr-2 mb-2'} flex flex-row justify-end`}><p className={`${gridSize === '3x3' ? 'text-xl mr-4 text-end' : 'text-xs text-center'} font-poppins font-bold align-middle self-center top-1 relative `}>Owned</p><img src="/icons/Unlocked.png" alt={"Owned & Unlocked"} className={`${gridSize === '3x3' ? 'w-[10%]' : 'hidden'}`}></img></div></>
          ) : (
            <><div className={`${gridSize === '3x3' ? 'm-4' : 'text-xs text-center mr-2 mb-2'} flex flex-row justify-end`}><p className={`${gridSize === '3x3' ? 'text-xl mr-4 text-end' : 'text-xs text-center'} font-poppins font-bold align-middle self-center top-1 relative `}>Not Owned</p><img src="/icons/Locked.png" alt={"Unowned & Locked"} className={`${gridSize === '3x3' ? 'w-[10%]' : 'hidden'}`}></img></div></>
          )}
        <img src={nftImage} loading="lazy" alt={`NFT ${"tokenId"}`} className={`${imageClass} ${gridSize === '8x8' ? 'w-20 h-20' : 'w-64 h-64'}`} />
        <div className="pt-1">
          <h1 className={titleClass}>{nftName}</h1>
          {/* Only render detailed content for 3x3 grid */}
          {gridSize === '3x3' && (
            <>
              <Swiper
                pagination={{ clickable: true }}
                spaceBetween={30}
                slidesPerView={3}
                modules={[Pagination]}
                className='mySwiper'
              >
                {items.map((item, idx) => (
                  <SwiperSlide key={idx} onClick={() => openLightbox(item[8])}>
                    <div className="text-center cursor-pointer">
                      <img className="w-full h-auto max-h-24 mx-auto border-[#C6C6C6] border-2 rounded-xl" src={item[8]} alt={`Trait ${item[8]}`} />
                      <p className="text-xs mt-1">{item[5]}: {item[2]}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {buttonURL !== 'NA' && (
                <a href={buttonURL} target="_blank" rel="noreferrer" className="block mt-2 bg-[#6510F2] text-lg text-white font-bold px-2 py-1 rounded-full text-center hover:bg-opacity-80">
                  VIEW
                </a>
              )}
            </>
          )}
          {/* Simplified content for 8x8 grid */}
          {gridSize === '8x8' && (
            <>
            </>
          )}
        </div>
      </div>
    );
  });
};

  return (
    <div className="inventory-view p-4 max-w-7xl mx-auto my-8">
      <Event
        headerTitle="Stats"
        event={<>
        <InventoryStatsGrid inventoryStats={inventoryStats} />
</>}        
      />
      <div className="bg-[#EDEDED]">
<div className="align-center m-auto flex flex-row pl-1 font-poppins mt-16">
  <h1 className="font-bold text-2xl flex-grow-[0.9]">Search Items</h1>
  <div className="flex items-center m-auto">
  <div className="toggle-grid-size mt-4 mb-4 flex justify-center">
      <button
      onClick={toggleGridSize}
      className="toggle-grid-size-btn bg-[#AA7AFA] hover:bg-[#7b2df8] transition ease-in-out delay-75 text-white font-bold py-2 px-4 rounded mr-4"
    >
      Toggle Grid Size
    </button>
      </div>
      <div className="view-toggle">
        <button className="toggle-grid-size-btn bg-red-500 hover:bg-[#7b2df8] transition ease-in-out delay-75 text-white font-bold py-2 px-4 rounded mr-4" onClick={() => setViewMode('itemized')}>View by Items</button>
        <button className="toggle-grid-size-btn bg-green-500 hover:bg-[#7b2df8] transition ease-in-out delay-75 text-white font-bold py-2 px-4 rounded mr-4" onClick={() => setViewMode('collection')}>View by Collection</button>
      </div>
      {viewMode === 'itemized' ? (
    <><select
                className="sortDropdown shadow-lg mr-4 p-[7.5px]"
                onChange={handleSortChange}
              >
                <option value="default">Default Sort</option>
                <option value="A-Z">A-Z</option>
                <option value="Z-A">Z-A</option>
                <option value="Owned">Sort by Owned</option>
                <option value="NotOwned">Sort by Not Owned</option>
                {/* Add other sort options here as needed */}
              </select><div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset the current page to 1 whenever the search term changes
                    }}
                    className="searchBar indent-2 " />
                  {searchTerm && (
                    <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1); // Also reset the current page to 1 when clearing the search
                    }}
                      className="clear-search absolute right-2 top-1/2 transform -translate-y-1/2"
                      aria-label="Clear search"
                    >
                      <img src='/assets/clearSearchButton.png' alt='clearSearch' className="w-4" />
                    </button>
                  )}
                </div></>
    ) : (
                <><select className="sortDropdown shadow-lg mr-4 p-[7.5px]" onChange={handleCollectionChange} value={selectedCollection}>
                  {collections.map(collection => (
                    <option key={collection} value={collection}>{collection}</option>
                  ))}
                </select><div className="relative">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchBar indent-2 "
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="clear-search absolute right-2 top-1/2 transform -translate-y-1/2"
          aria-label="Clear search"
        >
          <img src='/assets/clearSearchButton.png' alt='clearSearch' className="w-4" />
        </button>
      )}
    </div></>
    )}
  </div>
</div>

      {/* NFT Display */}
{/* Conditional rendering based on viewMode */}
{viewMode === 'itemized' ? (
      <div className={`grid ${gridSize === '3x3' ? 'lg:grid-cols-3 gap-4' : 'lg:grid-cols-8'} justify-items-center md:grid-cols-2 sm:grid-cols-1`}>
        {renderItemizedData()}
      </div>
    ) : (
      <div className={`grid ${gridSize === '3x3' ? 'lg:grid-cols-3 gap-4' : 'lg:grid-cols-8'} justify-items-center md:grid-cols-2 sm:grid-cols-1`}>
        {renderCollectionData()}
      </div>
    )}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={closeLightbox}>
          <img src={selectedImage} alt="Selected" className="max-w-full max-h-full" />
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
          } ${
            currentPage >= pageTotal
              ? "opacity-40 cursor-not-allowed"
              : ""
          }`}
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

export default InventoryView;
