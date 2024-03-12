import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom, allTraitsAtom, userTraitsAtom } from "../../../data/store";
import { Token, UserOwnedTraits, Trait } from "../../../data/global";
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

type AttributeNameMap = {
  [key: string]: string;
};

const InventoryView = () => {
  const [user] = useAtom(userAtom);
  const [allTraits] = useAtom(allTraitsAtom);
  const [closetData] = useAtom(allTraitsAtom);
  const [nftData, setNftData] = useState<Array<any>>([]);
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [allAvailableTraits, setAllAvailableTraits] = useState<Trait[]>([]);
  const groupedByOriginName: GroupedByOriginName = {};
  const groupedByTokenId: GroupedByTokenId = {};
  const [userOwnedTraits, setUserOwnedTraits] = useState<UserOwnedTraits>({});
  const [groupedNftData, setGroupedNftData] = useState<{
    [key: string]: any[];
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('All Collections');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedNftData, setSortedNftData] = useState<any[]>([]);
  const [sortType, setSortType] = useState("Owned");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState('4x3'); // Default to 4x3 grid
  const [itemsPerPage, setItemsPerPage] = useState(12); // Default to 9 items per page for 4x3 grid
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
  const [attributes, setAttributes] = useState<string[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<string>('All Attributes');
  const toggleGridSize = (size: React.SetStateAction<string>) => {
    setGridSize(size);
    if (size === '8x8') {
      setItemsPerPage(64); // Adjust for 8x8 grid
    } else if (size === '4x3') {
      setItemsPerPage(12); // Adjust back for 4x3 grid
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
    'Fame Lady Society': 'Fame Lady Society',
    'New Hunnys Closet Shop': 'Hunnys Closet Shop',
    'Hunnys Seasonal': 'Hunnys Seasons',
  };
  const collectionNameMapExtended = {
    'all': 'All Collections', // Add this line to include "All Collections" option
    ...collectionNameMap,
  };

  const attributeNameMap: AttributeNameMap = {
    'Accessory': 'Accessory',
    'Background': 'Background',
    'Bodysuit': 'Bodysuit',
    'Eyebrows': 'Eyebrows',
    'Eyes': 'Eyes',
    'Face Sticker': 'Face Sticker',
    'Frame': 'Frame',
    'Hair Style': 'Hair Style',
    'Hand': 'Hand',
    'Hat': 'Hat',
    'Mouth': 'Mouth',
    'Outfit': 'Outfit',
    'Skin': 'Skin',
    'Tattoo': 'Tattoo',
    'Undergarment': 'Undergarment',
  };
  const attributeNameMapExtended = {
    'all': 'All Attributes', // Add this line to include "All Collections" option
    ...attributeNameMap,
  };
  
  const currentItems = displayedNftData.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    // Log the current state of userAtom when Dashboard mounts or when user data changes
    console.log('userAtInventory:', inventoryStats);
  }, [user]);

  
  const reverseCollectionNameMap = Object.fromEntries(
    Object.entries(collectionNameMap).map(([key, value]) => [value, key])
  );
  
  const reverseAttributeNameMap = Object.fromEntries(
    Object.entries(attributeNameMap).map(([key, value]) => [value, key])
  );

  useEffect(() => {
    if (viewMode === 'itemized') {
      setSortType('Owned');
      setSelectedAttribute('all');
      setCurrentPage(1);
    }
  }, [viewMode]);

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
          const fetchedAttributes = new Set<string>();
          fetchedNftData.forEach((item: any[]) => {
            const attribute = item[5]; // Assuming 6th column is attribute
            if (attribute) fetchedAttributes.add(attribute);
          });
          setAttributes(['All Attributes', ...Array.from(fetchedAttributes)]);
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

const handleAttributeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSelectedAttribute(e.target.value);
  setCurrentPage(1);
  };

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const originalCollectionName = reverseCollectionNameMap[selectedCollection] || selectedCollection;
  const originalAttributeName = reverseAttributeNameMap[selectedAttribute] || selectedAttribute;
  
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

  const calculateFontSize = (text: string | any[]) => {
    if (gridSize === '8x8') {
      // Simple example, adjust logic as needed
      return Math.min(12, 100 / text.length * 2); // This is a simplistic formula; adjust it as per your design requirements.
    }
    return 16; // Default font size for other views or conditions
  };

  const InventoryStatsGrid = ({ inventoryStats, userOwnedTraits }: { inventoryStats: InventoryStats, userOwnedTraits: UserOwnedTraits }) => {
    const hunnysSeasonalStats = getStatsByOriginName(inventoryStats, "Hunnys Seasonal");
    const hunnys10kStats = getStatsByOriginName(inventoryStats, "Hunnys 10k");
    const hunnysOGStats = getStatsByOriginName(inventoryStats, "Hunnys OG");
    const hunnysStacysStats = getStatsByOriginName(inventoryStats, "Hunnys Stacys");
    const totalTraitsStats = getStatsByOriginName(inventoryStats, "Hunnys Stacys" && "Hunnys Seasonal" && "Hunnys 10k" && "Hunnys OG" && "Default");
    const uniqueOwnedTraitsCount = Object.keys(userOwnedTraits).length;
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
            <p className="stat-value">{uniqueOwnedTraitsCount}/{allTraits.traits.length}</p>
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
  
      if (selectedAttribute !== 'all') {
        processedData = processedData.filter(item => item[5] === selectedAttribute);
      }

    // Then sort processedData based on sortType.
    switch (sortType) {
      case "A-Z":
        processedData.sort((a, b) => a[2].localeCompare(b[2]));
        break;
      case "Z-A":
        processedData.sort((a, b) => b[2].localeCompare(a[2]));
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
    const originalAttributeName = reverseAttributeNameMap[selectedAttribute] || selectedAttribute;

  const filteredData: NftItem[] = nftData.filter(item => {
    return selectedAttribute === 'all' || item[5].toLowerCase().includes(originalAttributeName.toLowerCase()) && (
      item[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[2].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[3].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[5].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[7].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[9].toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
    // Define card classes
    const cardClass = `${gridSize === '8x8' ? 'p-0' : 'p-2'} border rounded-xl bg-white hover:shadow-lg transform transition duration-500 hover:scale-105 m-2 overflow-hidden`;
    const imageClass = "m-auto rounded-xl";
    const titleClass = `${gridSize === '8x8' ? 'text-xs' : 'text-2xl'}  font-bold mb-2 mt-2 text-left luckiest`;
    return (
      <div key={index} className={`${cardClass} ${isOwned ? '' : 'low-brightness'} ${gridSize === '8x8' ? 'max-w-[100px] max-h-[150px]' : 'd-flex flex-column justify-content-between max-w-[250px] max-h-[600px]'}`}>
        {/* Owned/Not Owned indicator and NFT Image */}

        
        
          {/* Only render detailed content for 4x3 grid */}
          {gridSize === '4x3' && (
            <>
          {isOwned ? (
          <><div className={`${gridSize === '4x3' ? 'm-4' : 'text-xs text-center mr-2 mb-2'} flex flex-row justify-end`}><p className={`${gridSize === '4x3' ? 'text-xl mr-4 text-end' : 'text-xs text-center'} font-poppins font-bold align-middle self-center top-1 relative `}>Owned</p><img src="/icons/Unlocked.png" alt={"Owned & Unlocked"} className={`${gridSize === '4x3' ? 'w-[10%]' : 'hidden'}`}></img></div></>
          ) : (
            <><div className={`${gridSize === '4x3' ? 'm-4' : 'text-xs text-center mr-2 mb-2'} flex flex-row justify-end`}><p className={`${gridSize === '4x3' ? 'text-xl mr-4 text-end' : 'text-xs text-center'} font-poppins font-bold align-middle self-center top-1 relative `}>Not Owned</p><img src="/icons/Locked.png" alt={"Unowned & Locked"} className={`${gridSize === '4x3' ? 'w-[10%]' : 'hidden'}`}></img></div></>
        )}
        <img src={itemImage} alt={`NFT ${nftName}`} className={`${imageClass}`} loading="lazy"/>
              <div className="pt-1">
        <h1 style={{ fontSize: `${Math.max(16, 32 - itemName.length * 0.5)}px` }} className={titleClass}>{itemName}</h1>

        </div>
                    <div className="text-center cursor-pointer">
                      <img className="max-w-24 max-h-24 mx-auto border-[#C6C6C6] border-2 rounded-xl" src={parentNftImage} alt={`Trait ${nftName}`} />
                      <p className="text-xs mt-1">Origin: {nftName}</p>
                    </div>
              {/* VIEW button, conditional rendering based on 'buttonURL' */}
              {buttonURL !== 'NA' && (
            <a href={buttonURL} target="_blank" rel="noreferrer" className="block mt-2 bg-[#6510F2] text-lg text-white font-bold rounded-full text-center hover:bg-opacity-80" style={{ marginTop: 'auto' }}>
            VIEW
          </a>
          )}
            </>
          )}
                    
          {/* Simplified content for 8x8 grid */}
          {gridSize === '8x8' && (
          <><img src={itemImage} alt={`NFT ${nftName}`} className={`${imageClass}`} loading="lazy" /><div className={`shadow-lg text-xs rounded-b-lg text-white bg-[#C9A9FF] w-full h-auto justify-center items-center break-words py-2 px-2 font-poppins font-bold`}>
            {itemName}
          </div></>
        )}
        </div>
        
    );
  });
};

const renderCollectionData = () => {
  // Filter items based on selected collection and searchTerm
  const originalCollectionName = reverseCollectionNameMap[selectedCollection] || selectedCollection;

  const filteredData: NftItem[] = nftData.filter(item => {
    return selectedCollection === 'all' || item[9].toLowerCase().includes(originalCollectionName.toLowerCase()) && (
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
    const cardClass = `${gridSize === '8x8' ? 'p-0' : 'p-2'}  border  rounded-xl bg-white hover:shadow-lg transform transition duration-500 hover:scale-105 m-2 overflow-hidden`;
    const imageClass = "m-auto rounded-xl";
    const titleClass = `${gridSize === '8x8' ? 'text-xs' : 'text-2xl'}  font-bold mb-2 mt-2 text-left luckiest`;


    return (
      <div key={index} className={`${cardClass} ${isOwned ? '' : 'low-brightness'} ${gridSize === '8x8' ? 'max-w-[100px] max-h-[150px]' : 'max-w-[250px] max-h-[600px]'}`}>
        
        
        <div className="pt-1">
          {/* Only render detailed content for 4x3 grid */}
          {gridSize === '4x3' && (
            <>
            {isOwned ? (
            <><div className={`${gridSize === '4x3' ? 'm-4' : 'text-xs text-center mr-2 mb-2'} flex flex-row justify-end`}><p className={`${gridSize === '4x3' ? 'text-xl mr-4 text-end' : 'text-xs text-center'} font-poppins font-bold align-middle self-center top-1 relative `}>Owned</p><img src="/icons/Unlocked.png" alt={"Owned & Unlocked"} className={`${gridSize === '4x3' ? 'w-[10%]' : 'hidden'}`}></img></div></>
          ) : (
            <><div className={`${gridSize === '4x3' ? 'm-4' : 'text-xs text-center mr-2 mb-2'} flex flex-row justify-end`}><p className={`${gridSize === '4x3' ? 'text-xl mr-4 text-end' : 'text-xs text-center'} font-poppins font-bold align-middle self-center top-1 relative `}>Not Owned</p><img src="/icons/Locked.png" alt={"Unowned & Locked"} className={`${gridSize === '4x3' ? 'w-[10%]' : 'hidden'}`}></img></div></>
          )}
          <img src={nftImage} loading="lazy" alt={`NFT ${"tokenId"}`} className={`${imageClass} `} />
          <h1 style={{ fontSize: `${Math.max(16, 32 - nftName.length * 0.5)}px` }} className={titleClass}>{nftName}</h1>
              <Swiper
                pagination={{ clickable: true }}
                spaceBetween={10}
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
          <><img src={nftImage} loading="lazy" alt={`NFT ${"tokenId"}`} className={`${imageClass} `} />
              <div className={`shadow-lg text-xs rounded-b-lg text-white bg-[#C9A9FF] w-full h-auto justify-center items-center break-words py-2 px-2 font-poppins font-bold`} style={{ fontSize: `${calculateFontSize(nftName)}px` }}>
                {nftName}
              </div></>
        )}
        </div>
      </div>
    );
  });
};

return (
  <div className="inventory-view p-4 max-w-7xl mx-auto my-8">
    <Event headerTitle="Stats" event={<InventoryStatsGrid inventoryStats={inventoryStats} userOwnedTraits={userOwnedTraits} />} />

    {/* Top divider */}
    <div className="border-t-2 border-gray-200 my-8"></div>

    {/* Main content area */}
    <div className="bg-[#FAFAFA] mt-4">
    <div className="align-center mx-auto flex flex-row px-4 sm:px-8 xxl:px-16 justify-between items-center gap-4" style={{ maxWidth: "2560px" }}>
        
        {/* Left aligned items */}
      <div className="flex items-center gap-4 flex-grow">
          {/* View by Item/Collection buttons */}
          <button
            className={`view-toggle-btn ${viewMode === 'itemized' ? 'bg-[#6510F2]' : 'bg-[#ADADAD]'} hover:bg-[#7b2df8] transition ease-in-out delay-75 text-white font-bold py-2 px-4 rounded h-10`}
            onClick={() => setViewMode('itemized')}
          >
            Item View
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'collection' ? 'bg-[#6510F2]' : 'bg-[#ADADAD]'} hover:bg-[#7b2df8] transition ease-in-out delay-75 text-white font-bold py-2 px-4 rounded h-10`}
            onClick={() => {
              setViewMode('collection');
              setSelectedCollection('all');
          }}
          >
            Collection View
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
          className="searchBar indent-2 shadow bg-white font-poppins font-bold rounded h-10 w-full" />
        {searchTerm && (
          <button
          onClick={() => {
            setSearchTerm('');
            setCurrentPage(1); // Also reset the current page to 1 when clearing the search
          }}
            className="clear-search absolute right-2 top-1/2 transform -translate-y-1/2"
            aria-label="Clear search"
          >
            <img src='/assets/clearSearchButton.png' alt='clearSearch' className="w-4 h-4" />
          </button>
            )}
          </div>
        </div>

        {/* Right aligned items */}
        <div className="flex items-center">
  {/* Conditionally rendered dropdown based on viewMode */}
  {viewMode === 'itemized' ? (
    <select
      className="sortDropdown shadow bg-white font-poppins font-bold rounded py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
      onChange={handleSortChange} // Assume this function handles sorting for itemized view
    >
      <option value="Owned">Sort by Owned</option>
      <option value="NotOwned">Sort by Not Owned</option>
      <option value="A-Z">A-Z</option>
      <option value="Z-A">Z-A</option>
      {/* Additional sort options for itemized view */}
    </select>
  ) : (
    <><><select
    className="sortDropdown shadow bg-white font-poppins font-bold rounded py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
    onChange={handleCollectionChange} // Assume this function handles sorting/filtering for collection view
  >
    {/* Options for sorting/filtering collections */}
    {/* This line adds the "All Collections" option */}
    {Object.entries(collectionNameMapExtended).map(([value, name]) => (
      <option key={value} value={value}>{name}</option>
    ))}
  </select></>
  <select
    className="sortDropdown shadow bg-white font-poppins font-bold rounded py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
    onChange={handleCollectionChange} // Assume this function handles sorting/filtering for collection view
  >
      {Object.entries(attributeNameMapExtended).map(([value, name]) => (
        <option key={value} value={value}>{name}</option>
      ))}
    </select></>
  )}

  {/* Grid toggles */}
  <div className="bg-[#AA7AFA] rounded-lg">
  <button
    onClick={() => toggleGridSize('8x8')}
    className={`grid-toggle-btn ${gridSize === '8x8' ? 'bg-[#7b2df8]' : 'bg-[#AA7AFA]'} hover:bg-[#7b2df8] transition ease-in-out delay-75 h-10 w-10 rounded-xl`}
    aria-label="Condensed Grid"
  >
    <img src={'/icons/denseToggle.png'} alt="Condensed grid" className="w-6 h-6 m-auto" />
  </button>
  <button
    onClick={() => toggleGridSize('4x3')}
    className={`grid-toggle-btn ${gridSize === '4x3' ? 'bg-[#7b2df8]' : 'bg-[#AA7AFA]'} hover:bg-[#7b2df8] transition ease-in-out delay-75 h-10 w-10 rounded-xl`}
    aria-label="Wide Grid"
  >
    <img src={'/icons/wideToggle.png'} alt="Wide grid" className="w-6 h-6 m-auto" />
  </button>
  </div>
</div>

</div>

      {/* NFT Display */}
{/* Conditional rendering based on viewMode */}
{viewMode === 'itemized' ? (
      <div className={`grid ${gridSize === '4x3' ? 'lg:grid-cols-4 gap-4' : 'lg:grid-cols-8'} justify-items-center md:grid-cols-2 sm:grid-cols-1`}>
        {renderItemizedData()}
      </div>
    ) : (
      <div className={`grid ${gridSize === '4x3' ? 'lg:grid-cols-4 gap-4' : 'lg:grid-cols-8'} justify-items-center md:grid-cols-2 sm:grid-cols-1`}>
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
