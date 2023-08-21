import { type Timestamp } from "firebase/firestore";

export type TasksProps = {
  id: string;
  author: string;
  deadline: Timestamp;
  description: string;
  name: string;
  index: number;
  listIndex: number;
};
