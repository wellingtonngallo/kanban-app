import React, { useEffect } from "react";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Image,
  Flex,
  Text,
  Badge,
  Switch,
  FormLabel,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { type SubmitHandler, useForm } from "react-hook-form";
import { db } from "../../config/firebaseConfig";
import { type BoardsRequest } from "../../interfaces/IBoard";
import { type TaskProps, type TasksRequest } from "../../interfaces/ITasks";
import { Input } from "../Input";
import { TextArea } from "../TextArea";
import { useBoard } from "../../hooks/useBoard";
import { useAuth } from "../../hooks/useAuth";

type CardDetailsModalProps = {
  handleModal: (isOpen: boolean) => void;
  isOpen: boolean;
  task: TaskProps;
  authorInfo: any;
};

export const CardDetailsModal = ({
  handleModal,
  isOpen,
  task,
  authorInfo,
}: CardDetailsModalProps): JSX.Element => {
  const { taskId, isBlocked } = task;
  const { setBoards } = useBoard();

  const { user } = useAuth();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<TasksRequest>();
  const closeModal = (): void => {
    handleModal(false);
  };

  useEffect(() => {
    reset(task);
  }, [reset, task]);

  const onSubmit: SubmitHandler<TasksRequest> = async (
    data: TasksRequest,
  ): Promise<void> => {
    try {
      const boardRef = doc(db, "tasks", taskId);
      const userRef = doc(db, "users", authorInfo.uid);

      const newData = {
        ...data,
        author: userRef,
      };
      await updateDoc(boardRef, newData);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setBoards((prevBoards: BoardsRequest[]) => {
        const updatedBoards = prevBoards.map((prevBoard: BoardsRequest) => {
          const newTasks = prevBoard.tasks.map(item => {
            if (item.id === taskId) {
              return newData;
            }

            return item;
          });

          return {
            ...prevBoard,
            tasks: newTasks,
          };
        });

        return updatedBoards;
      });

      reset();
      closeModal();
      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Houve um erro ao tentar atualizar uma tarefa!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Modal onClose={closeModal} size={"xl"} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalhes da tarefa</ModalHeader>
        <Divider />
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody display="flex" flexDir="column" gap="0.5rem">
            <Input
              id="name"
              label="Título"
              {...register("name")}
              isDisabled={isBlocked}
            />
            <TextArea
              id="description"
              label="Descrição"
              {...register("description")}
              isDisabled={isBlocked}
            />
            {authorInfo.uid === user.uid && (
              <Flex>
                <FormLabel htmlFor="blocked">Tarefa bloqueada</FormLabel>
                <Switch id="blocked" {...register("blocked")} />
              </Flex>
            )}
            <Flex
              alignItems="center"
              gap="0.5rem"
              justifyContent="flex-end"
              mt="1rem"
            >
              <Image
                borderRadius="full"
                boxSize="40px"
                src={authorInfo.photoUrl}
                alt={authorInfo.displayName}
              />
              <Text fontSize="sm" fontWeight="bold">
                {authorInfo.displayName}
              </Text>
              <Badge>Owner</Badge>
            </Flex>
          </ModalBody>
          <ModalFooter display="flex" gap="0.5rem">
            <Button type="button" onClick={closeModal} variant="outline">
              Fechar
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              isDisabled={isBlocked && authorInfo.uid !== user.uid}
            >
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
