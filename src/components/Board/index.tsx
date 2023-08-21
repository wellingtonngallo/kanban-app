import React from "react";
import { Box, Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import { type BoardsProps } from "../../interfaces/IBoard";
import { Task } from "../Task";
import { useBoardDrop } from "../../hooks/useBoardDrop";

export const Board = ({
  boardIndex,
  name,
  tasks,
}: BoardsProps): JSX.Element => {
  const { dropRef } = useBoardDrop(boardIndex);

  return (
    <Card w="400px" bg="#EDF2F7">
      <CardHeader>
        <Heading size="md">{name}</Heading>
      </CardHeader>
      <CardBody ref={dropRef}>
        {tasks.map((task, index) => {
          return (
            <Box mt="0.5rem" key={task.id}>
              <Task
                id={task.id}
                index={index}
                description={task.description}
                listIndex={boardIndex}
                name={task.name}
                author={task.author}
                deadline={task.deadline}
              />
            </Box>
          );
        })}
      </CardBody>
    </Card>
  );
};
