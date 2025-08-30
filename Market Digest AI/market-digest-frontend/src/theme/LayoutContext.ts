import { createContext } from 'react';

export const LayoutContext = createContext<{ sidebarOpen: boolean; toggleSidebar: () => void }>(
  { sidebarOpen: true, toggleSidebar: () => {} }
);

