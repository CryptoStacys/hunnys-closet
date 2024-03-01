import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom, allTraitsAtom, userTraitsAtom } from "../../data/store";
import { Token, UserOwnedTraits } from "../../data/global";
import Card from '../Card/Card';
import Event from '../Card/Events';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Lazy } from 'swiper/modules';
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
  // For example:
  [key: string]: any; // Adjust this to match the actual structure
}

interface GroupedByOriginName {
  [originName: string]: NftItem[];
}

interface GroupedByTokenId {
  [tokenId: string]: NftItem[];
}

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedNftData, setSortedNftData] = useState<any[]>([]);
  const [sortType, setSortType] = useState("default");
  const [selectedImage, setSelectedImage] = useState(null);
  const ITEMS_PER_PAGE = 9;
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
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const [pageTotal, setPageTotal] = useState(Math.ceil(nftData.length / ITEMS_PER_PAGE));
  const [inventoryStats, setInventoryStats] = useState<{ [key: string]: { total: number; owned: number } }>({});
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  
  const currentItems = displayedNftData.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    // Log the current state of userAtom when Dashboard mounts or when user data changes
    console.log('userAtInventory:', inventoryStats);
  }, [user]);

  

  useEffect(() => {
    const fetchAndGroupData = async () => {
      try {
        const url =
          "https://sheets.googleapis.com/v4/spreadsheets/1JXPvvxTPbxPARLpbV0e2U5TdFvdik1duQkLWWLZJ42Y/values/A2:K1400?key=AIzaSyAjknT53sMDEOdJ3YtCmjgP3VeSTvSGB3U";
          const response = await axios.get(url);
          const fetchedNftData = response.data.values;
          
          // Group data by originName and tokenId in one pass
          const groupedByOriginName: { [key: string]: any[] } = {};
          const groupedByTokenId: { [key: string]: any[] } = {};
          
          fetchedNftData.forEach((item: any[]) => {
            const originName = item[9]; // Assuming 10th column is originName
            const tokenId = item[0];
            
            // Group by originName
            if (!groupedByOriginName[originName]) groupedByOriginName[originName] = [];
            groupedByOriginName[originName].push(item);
            
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
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Assuming you'll use this state to render the filtered, sorted, and paginated data
  setSortedAndFilteredNftData(paginatedData.map(entry => entry[1]).flat());
}, [groupedNftData, searchTerm, sortType, currentPage, ITEMS_PER_PAGE]);


const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSortType(e.target.value);
  setCurrentPage(1); // Reset to first page on sort change
};

  const openLightbox = (imageSrc: React.SetStateAction<null>) => {
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
        <div className="grid grid-rows-2 grid-cols-3 gap-4">
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
            <p className="stat-value">{hunnysSeasonalStats.total}/183</p>
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
  
  const applyFilterSortAndPaginate = () => {
    // Filter based on search term
    let filteredAndGroupedData = Object.entries(groupedNftData).filter(
      ([_, items]) =>
        items.some(
          (item) =>
            item[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item[2].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item[3].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item[5].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item[7].toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Make sure isTokenOwned function returns a boolean
    const isTokenOwned = (nftTrait: string, originName: string | Token[] | undefined) => {
      const key = `${nftTrait}_${originName}`;
      const owned = userOwnedTraits[key] === true;
      console.log(`Checking ownership for ${key}: ${owned}`);
      return owned; // Check if the trait is marked as owned
    };
    
    // Sort based on sortType
    // Assuming sorting by the name of the first item in each group
    switch (sortType) {
      case "A-Z":
        filteredAndGroupedData.sort((a, b) =>
          a[1][0][3].localeCompare(b[1][0][3])
        );
        break;
      case "Z-A":
        filteredAndGroupedData.sort((a, b) =>
          b[1][0][3].localeCompare(a[1][0][3])
        );
        break;
        case "Owned":
  filteredAndGroupedData.sort((a, b) => {
    const aOwned = isTokenOwned(a[1][0][2], a[1][0][9]) ? -1 : 1; // Assuming the trait name is at index 2 and origin name is at index 9
    const bOwned = isTokenOwned(b[1][0][2], b[1][0][9]) ? -1 : 1;
    return aOwned - bOwned;
  });
  break;
case "NotOwned":
  filteredAndGroupedData.sort((a, b) => {
    const aOwned = isTokenOwned(a[1][0][2], a[1][0][9]) ? 1 : -1;
    const bOwned = isTokenOwned(b[1][0][2], b[1][0][9]) ? 1 : -1;
    return aOwned - bOwned;
  });
  break;

      }

   // Update pageTotal state
  const filteredPageTotal = Math.ceil(filteredAndGroupedData.length / ITEMS_PER_PAGE);
  setPageTotal(filteredPageTotal);

  // Reset to the first page if the current page exceeds the new total pages
  if (currentPage > filteredPageTotal) {
    setCurrentPage(1);
  }

  // Adjust the setDisplayedNftData call to use paginated data
  const paginatedGroups = filteredAndGroupedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  setDisplayedNftData(paginatedGroups);
};

const isTokenOwned = (nftTrait: string, originName: string | Token[] | undefined) => {
  const key = `${nftTrait}_${originName}`;
  const owned = userOwnedTraits[key] === true;
  console.log(`Checking ownership for ${key}: ${owned}`);
  return owned; // Check if the trait is marked as owned

};
  useEffect(() => {
    applyFilterSortAndPaginate();
    console.log("Displayed NFT Data after sort/filter/paginate:", displayedNftData);
}, [groupedNftData, searchTerm, sortType, currentPage, userTokens]);


const handleCollectClick = async (nft: { origin_name: string; }) => {
  if (nft.origin_name === 'Default') {
    // Default tokens are automatically owned, no action required
    console.log('Token is automatically owned.');
  }
}

const renderNftData = () => {
  return displayedNftData.map(([tokenId, items], index) => {
    // Extracting the button URL from the item data
    const buttonURL = items[0][10]; // Assuming button URL is in the 11th column (index 10)
    const originName = items[0][9]; // Example: adjust based on your actual data structure
    const [firstItem] = items;
    const nftImage = firstItem[1];
    const nftName = firstItem[3];
    const nftTrait = firstItem[2];
    const isOwned = isTokenOwned(nftTrait, originName); // Assuming origin name is at index 9
    return (
      <div
        key={index}
        className="border p-4 rounded-xl bg-white max-w-[250px] max-h-[600px] hover:shadow-lg transform transition duration-500 hover:scale-105 m-4 overflow-hidden"
      >
        <img src={nftImage} alt={`NFT ${tokenId}`} className="w-64 h-64 m-auto rounded-xl" />
        <div className="pt-4">
          <h1 className="text-sm font-bold mb-2">{nftName}</h1>
          {/* Carousel for items */}
          <Swiper
            navigation={true}
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={3}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {items.map((item: any[], idx: React.Key | null | undefined) => (
              <SwiperSlide key={idx} onClick={() => openLightbox(item[8])}>
                <div className="text-center cursor-pointer">
                  <img className="w-full h-auto max-h-24 mx-auto border-[#C6C6C6] border-2 rounded-xl" src={item[8]} alt={`Trait ${item[1]}`} />
                  <p className="text-xs mt-1">{item[5]}: {item[2]}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Conditionally render the Collect button */}
        {buttonURL !== 'NA' && (
          <a
            href={buttonURL}
            target="_blank"
            rel="noreferrer"
            className="block mt-4 bg-[#6510F2] luckiest text-3xl text-white font-bold px-4 py-2 rounded-full text-center hover:bg-opacity-80"
          >
            VIEW
          </a>
        )}
        {/* Optionally handle the case where the item is owned differently */}
        {isOwned && (
          <p className="mt-4 text-center text-green-700 font-bold">Owned</p>
        )}
      </div>
    );
  });
};


  return (
    <div className="inventory-view p-4 max-w-5xl mx-auto my-8">
      <Event
        headerTitle="Inventory"
        event={<>
        <InventoryStatsGrid inventoryStats={inventoryStats} />
</>}        
      />
      <div className="bg-[#EDEDED]">
<div className="align-center m-auto flex flex-row pl-1 font-poppins mt-16">
  <h1 className="font-bold text-2xl flex-grow-[0.7]">Search Inventory</h1>
  <div className="flex items-center">
    <select
      className="sortDropdown shadow-lg mr-4 p-[7.5px]"
      onChange={handleSortChange}
    >
      <option value="default">Default Sort</option>
      <option value="A-Z">A-Z</option>
      <option value="Z-A">Z-A</option>
      <option value="Owned">Sort by Owned</option>
      <option value="NotOwned">Sort by Not Owned</option>
      {/* Add other sort options here as needed */}
    </select>
    <div className="relative">
      <input
        type="text"
        placeholder="Search Inventory..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchBar indent-2 w-[140%]"
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
    </div>
  </div>
</div>

      {/* NFT Display */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {renderNftData()}
      </div>
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
