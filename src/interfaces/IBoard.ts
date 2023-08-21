import { type TasksProps } from "./ITasks";

export type BoardsProps = {
  id: string;
  name: string;
  tasks: TasksProps[];
  boardIndex: number;
};
