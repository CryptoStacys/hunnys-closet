import dynamic from 'next/dynamic';
const DollGallery = dynamic(() => import("../src/components/DollGallery/DollGallery"), {
  ssr: false,
});
const DollEditor = dynamic(() => import("../src/components/DollEditor/DollEditor"), {
  ssr: false,
});
import { useState } from "react";


export default function Dollys() {
  const [selected, setSelected] = useState<number | string>(-1); // Allow string for temporary ID

  const handleCreateNewDolly = () => {
    const tempId = `temp-${new Date().getTime()}`; // Generate a unique temporary ID
    setSelected(tempId);
  };

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
