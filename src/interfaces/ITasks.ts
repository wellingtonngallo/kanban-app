import { type DocumentReference } from "firebase/firestore";

export type TasksRequest = {
  id: string;
  author: DocumentReference;
  isBlocked: boolean;
  description: string;
  name: string;
  index: number;
  listIndex: number;
};

export type TaskProps = {
  taskId: string;
  taskPositionArray: number;
  currentPositionBoardWhereTaskIs: number;
  name: string;
  author: DocumentReference;
  isBlocked: boolean;
  description: string;
};
