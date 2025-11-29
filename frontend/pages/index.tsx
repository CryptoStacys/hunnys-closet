import { Route } from '../src/components/Router/Router';
import { useAtom } from "jotai";
import React, { useEffect } from 'react';
import { userAtom, connectedAtom } from "../src/data/store";
import { localStorageToken } from "../src/data/config";
import Dashboard from '../src/components/Dashboard/Dashboard';
import Dollys from "./dollys";
import Nav from "../src/components/Nav/Nav";
import Login from "../src/components/Login/Login";
import Modal from "../src/components/Modal/Modal";
import { useAuth } from '../src/hooks/useAuth';

export default function App() {
  const [user, setUser] = useAtom(userAtom);
  const [connected, setConnected] = useAtom(connectedAtom);
  const { user: authUser, isAuthenticated, loading } = useAuth();

  // Sync auth user with jotai user atom
  useEffect(() => {
    if (isAuthenticated && authUser) {
      setUser({
        id: authUser.id,
        email: authUser.email,
        username: authUser.username,
        profile_name: authUser.profile_name || authUser.username,
        profile_image_url: authUser.profile_image_url || '',
        achievements: authUser.achievements || {},
        tier: authUser.tier || 'Fresh Cupcake',
        titles: authUser.titles || [],
        cupcake_points: authUser.cupcake_points || 0,
        level: authUser.level || 1,
        dollys: [],
        dollyCount: 0,
        tokens: [],
        traits: [],
        colors: [],
        skin_colors: [],
      });
      setConnected(true);
    } else {
      setUser(null);
      setConnected(false);
    }
  }, [authUser, isAuthenticated, setUser, setConnected]);

  useEffect(() => {
    initializeLocalStorageForNewUsers();
  }, []);

  function initializeLocalStorageForNewUsers() {
    const existingToken = localStorage.getItem(localStorageToken);
    if (!existingToken) {
      const defaultTraits: never[] = [];
      localStorage.setItem(localStorageToken, JSON.stringify(defaultTraits));
      console.log("Initialized local storage with default dolly traits.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-pink-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pb-8 ">
      <Nav rewardStatus={''} />
      <Modal />
      <div className="relative mt-[70px] z-30">
        {!isAuthenticated ? (
          <Login />
        ) : (
          <>
          <Route path="/">
            <Dashboard />
          </Route>
          <Route path="/dollys">
            <Dollys />
          </Route>
          </>
        )}
      </div>
    </div>
  );
}
