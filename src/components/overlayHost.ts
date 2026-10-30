import { createContext } from 'react';

// On web, the phone mockup registers its screen element here so sheets and menus
// render inside the phone instead of over the whole browser window.
export const OverlayHostContext = createContext<HTMLElement | null>(null);
