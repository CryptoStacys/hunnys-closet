import { Route } from '../src/components/Router/Router';
import { useAccount } from "wagmi";
import { useAtom } from "jotai";
import React, { useState, useEffect } from 'react';
// import { useState, useEffect } from "react";
// import { useRouter } from 'next/router'
import { allTraitsAtom, userAtom, connectedAtom } from "../src/data/store";
import { attributes, localStorageToken } from "../src/data/config";
import Dashboard from '../src/components/Dashboard/Dashboard';
import Dollys from "./dollys";
import Inventory from "./inventory";
import Help from "./help";

import Nav from "../src/components/Nav/Nav";
import Login from "../src/components/Login/Login";
// import Tokens from "../src/components/Tokens/Tokens";
import Modal from "../src/components/Modal/Modal";

import sparkleBg from "./../src/assets/img/sparkle_bg.png";

export default function App() {
  const [user, userSet] = useAtom(userAtom);
  const [allTrais, allTraitsSet] = useAtom(allTraitsAtom);
  const [connected, connectedSet] = useAtom(connectedAtom);
  const [rewardStatus, setRewardStatus] = useState("");

  // const paths = ['/', '/inventory', '/dollys', '/help'];

  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      // console.log("Connected. wagmi object", {
      //   address,
      //   connector,
      //   isReconnected,
      // });

      fetch(`https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/traits?wallet=${address}`)
    .then((res) => {
        if (!res.ok) {
            throw new Error(`API call failed with HTTP status ${res.status}`);
        }
        return res.json();
    })
    .then((res) => {
        allTraitsSet(res);
        return res;
    })
    .catch((error) => {
        console.error("Error fetching traits:", error);
    });

        // CACHEBUST https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/verifyCloset?wallet=${address}&nocache=${new Date().getTime()}`

        fetch(`https://closetapi.hunnysnft.com/wordpress/wp-json/hunnys-closet/v1/verifyCloset?wallet=${address}`)
    .then((res) => {
        if (!res.ok) {
            throw new Error(`API call failed with HTTP status ${res.status}`);
        }
        return res.json();
    })
    .then((res) => {
          res.address = address;
          console.log("Hunnys WP response:", res);
          setRewardStatus(res.rewardStatus);
          res.hideSaveChangesModal = false;
          connectedSet(true);
          userSet(res);
          return res;})
          .catch((error) => {
              console.error("Error verifying closet:", error);
          });

    },
    
    onDisconnect() {
      userSet(null);
      connectedSet(false);
      // MOVE TO HOME PAGE
      window.history.pushState({}, "", "/");
      const navEvent = new PopStateEvent("popstate");
      window.dispatchEvent(navEvent);
    },
  });

  useEffect(() => {
    initializeLocalStorageForNewUsers();
  }, []); // Empty dependency array ensures this runs once on mount.

  function initializeLocalStorageForNewUsers() {
    const existingToken = localStorage.getItem(localStorageToken);
    if (!existingToken) {
      // Define a default, empty array or an array with default traits.
      const defaultTraits: never[] = []; // Adjust based on what constitutes an "empty" dolly.
      localStorage.setItem(localStorageToken, JSON.stringify(defaultTraits));
      console.log("Initialized local storage with default dolly traits.");
    }
  }

  return (
    <div className="pb-8" style={{backgroundImage: `url(${sparkleBg.src})` }}>
    {/* <div className="pb-8" style={{backgroundImage: `url(${sparkleBg})`, backgroundSize: '640px' }}> */}
      <Nav rewardStatus={rewardStatus} />
      <Modal />
      <div className="relative mt-[70px] z-30">
        {!connected ? (
          <>
            <Login />
          </>
        ) : (
          <> 
          <Route path="/">
            <Dashboard />
          </Route>
          <Route path="/dollys">
            <Dollys />
          </Route>
          {/* <Route path="/tokens">
            <Tokens />
          </Route> */}
         <Route path="/inventory">
            <Inventory />
          </Route>
          <Route path="/help">
            <Help />
          </Route>
            
          </>
        )}
      </div>
    </div>
  );
}
