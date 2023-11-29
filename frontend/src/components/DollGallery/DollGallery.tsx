import React, { useState, useEffect } from 'react';
import Mint from "./Mint";
import Render from "../Render/Render";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import Help from "../Help/Help";
import Image from "next/image";

import ImageWithFallback from './ImageWithFallback';

function DollGallery({ selectDoll }: any) {
    const [user] = useAtom(userAtom);
    const [currentPage, setCurrentPage] = useState(1);
    const DOLLYS_PER_PAGE = 12;  // Display 12 Dollys per page, adjust as needed
    const [sortedDollys, setSortedDollys] = useState<any[]>([]);


    useEffect(() => {
        setSortedDollys([...user!.dollys].sort((a: any, b: any) => a.token_id - b.token_id));
    }, [user!.dollys]);

    const startIndex = (currentPage - 1) * DOLLYS_PER_PAGE;
    const endIndex = startIndex + DOLLYS_PER_PAGE;
    const currentDollys = sortedDollys.slice(startIndex, endIndex);

    const variants = {
        visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.08 } },
        hidden: { opacity: 0, transition: { when: "afterChildren" } },
    };

    const item = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -20 },
    };

    return (
        <div className="w-full flex-center">
            <div className="w-full max-w-[1250px] relative mx-6">
                <div className="flex flex-wrap justify-between">
                    <h1 className="text-xl font-bold py-3 flex flex-wrap">
                        <div className="mr-3">Dress Up Your Dollys</div>
                        <Help {...{
                            title: "Dressing Up Your Dolly",
                            body: "Select a Dolly below. If you don't have one yet, or want a new one, simply create one using the 'Create New Dolly' button. \n \n Once selected, you're ready to unleash your creativity! \n \n Dress them up, accessorize, mix & match - all by using styles & pieces based on the different pieces of Hunnys art you've collected. \n \n Have fun, cupcake! And don't forget to share your creation after you're done! 🥰",
                            className: "",
                        }} />
                    </h1>
                    <Mint />
                </div>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {currentDollys.map((doll: any) => (
                        <motion.div
                            key={doll.token_id}
                            variants={item}
                            onClick={() => selectDoll(doll.token_id)}
                            className="relative aspect-square bg-white flex justify-center hover:cursor-pointer border-[0px] transition-custom border-[#fff] rounded-2xl"
                        >
                            <div className="w-full h-full">
                                <p className="z-40 select-none absolute top-7 bg-white rounded-r-md pr-4 pl-3 py-1 tracking-wide shadow-md font-bold">
                                    {doll.token_id}
                                </p>
                    
                                {/* <Render token={doll.attributes} /> */}

                                <ImageWithFallback
                                    // key={doll.token_id}
                                    layout="fill"
                                    src={`https://hunnys.s3.us-east-2.amazonaws.com/dollys/${doll.token_id}.png`}
                                    fallbackSrc={`/assets/img/empty.png`}
                                />

                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                <div className="pagination-controls">
                    <button className={`bg-hunnys-blue paginate text-hunnys-yellow w-full font-title shadow-md rounded-full px-8 py-1 text-4xl hover:shadow-lg hover:scale-[1.02] transition-all ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : ''}`} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                    <button className={`bg-hunnys-yellow paginate text-hunnys-blue w-full font-title shadow-md rounded-full px-8 py-1 text-4xl hover:shadow-lg hover:scale-[1.02] transition-all ${currentDollys.length < DOLLYS_PER_PAGE ? 'opacity-40 cursor-not-allowed' : ''}`} disabled={currentDollys.length < DOLLYS_PER_PAGE} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                </div>
            </div>
        </div>
    );
}

export default React.memo(DollGallery);
