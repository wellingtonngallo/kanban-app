import { useContext } from "react";
import {
  SearchContext,
  type SearchContextData,
} from "../context/SearchContext";

export const useSearch = (): SearchContextData => {
  const context = useContext(SearchContext);

  return context;
};
