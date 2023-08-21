import { useContext } from "react";
import { BoardContext, type BoardContextData } from "../context/BoardContext";

export const useBoard = (): BoardContextData => {
  const context = useContext(BoardContext);

  return context;
};
