import React, { useState } from "react";
import { GrAdd } from "react-icons/gr";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { type BoardsProps } from "../../interfaces/IBoard";
import { Task } from "../Task";
import { useBoardDrop } from "../../hooks/useBoardDrop";
import { CreateTaskModal } from "../CreateTaskModal";

export const Board = ({
  id,
  boardIndex,
  name,
  tasks,
}: BoardsProps): JSX.Element => {
  const [openModalCreateTask, setOpenModalCreateTask] = useState(false);
  const { dropRef } = useBoardDrop(boardIndex);

  return (
    <>
      <Card w="400px">
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <Heading size="md">{name}</Heading>
            <IconButton
              colorScheme="gray"
              aria-label="Call Segun"
              size="sm"
              icon={<GrAdd />}
              onClick={() => {
                setOpenModalCreateTask(true);
              }}
            />
          </Flex>
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
                />
              </Box>
            );
          })}
        </CardBody>
      </Card>
      <CreateTaskModal
        idBoard={id}
        handleModal={setOpenModalCreateTask}
        isOpen={openModalCreateTask}
      />
    </>
  );
};
