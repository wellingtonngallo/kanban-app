import React, { useEffect, useState, useCallback } from "react";
import { Box, Flex, IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { type TaskProps } from "../../interfaces/ITasks";
import { CardDetailsModal } from "../CardDetailsModal";
import { useCardDragAndDrop } from "../../hooks/useCardDragAndDrop";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useBoard } from "../../hooks/useBoard";
import { type BoardsRequest } from "../../interfaces/IBoard";

type AuthorProps = {
  displayName: string;
  photoUrl: string;
  uid: string;
};

export const Task = ({
  taskId,
  name,
  author,
  description,
  taskPositionArray,
  currentPositionBoardWhereTaskIs,
  isBlocked,
}: TaskProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const [authorInfo, setAuthorInfo] = useState<AuthorProps>({} as AuthorProps);
  const { ref, isDragging } = useCardDragAndDrop(
    taskPositionArray,
    currentPositionBoardWhereTaskIs,
    taskId,
    isBlocked,
    authorInfo.uid,
  );
  const { setBoards } = useBoard();
  const toast = useToast();

  const getInfoAuthor = useCallback(async (): Promise<void> => {
    try {
      const getDataAuthor = await getDoc(author);
      if (getDataAuthor.exists()) {
        const authorData = getDataAuthor.data();
        const formattedAuthorData = {
          displayName: authorData.displayName,
          photoUrl: authorData.photoUrl,
          uid: authorData.uid,
        };

        setAuthorInfo(formattedAuthorData);
      }
    } catch (e) {
      toast({
        title: "Erro",
        description: "Houve um erro ao buscar os dados do autor da tarefa!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  }, [author, toast]);

  useEffect(() => {
    getInfoAuthor();
  }, [getInfoAuthor]);

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
      setBoards((prevBoards: BoardsRequest[]) => {
        const updatedBoards = prevBoards.map((prevBoard: BoardsRequest) => {
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
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um erro ao tentar remover uma tarefa!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Tooltip
        label={
          isBlocked ? "O item só pode ser movido ou alterado pelo autor" : ""
        }
      >
        <Flex
          key={name}
          ref={ref}
          opacity={isDragging || isBlocked ? "0.5" : ""}
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
            <Tooltip label={"Editar tarefa"}>
              <IconButton
                colorScheme="gray"
                aria-label="Deleta tarefa"
                size="md"
                icon={<MdEdit />}
                isDisabled={isBlocked}
                onClick={() => {
                  openModal();
                }}
              />
            </Tooltip>
            <Tooltip label={"Excluir tarefa"}>
              <IconButton
                colorScheme="gray"
                aria-label="Deleta tarefa"
                size="md"
                icon={<MdDelete />}
                isLoading={isLoading}
                isDisabled={isBlocked}
                onClick={() => {
                  removeTask(taskId);
                }}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Tooltip>
      <CardDetailsModal
        isOpen={openModalDetails}
        handleModal={setOpenModalDetails}
        task={{ name, description, taskId, isBlocked } as TaskProps}
        authorInfo={authorInfo}
      />
    </>
  );
};
