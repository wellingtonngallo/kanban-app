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
import React from "react";
import { useBoard } from "../../hooks/useBoard";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type TasksProps } from "../../interfaces/ITasks";
import { Input } from "../Input";
import { TextArea } from "../TextArea";
import { db } from "../../config/firebaseConfig";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { type BoardsProps } from "../../interfaces/IBoard";

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
  const { setBoards } = useBoard();
  const { handleSubmit, register, reset } = useForm<TasksProps>();
  const closeModal = (): void => {
    handleModal(false);
  };

  const onSubmit: SubmitHandler<TasksProps> = async (data: TasksProps) => {
    try {
      let idDocumentBoard;
      const tasksCollection = collection(db, "tasks");
      const querySnapshot = await getDocs(collection(db, "boards"));

      querySnapshot.forEach(doc => {
        const dataBoard = doc.data();

        if (!dataBoard) return;

        if (dataBoard.id === idBoard) {
          idDocumentBoard = doc.id;
        }
      });

      if (idDocumentBoard) {
        const boardRef = doc(db, "boards", idDocumentBoard);

        const newRegistrationRef = await addDoc(tasksCollection, data);
        const newRegistrationId = newRegistrationRef.id;

        await updateDoc(boardRef, {
          tasks: arrayUnion(doc(db, "tasks", newRegistrationId)),
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setBoards((prevBoards: BoardsProps[]) => {
          const updatedBoards = prevBoards.map((prevBoard: BoardsProps) => {
            if (prevBoard.id === idBoard) {
              return {
                ...prevBoard,
                tasks: [...prevBoard.tasks, { ...data, id: newRegistrationId }],
              };
            }
            return prevBoard;
          });

          console.log(updatedBoards);

          return updatedBoards;
        });
        reset();
        closeModal();
        toast({
          title: "Sucesso",
          description: "Tarefa criada com sucesso!",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um erro ao tentar criar uma tarefa!",
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
            <Button type="submit">Salvar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
