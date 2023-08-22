import { Box, Flex, IconButton, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { type TasksProps } from "../../interfaces/ITasks";
import { CardDetailsModal } from "../CardDetailsModal";
import { useCardDragAndDrop } from "../../hooks/useCardDragAndDrop";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useBoard } from "../../hooks/useBoard";
import { type BoardsProps } from "../../interfaces/IBoard";
import { MdDelete, MdEdit } from "react-icons/md";

export const Task = ({
  id,
  name,
  author,
  description,
  index,

  listIndex,
}: TasksProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [openModalDetails, setOpenModalDetails] = useState(false);

  const { ref, isDragging } = useCardDragAndDrop(index, listIndex, id);
  const { setBoards } = useBoard();
  const toast = useToast();

  const openModal = (): void => {
    setOpenModalDetails(true);
  };

  const removeTask = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      const documentRef = doc(db, "tasks", id);
      await deleteDoc(documentRef);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setBoards((prevBoards: BoardsProps[]) => {
        const updatedBoards = prevBoards.map((prevBoard: BoardsProps) => {
          const newTasks = prevBoard.tasks.filter(item => item.id !== id);

          return {
            ...prevBoard,
            tasks: newTasks,
          };
        });

        return updatedBoards;
      });

      toast({
        title: "Sucesso",
        description: "Tarefa removida com sucesso!",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um erro ao tentar remover uma tarefa!",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Flex
        key={name}
        ref={ref}
        opacity={isDragging ? "0.5" : ""}
        cursor="grabbing"
        borderWidth="1px"
        borderRadius="lg"
        p={"1rem"}
        justifyContent="space-between"
        gap="0.5rem"
      >
        <Box>
          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            noOfLines={1}
          >
            {name}
          </Box>
          <Box as="span" color="gray.600" fontSize="sm" noOfLines={2}>
            {description}
          </Box>
        </Box>
        <Flex gap="0.5rem" alignItems="center">
          <IconButton
            colorScheme="gray"
            aria-label="Deleta tarefa"
            size="md"
            icon={<MdEdit />}
            onClick={() => {
              openModal();
            }}
          />
          <IconButton
            colorScheme="gray"
            aria-label="Deleta tarefa"
            size="md"
            icon={<MdDelete />}
            isLoading={isLoading}
            onClick={() => {
              removeTask(id);
            }}
          />
        </Flex>
      </Flex>
      <CardDetailsModal
        isOpen={openModalDetails}
        handleModal={setOpenModalDetails}
        task={{ name, description, author, id } as TasksProps}
      />
    </>
  );
};
