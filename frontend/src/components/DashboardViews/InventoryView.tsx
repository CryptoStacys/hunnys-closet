import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import { Token } from "../../data/global";
import Card from '../Card/Card';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Lazy } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
// Import Swiper core and required modules
import SwiperCore from 'swiper';
// Install Swiper modules
SwiperCore.use([Navigation]);

interface InventoryStats {
  hunnysSeasonal: {
    owned: number;
    total: number;
  };
};

const InventoryView = () => {
  const [user] = useAtom(userAtom);
  const [nftData, setNftData] = useState<Array<any>>([]);
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [groupedNftData, setGroupedNftData] = useState<{
    [key: string]: any[];
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedNftData, setSortedNftData] = useState<any[]>([]);
  const [sortType, setSortType] = useState("default");
  const [selectedImage, setSelectedImage] = useState(null);
  const [inventoryStats, setInventoryStats] = useState({
    hunnysSeasonal: { total: 0, owned: 0 },
    // Initialize other collections similarly
  });
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
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = displayedNftData.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    // Log the current state of userAtom when Dashboard mounts or when user data changes
    console.log('Current user data in Inventory:', user);
  }, [user]);

  

  useEffect(() => {
    const fetchNftData = async () => {
      try {
        const url =
          "https://sheets.googleapis.com/v4/spreadsheets/1JXPvvxTPbxPARLpbV0e2U5TdFvdik1duQkLWWLZJ42Y/values/A2:I370?key=AIzaSyAjknT53sMDEOdJ3YtCmjgP3VeSTvSGB3U";
        const response = await axios.get(url);
        setNftData(response.data.values);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNftData();
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
  }, [nftData, user, searchTerm, sortType, currentPage]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  useEffect(() => {
    // Combine filtering and sorting into one step
    let filteredData = Object.entries(groupedNftData);

    // Filtering by search term
    if (searchTerm) {
      filteredData = filteredData.filter(([_, items]) =>
        items.some((item) =>
          item[2].toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Example sorting (alphabetically by NFT name)
    filteredData.sort((a, b) => a[1][0][2].localeCompare(b[1][0][2]));

    // Pagination
    const paginatedData = filteredData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

    setSortedAndFilteredNftData(paginatedData);
  }, [groupedNftData, searchTerm, currentPage]);

  const openLightbox = (imageSrc: React.SetStateAction<null>) => {
    setSelectedImage(imageSrc);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    if (user && user.tokens) {
      const hunnysSeasonalTokens = user.tokens.filter(
        (token) => token.origin_name === "Hunnys Seasonal"
      );
      setUserTokens(hunnysSeasonalTokens);
    }
    console.log("userTokens:", userTokens);
    
  }, [user]);
  
  useEffect(() => {
    // Assuming groupedNftData and userTokens are already populated

    // Calculate totals for Hunnys Seasonal
    const hunnysSeasonalTotal = Object.entries(groupedNftData).length;
    const hunnysSeasonalOwned = Object.entries(groupedNftData).filter(([tokenId]) =>
      isTokenOwned(tokenId)
    ).length;

    // Update state with new stats
    setInventoryStats(prevStats => ({
      ...prevStats,
      hunnysSeasonal: { total: hunnysSeasonalTotal, owned: hunnysSeasonalOwned },
      // Update other collections similarly
    }));
  }, [groupedNftData, userTokens]);

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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const InventoryStatsGrid = ({ inventoryStats }: { inventoryStats: InventoryStats }) => {
    return (
      <div className="inventory-grid-container bg-white text-white p-4">
        <div className="grid grid-rows-2 grid-cols-4 gap-4">
          <div className="stat-card luckiest text-2xl text-center flex flex-col justify-center p-4 bg-[#EDEDED] rounded-lg shadow-md">
            <p className="stat-title text-center text-black">Rank</p>
            <p className="stat-value text-3xl text-[#AA7AFA]">COMING SOON</p>
          </div>
          <div className="stat-card luckiest text-2xl text-center flex flex-col justify-center p-4 bg-[#EDEDED] rounded-lg shadow-md">
            <p className="stat-title text-center text-black">Level</p>
            <p className="stat-value text-3xl text-[#AA7AFA]">12</p>
          </div>
          <div className="stat-card luckiest text-2xl text-center flex flex-col justify-center p-4 bg-[#EDEDED] rounded-lg shadow-md">
            <p className="stat-title text-center text-black">Achievement Points</p>
            <p className="stat-value text-3xl text-[#AA7AFA]">22839</p>
          </div>
          <div className="stat-card luckiest text-2xl text-center flex flex-col justify-center p-4 bg-[#EDEDED] rounded-lg shadow-md">
            <p className="stat-title text-center text-black">Hunnys Seasons</p>
            <p className="stat-value text-3xl text-[#AA7AFA]">{inventoryStats.hunnysSeasonal.owned}/{inventoryStats.hunnysSeasonal.total}</p>
          </div>
          <div className="stat-card luckiest text-2xl text-center flex flex-col justify-center p-4 bg-[#EDEDED] rounded-lg shadow-md">
            <p className="stat-title text-center text-black">Traits</p>
            <p className="stat-value text-3xl text-[#AA7AFA]">1212/1402</p>
          </div>
          <div className="stat-card luckiest text-2xl text-center flex flex-col justify-center p-4 bg-[#EDEDED] rounded-lg shadow-md">
            <p className="stat-title text-center text-black">Hunnys 10k</p>
            <p className="stat-value text-3xl text-[#AA7AFA]">10</p>
          </div>
          <div className="stat-card luckiest text-2xl text-center flex flex-col justify-center p-4 bg-[#EDEDED] rounded-lg shadow-md">
            <p className="stat-title text-center text-black">Hunnys OGs</p>
            <p className="stat-value text-3xl text-[#AA7AFA]">2</p>
          </div>
          <div className="stat-card luckiest text-2xl text-center flex flex-col justify-center p-4 bg-[#EDEDED] rounded-lg shadow-md">
            <p className="stat-title text-center text-black">Stacys</p>
            <p className="stat-value text-3xl text-[#AA7AFA]">2</p>
          </div>
          {/* Add more stat cards as needed */}
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
    const isTokenOwned = (tokenId: string): boolean => {
      return userTokens.some((token) => token.token_id?.toString() === tokenId);
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
        // Convert boolean to number explicitly for sorting
        filteredAndGroupedData.sort(
          (a, b) => (isTokenOwned(b[0]) ? 1 : 0) - (isTokenOwned(a[0]) ? 1 : 0)
        );
        break;
      case "NotOwned":
        // Convert boolean to number explicitly for sorting
        filteredAndGroupedData.sort(
          (a, b) => (isTokenOwned(a[0]) ? 1 : 0) - (isTokenOwned(b[0]) ? 1 : 0)
        );
        break;
    }



  // Adjust the setDisplayedNftData call to use paginated data
  

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

  const isTokenOwned = (tokenId: string) =>
    userTokens.some((token) => token.token_id?.toString() === tokenId);
  useEffect(() => {
    applyFilterSortAndPaginate();
}, [groupedNftData, searchTerm, sortType, currentPage, userTokens]);


const renderNftData = () => {
  return displayedNftData.map(([tokenId, items], index) => {
    const isOwned = isTokenOwned(tokenId);
    const [firstItem] = items;
    const nftImage = firstItem[1];
    const nftName = firstItem[3];

    return (
      <div
        key={index}
        className="border p-4 rounded-xl bg-white max-w-[250px] max-h-[460px] hover:shadow-lg transform transition duration-500 hover:scale-105 m-4 overflow-hidden"
      >
        <img src={nftImage} alt={`NFT ${tokenId}`} className="w-64 h-64 m-auto rounded-xl" />
        <div className="pt-4">
          <h1 className="text-sm font-bold mb-2">{nftName} - #{tokenId}</h1>
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
        <div>
          {isOwned ? (
            <p className="mt-4 text-center text-green-700 font-bold">Owned</p>
          ) : (
            <a
              href={`https://buy.hunnys.io/polygon/asset/0x43668e306dba9172824524fd2c0c6924e710ea5b:${tokenId}`}
              target="_blank"
              rel="noreferrer"
              className="block mt-4 bg-[#6510F2] luckiest text-3xl text-white font-bold px-4 py-2 rounded-full text-center hover:bg-opacity-80"
            >
              Collect
            </a>
          )}
          
        </div>
      </div>
    );
  });
};

  return (
    <div className="inventory-view p-4 max-w-5xl mx-auto my-8">
      <Card
        headerTitle="Inventory"
        leftBlockContent={""}
        middleBlockContent={""}
        rightBlockContent={""
      }
        footer={<>
        <InventoryStatsGrid inventoryStats={inventoryStats} />
</>}        
      />
      <div className="bg-[#EDEDED]">
<div className="align-center m-auto flex flex-row pl-1 font-poppins">
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
