import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { type BoardsRequest } from "../interfaces/IBoard";
import { db } from "../config/firebaseConfig";
import { type TasksRequest } from "../interfaces/ITasks";
import { useToast } from "@chakra-ui/react";

type OnDropCurrentItemProps = {
  id: string;
  listIndex: number;
};
export type BoardContextData = {
  boards: BoardsRequest[];
  isLoading: boolean;
  setBoards: (boards: BoardsRequest[]) => void;
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
  const [boards, setBoards] = useState<BoardsRequest[]>([]);

  const toast = useToast();

  const fetchBoards = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const data = await getDocs(collection(db, "boards"));
      const boards: BoardsRequest[] = [];

      for (const boardDoc of data.docs) {
        const board = boardDoc.data();
        const tasksRefs = board.tasks;
        const tasksData: TasksRequest[] = [];
        const idDocumentBoad = boardDoc.id;

        if (tasksRefs) {
          for (const taskRef of tasksRefs) {
            const taskSnapshot = await getDoc(taskRef);

            if (taskSnapshot.exists()) {
              const documentTaskId = taskSnapshot.id;
              const taskData = taskSnapshot.data() as TasksRequest;

              const teste = {
                ...taskData,
                id: documentTaskId,
              };

              tasksData.push(teste as TasksRequest);
            }
          }
        }

        boards.push({
          ...board,
          id: idDocumentBoad,
          tasks: tasksData,
        } as unknown as BoardsRequest);
      }

      setBoards(boards);
    } catch {
      toast({
        title: "Falha ao buscar os quadros",
        description: "Houve um erro ao tentar buscar os dados. Tente novamente",
        status: "error",
        duration: 2000,
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

      void saveUpdateBoards(updatedBoards, taskToMove, currentBoard);
      setBoards(updatedBoards);
    }
  };

  const saveUpdateBoards = async (
    boards: BoardsRequest[],
    taskToMove: TasksRequest,
    oldBoard: BoardsRequest,
  ): Promise<void> => {
    try {
      const boardsCollection = collection(db, "boards");
      const batch = writeBatch(db);

      for (const updatedBoard of boards) {
        const boardRef = doc(boardsCollection, updatedBoard.id);

        const taskReferencesToAdd = updatedBoard.tasks.map(task =>
          doc(db, "tasks", task.id),
        );

        if (updatedBoard.id === oldBoard.id) {
          const updatedTaskReferences = updatedBoard.tasks
            .filter(task => task.id !== taskToMove.id)
            .map(task => doc(db, "tasks", task.id));

          batch.update(boardRef, {
            tasks: updatedTaskReferences,
          });
        } else {
          batch.update(boardRef, {
            tasks: arrayUnion(...taskReferencesToAdd),
          });
        }
      }

      await batch.commit();
    } catch (e) {
      toast({
        title: "Falha ao atualizar os quadros",
        description:
          "Houve um erro ao tentar atualizar os dados. Tente novamente",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <BoardContext.Provider value={{ setBoards, onDrop, boards, isLoading }}>
      {children}
    </BoardContext.Provider>
  );
};
