import { type TasksRequest } from "./ITasks";

export type BoardsRequest = {
  id: string;
  name: string;
  tasks: TasksRequest[];
  boardIndex: number;
};
