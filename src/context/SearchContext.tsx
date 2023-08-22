import React, { createContext, useState, type ReactNode } from "react";

export type SearchContextData = {
  searchTask: string;
  setSearchTask: (task: string) => void;
};

type SearchProviderProps = {
  children: ReactNode;
};

export const SearchContext = createContext({} as SearchContextData);

export const SearchProvider = ({
  children,
}: SearchProviderProps): JSX.Element => {
  const [searchTask, setSearchTask] = useState("");

  return (
    <SearchContext.Provider value={{ setSearchTask, searchTask }}>
      {children}
    </SearchContext.Provider>
  );
};
