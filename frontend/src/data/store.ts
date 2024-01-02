import { atom } from "jotai";
import { ReactNode } from "react";
import { Trait, User } from "./global";

// Stores most important app data of the current user
export const userAtom = atom<User | null>(null);

export const allTraitsAtom = atom<{ traits: Trait[]; colors: string[]; skin_colors: string[] }>({
  traits: [],
  colors: [],
  skin_colors: [],
});

// Tracks the connection state
export const connectedAtom = atom(false);

// Stores data for global modal popups
let content: ReactNode;

export const modalAtom = atom({
  active: false,
  title: "Title",
  body: content,
});

// tracks if there are unsaved changes for the current dolly
export const savedAtom = atom(true);
