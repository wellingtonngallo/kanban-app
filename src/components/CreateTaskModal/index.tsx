import React from "react";
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
import { useBoard } from "../../hooks/useBoard";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type TasksRequest } from "../../interfaces/ITasks";
import { Input } from "../Input";
import { TextArea } from "../TextArea";
import { db } from "../../config/firebaseConfig";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { type BoardsRequest } from "../../interfaces/IBoard";
import { useAuth } from "../../hooks/useAuth";

type CreateTaskModalProps = {
  handleModal: (isOpen: boolean) => void;
  isOpen: boolean;
  idBoard: string;
};
export const CreateTaskModal = ({
  handleModal,
  isOpen,
  idBoard,
}: CreateTaskModalProps): JSX.Element => {
  const toast = useToast();
  const { user } = useAuth();
  const { setBoards } = useBoard();
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<TasksRequest>();
  const closeModal = (): void => {
    handleModal(false);
  };

  const onSubmit: SubmitHandler<TasksRequest> = async (data: TasksRequest) => {
    try {
      const tasksCollection = collection(db, "tasks");
      const boardRef = doc(db, "boards", idBoard);
      const userRef = doc(db, "users", user.uid);
      const newTask = {
        ...data,
        author: userRef,
      };
      const newRegistrationRef = await addDoc(tasksCollection, newTask);
      const newRegistrationId = newRegistrationRef.id;

      await updateDoc(boardRef, {
        tasks: arrayUnion(doc(db, "tasks", newRegistrationId)),
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setBoards((prevBoards: BoardsRequest[]) => {
        const updatedBoards = prevBoards.map((prevBoard: BoardsRequest) => {
          if (prevBoard.id === idBoard) {
            return {
              ...prevBoard,
              tasks: [
                ...prevBoard.tasks,
                { ...newTask, id: newRegistrationId },
              ],
            };
          }
          return prevBoard;
        });

        return updatedBoards;
      });
      reset();
      closeModal();
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um erro ao tentar criar uma tarefa!",
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
        <ModalHeader>Criar tarefa</ModalHeader>
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
