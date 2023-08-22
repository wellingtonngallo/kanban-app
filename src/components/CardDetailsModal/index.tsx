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
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { db } from "../../config/firebaseConfig";
import { type BoardsProps } from "../../interfaces/IBoard";
import { type TasksProps } from "../../interfaces/ITasks";
import { Input } from "../Input";
import { TextArea } from "../TextArea";
import { useBoard } from "../../hooks/useBoard";

type CardDetailsModalProps = {
  handleModal: (isOpen: boolean) => void;
  isOpen: boolean;
  task: TasksProps;
};
export const CardDetailsModal = ({
  handleModal,
  isOpen,
  task,
}: CardDetailsModalProps): JSX.Element => {
  const { setBoards } = useBoard();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<TasksProps>();
  const closeModal = (): void => {
    handleModal(false);
  };

  useEffect(() => {
    reset(task);
  }, [reset, task]);

  const onSubmit: SubmitHandler<TasksProps> = async (
    data: TasksProps,
  ): Promise<void> => {
    try {
      const boardRef = doc(db, "tasks", task.id);

      const newData = {
        ...data,
        author: "Gallo",
      };
      await updateDoc(boardRef, newData);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setBoards((prevBoards: BoardsProps[]) => {
        const updatedBoards = prevBoards.map((prevBoard: BoardsProps) => {
          const newTasks = prevBoard.tasks.map(item => {
            if (item.id === task.id) {
              return data;
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
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Houve um erro ao tentar atualizar uma tarefa!",
        status: "error",
        duration: 9000,
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
            <Input id="name" label="Título" {...register("name")} />
            <TextArea
              id="description"
              label="Descrição"
              {...register("description")}
            />
            <Input
              id="author"
              label="Author"
              {...register("author")}
              isDisabled
            />
          </ModalBody>
          <ModalFooter display="flex" gap="0.5rem">
            <Button type="button" onClick={closeModal} variant="outline">
              Fechar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
