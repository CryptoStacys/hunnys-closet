// src/utils/traitUtils.js

export const fetchTraits = async (userAddress) => {
    let url;
    if (userAddress) {
      url = `https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/verifyCloset?wallet=${userAddress}`;
    } else {
      url = 'https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/traits'; 
    }
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data.traits)) {
        return data.traits;
      } else {
        console.error('Traits data is not an array:', data.traits);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      return []; 
    }
  };
  