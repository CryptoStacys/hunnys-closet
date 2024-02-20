import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import { Token } from "../../data/global";
import Card from '../Card/Card';

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
  const ITEMS_PER_PAGE = 12;
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
    // Each entry in displayedNftData is a [tokenId, items] pair
    return displayedNftData.map(([tokenId, items], index) => {
      const isOwned = isTokenOwned(tokenId);
      // Assume the first item's image and name represent the NFT
      const [firstItem] = items;
      const nftImage = firstItem[1];
      const nftName = firstItem[3];

      return (
        <div
          key={index}
          className={`border p-4 rounded ${
            isOwned ? "bg-green-200" : "bg-red-200"
          } hover:shadow-lg transform transition duration-500 hover:scale-105 m-4`}
        >
          <img
            src={nftImage}
            alt={`NFT ${tokenId}`}
            className="w-64 h-64 m-auto"
          />
          <div className="pt-4">
            <h1 className="text-sm font-bold mb-2">
              {nftName} - #{tokenId}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {items.map((item: any[], idx: React.Key | null | undefined) => (
                <div key={idx} className="text-center">
                  <img
                    className="w-full h-auto max-h-24 mx-auto"
                    src={item[8]}
                    alt={`Trait ${item[1]}`}
                  />
                  <p className="text-xs mt-1">
                    {item[5]}: {item[2]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            {isOwned ? (
              <p className="mt-4 text-center text-green-700 font-bold">Owned</p>
            ) : (
              <a
                href={`https://buy.hunnys.io/polygon/asset/0x43668e306dba9172824524fd2c0c6924e710ea5b:${tokenId}`}
                target="_blank"
                rel="noreferrer"
                className="block mt-4 bg-blue-600 text-white text-center font-bold px-4 py-2 rounded hover:bg-opacity-80"
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
        leftBlockContent={<div className="flex flex-col">
          <h1 className="luckiest">Inventory Stats</h1>
          <ul className="list-disc">
          <li>Total Amount Collected: X out of Y</li>
          <li>Hunnys 10k: X out of Y collected</li>
          <li>Hunnys OGs: X out of Y collected</li>
          <li>Hunnys Seasons: X out of Y collected</li>
          <li>Stacys: X out of Y collected</li>
          <li>Hunnys Closet Shop: X out of Y collected</li>
          </ul>
        </div>}
        middleBlockContent={<div className="font-bold align-center m-auto flex flex-col pl-1 text-[#444] luckiest ">
        <select
          className="bg-white sortDropdown shadow-lg rounded-b-lg uppercase"
          onChange={handleSortChange}
        >
          <option value="default">Default Sort</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Owned">Sort by Owned</option>
          <option value="NotOwned">Sort by Not Owned</option>
          {/* Add other sort options here as needed */}
        </select>
      </div>}
        rightBlockContent={<div className="search-bar ml-8 flex flex-col align-center m-auto">
        <input
          type="text"
          placeholder="Search traits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input ml-8 float-end bg-white searchBar indent-2 border-black"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="clear-search">
            Clear
          </button>
        )}
      </div>}
        footer={<>
        
</>}        
      />
      
      {/* NFT Display */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {renderNftData()}
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
