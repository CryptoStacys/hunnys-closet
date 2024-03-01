import DollGallery from "../src/components/DollGallery/DollGallery";
import DollEditor from "../src/components/DollEditor/DollEditor";
import { useState } from "react";
import { connectedAtom, userAtom } from "../src/data/store";
import { useAtom } from "jotai";
import dynamic from 'next/dynamic';

export default function Dollys() {
  const [selected, setSelected] = useState<number | string>(-1); // Allow string for temporary ID
  const [user] = useAtom(userAtom);
  const [connected] = useAtom(connectedAtom);

  const handleCreateNewDolly = () => {
    const tempId = `temp-${new Date().getTime()}`; // Generate a unique temporary ID
    setSelected(tempId);
  };

  console.log("User Address on /dollys", user?.address);
  console.log("Dolly count:", user?.dollyCount); // Just an example, replace with actual usage

  // Ensure you're not trying to access dollys if user is null
  if (!user) {
    return <div>Loading...</div>; // or any other loading state representation
  }

  const handleDollySaved = (newId: number) => {
    setSelected(newId); // Update with permanent ID once minted
  };

  // Fix the reference to `selectedSet` to `setSelected` in the components below
  return (
    <div className="flex-center flex-col max-w-screen-xl m-auto">
      {selected === -1 && (
        <>
          <div className="relative md:top-2 lg:top-4 sm:self-end sm:mr-6 xl:mr-10 galleryCreate">
            <button className="bg-hunnys-yellow text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-1 text-4xl hover:shadow-lg hover:scale-[1.02] transition-all" onClick={handleCreateNewDolly}>Create New Dolly</button>
          </div>
          <DollGallery selectDoll={setSelected} />
        </>
      )}
      {selected !== -1 && <DollEditor onDollySaved={handleDollySaved} selectDoll={setSelected} id={selected} isNew={typeof selected === "string" && selected.startsWith("temp-")} />}
    </div>
  );
}
