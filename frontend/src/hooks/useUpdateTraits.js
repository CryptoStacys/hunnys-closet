// hooks/useUpdateTraits.js
import { fetchTraits } from '../utils/traitUtils';

const useUpdateTraits = (setAllAvailableTraits, setUser, allAvailableTraits) => {
  const updateTraits = async (userAddress, getAllAvailableTraits) => {
    const ownedTraits = await fetchTraits(userAddress);
    

    if (!Array.isArray(ownedTraits) || !Array.isArray(allAvailableTraits)) {
      console.error('Invalid data:', { ownedTraits, allAvailableTraits });
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
