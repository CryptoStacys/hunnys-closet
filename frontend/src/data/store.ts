import { atom } from "jotai";
import { ReactNode } from "react";
import { ModalState, Trait, User } from "./global";

// Stores most important app data of the current user
export const userAtom = atom<User | null>(null);
export const currentViewAtom = atom<string>('profile'); // Default view

export const setCurrentViewAtom = atom(
  null, // No read function needed
  (get, set, update: string) => {
    // The `update` parameter is now explicitly typed as string
    set(currentViewAtom, update);
  }
);

export const dollEditorVisibleAtom = atom(false);
export const allTraitsAtom = atom<{ traits: Trait[]; colors: string[]; skin_colors: string[] }>({
  traits: [],
  colors: [],
  skin_colors: [],
});
export const userTraitsAtom = atom<{ traits: Trait[] }>({
  traits: []
});
// Tracks the connection state
export const connectedAtom = atom(false);

// Stores data for global modal popups
let content: ReactNode;

export const modalAtom = atom<ModalState>({
  active: false,
  title: "Title",
  body: content,
});

// tracks if there are unsaved changes for the current dolly
export const savedAtom = atom(true);
