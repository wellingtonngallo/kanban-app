import React from "react";
import { Box, Center, Container, Flex, Spinner } from "@chakra-ui/react";
import { Board } from "../../components/Board";
import { useBoard } from "../../hooks/useBoard";

import { useSearch } from "../../hooks/useSearch";

export const Home = (): JSX.Element => {
  const { boards, isLoading } = useBoard();
  const { searchTask } = useSearch();

  const listTaskFiltered = boards.map(board => {
    const filteredTasks = board.tasks.filter(task =>
      task.name.toLowerCase().includes(searchTask),
    );

    return {
      ...board,
      tasks: filteredTasks,
    };
  });

  return (
    <Container maxWidth="100%" h="calc(100vh - 80px)" px={4} py={10}>
      {isLoading ? (
        <Center h="calc(100vh - 120px)">
          <Spinner size="xl" />
        </Center>
      ) : (
        <Flex overflow={"auto"} gap="1rem" h="100%">
          {listTaskFiltered.map((item, index) => {
            return (
              <Box w={500} h={"100%"} key={item.id}>
                <Board
                  id={item.id}
                  name={item.name}
                  tasks={item.tasks}
                  boardIndex={index}
                />
              </Box>
            );
          })}
        </Flex>
      )}
    </Container>
  );
};
