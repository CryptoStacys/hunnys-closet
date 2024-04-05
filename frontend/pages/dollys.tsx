import DollGallery from "../src/components/DollGallery/DollGallery";
import DollEditor from "../src/components/DollEditor/DollEditor";
import { useEffect, useState } from "react";
import { activeDollyComponentAtom, connectedAtom, userAtom } from "../src/data/store";
import { useAtom } from "jotai";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

export default function Dollys() {
  const [selected, setSelected] = useState<number | string>(-1); // Allow string for temporary ID
  const [user] = useAtom(userAtom);
  const [connected] = useAtom(connectedAtom);
  const router = useRouter();
  const [activeDollyComponent, setActiveDollyComponent] = useAtom(activeDollyComponentAtom);

  useEffect(() => {
    setActiveDollyComponent(selected === -1 ? 'gallery' : 'editor');
  }, [selected, setActiveDollyComponent]);
  
  const handleCreateNewDolly = () => {
    const tempId = `temp-${new Date().getTime()}`; // Generate a unique temporary ID
    setSelected(tempId);
  };

  console.log("User Address on /dollys", user?.address);
  console.log("Dolly count:", user?.dollyCount); // Just an example, replace with actual usage
  console.log("Active Dolly Component:", activeDollyComponent)
  // Ensure you're not trying to access dollys if user is null
  useEffect(() => {
    if (!user) {
      router.push('/'); // Redirect to the homepage
    }
  }, [user, router]);

  const handleDollySaved = (newId: number) => {
    setSelected(newId); // Update with permanent ID once minted
  };

  // Fix the reference to `selectedSet` to `setSelected` in the components below
  return (
    <div className="flex-center flex-col max-w-screen-xl m-auto">
      {selected === -1 && (
        <>
          <div className="relative md:top-4 lg:top-4 xs:self-center md:self-end xs:mr-6 xl:mr-10 galleryCreate">
            <button className="bg-hunnys-yellow text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-1 text-4xl hover:shadow-lg hover:scale-[1.02] transition-all" onClick={handleCreateNewDolly}>Create New Dolly</button>
          </div>
          <DollGallery selectDoll={setSelected} />
        </>
      )}
      {selected !== -1 && <DollEditor onDollySaved={handleDollySaved} selectDoll={setSelected} id={selected} isNew={typeof selected === "string" && selected.startsWith("temp-")} />}
    </div>
  );
}
