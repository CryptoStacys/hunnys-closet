import DollGallery from "../src/components/DollGallery/DollGallery";
import DollEditor from "../src/components/DollEditor/DollEditor";

import { useState } from "react";

export default function Dollys() {
  const [selected, selectedSet] = useState(-1);

  return (
    <div className="flex-center">
      {/* if no doll selected "-1", show gallery */}
      {selected < 0 && <DollGallery selectDoll={selectedSet} />}
      {/* if doll selected, show doll view */}
      {selected >= 0 && <DollEditor selectDoll={selectedSet} id={selected} />}
    </div>
  );
}
