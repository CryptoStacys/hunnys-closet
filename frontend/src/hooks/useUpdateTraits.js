// hooks/useUpdateTraits.js
import { fetchTraits } from '../utils/traitUtils';


const useUpdateTraits = (setAllAvailableTraits, setUser) => {
  const updateTraits = async (userAddress) => {
    const ownedTraits = await fetchTraits(userAddress);

    if (!Array.isArray(ownedTraits)) {
      console.error('No traits data available or data is not an array:', ownedTraits);
      return;
    }

    const updatedTraits = allAvailableTraits.map(trait => {
      const isOwnedNow = ownedTraits.some(ownedTrait => ownedTrait.id === trait.id);
      return { ...trait, isOwned: isOwnedNow };
    });

    setAllAvailableTraits(updatedTraits);
    setUser(user => ({ ...user, traits: ownedTraits }));
  };

  return updateTraits;
};

export default useUpdateTraits;
