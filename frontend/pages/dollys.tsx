import DollGallery from "../src/components/DollGallery/DollGallery";
import DollEditor from "../src/components/DollEditor/DollEditor";
import { useState } from "react";

export default function Dollys() {
  const [selected, selectedSet] = useState<number | null>(-1);

  const handleCreateNewDolly = () => selectedSet(null);

  // Correctly typed parameter and use `selectedSet` for updating the ID
  const handleDollySaved = (newId: number | null) => {
    // Update the state that holds the current Dolly ID
    selectedSet(newId);
  };

  return (
    <div className="flex-center flex-col">
      {selected === -1 && (
        <>
          <div>
            <button className="bg-hunnys-yellow text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-1 text-4xl hover:shadow-lg hover:scale-[1.02] transition-all" onClick={handleCreateNewDolly}>Create New Dolly</button>
          </div>
          <DollGallery selectDoll={selectedSet} />
        </>
      )}
      {selected !== -1 && <DollEditor onDollySaved={handleDollySaved} selectDoll={selectedSet} id={selected} isNew={selected === null} />}
    </div>
  );
}
