import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { collection, getDocs, getDoc } from "firebase/firestore";
import { type BoardsProps } from "../interfaces/IBoard";
import { db } from "../config/firebaseConfig";
import { type TasksProps } from "../interfaces/ITasks";
import { useToast } from "@chakra-ui/react";

type OnDropCurrentItemProps = {
  id: string;
  listIndex: number;
};
export type BoardContextData = {
  boards: BoardsProps[];
  isLoading: boolean;
  setBoards: (boards: BoardsProps[]) => void;
  onDrop: (items: OnDropCurrentItemProps, targetBoardIndex: number) => void;
};

type BoardProviderProps = {
  children: ReactNode;
};

export const BoardContext = createContext({} as BoardContextData);

export const BoardProvider = ({
  children,
}: BoardProviderProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [boards, setBoards] = useState<BoardsProps[]>([]);

  const toast = useToast();

  const fetchBoards = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const data = await getDocs(collection(db, "boards"));
      const boards: BoardsProps[] = [];

      for (const boardDoc of data.docs) {
        const board = boardDoc.data();
        const tasksRefs = board.tasks;
        const tasksData: TasksProps[] = [];

        if (tasksRefs) {
          for (const taskRef of tasksRefs) {
            const taskSnapshot = await getDoc(taskRef);

            if (taskSnapshot.exists()) {
              tasksData.push(taskSnapshot.data() as TasksProps);
            }
          }
        }

        boards.push({
          ...board,
          tasks: tasksData,
        } as unknown as BoardsProps);
      }

      setBoards(boards);
    } catch {
      toast({
        title: "Falha ao buscar os quadros",
        description: "Houve um erro ao tentar buscar os dados. Tente novamente",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchBoards();
  }, [fetchBoards]);

  const onDrop = (
    item: OnDropCurrentItemProps,
    targetBoardIndex: number,
  ): void => {
    const currentBoard = boards[item.listIndex];
    const futureBoard = boards[targetBoardIndex];

    const taskIndex = currentBoard.tasks.findIndex(task => {
      return task.id === item.id;
    });

    if (taskIndex !== -1) {
      const taskToMove = currentBoard.tasks.splice(taskIndex, 1)[0];
      futureBoard.tasks.push(taskToMove);

      const updatedBoards = [...boards];

      setBoards(updatedBoards);
    }
  };

  return (
    <BoardContext.Provider value={{ setBoards, onDrop, boards, isLoading }}>
      {children}
    </BoardContext.Provider>
  );
};
