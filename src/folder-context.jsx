import React, { createContext } from 'react';

export const FolderContext = createContext({});
export const ListContext = createContext({});

export function FolderProvider({ children, folder, url }) {
  return <FolderContext.Provider value={{folder, url}}>{children}</FolderContext.Provider>;
}

export function ListProvider({ children, mutate }) {
  return <ListContext.Provider value={{mutate}}>{children}</ListContext.Provider>;
}
