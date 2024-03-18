import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom, allTraitsAtom } from "../../../../data/store";

interface NftItem {
    // Adjust this to match your actual NFT item structure
    [index: number]: string | undefined;
  }
  
  const CollectionOverview = () => {
    const [user] = useAtom(userAtom);
    const [allTraits] = useAtom(allTraitsAtom);
    const [nftData, setNftData] = useState<NftItem[]>([]);
    const [collections, setCollections] = useState<string[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<string>('Bunny Basics');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchAndGroupData = async () => {
            try {
            const response = await axios.get("https://sheets.googleapis.com/v4/spreadsheets/1JXPvvxTPbxPARLpbV0e2U5TdFvdik1duQkLWWLZJ42Y/values/A2:K1400?key=AIzaSyAjknT53sMDEOdJ3YtCmjgP3VeSTvSGB3U");
            const fetchedNftData: NftItem[] = response.data.values;
            setNftData(fetchedNftData);
            const collectionNames = Array.from(new Set(fetchedNftData.map(item => item[9]))); // Assuming 10th column is originName
            setCollections(collectionNames as string[]);
            } catch (error) {
            console.error("Error fetching data:", error);
            }
        };
        fetchAndGroupData();
        }, []);

    const handleCollectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCollection(event.target.value);
        };
    
        const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
        };
    
        const filteredData = nftData.filter(item => {
        return item[9] === selectedCollection && item[3]?.toLowerCase().includes(searchTerm);
        });

    return (
        <div className="collection-overview">
            
            
  {filteredData.map((item, index) => {
    const buttonURL = item[10]; // Assuming button URL is in the 11th column (index 10)
    const originName = item[9]; // Assuming origin name is in the 10th column
    const nftImage = item[1];
    const nftName = item[3];
    // You might need to adapt the isOwned logic based on how you manage ownership in CollectionOverview
    // const isOwned = isTokenOwned(item[2], originName); // Example, assuming you have a similar function

    return (
      <div key={index} className="border p-2 rounded-xl bg-white hover:shadow-lg transform transition duration-500 hover:scale-105 m-2 overflow-hidden">
        <img src={nftImage} alt={`NFT ${originName}`} className="m-auto rounded-xl w-64 h-64" />
        <div className="pt-1">
          <h1 className="text-xs font-bold mb-1 text-center">{nftName}</h1>
          {/* Adapt content as needed, potentially excluding complex components like Swiper if not applicable */}
          {buttonURL !== 'NA' && (
            <a href={buttonURL} target="_blank" rel="noreferrer" className="block mt-2 bg-[#6510F2] text-lg text-white font-bold px-2 py-1 rounded-full text-center hover:bg-opacity-80">
              VIEW
            </a>
          )}
          {/* Example for showing ownership status, adjust based on actual implementation */}
          {/* {isOwned && (
            <p className="text-xs text-center text-green-700 font-bold">Owned</p>
          )} */}
        </div>
      </div>
    );
  })}
</div>
  );
};

export default CollectionOverview;
