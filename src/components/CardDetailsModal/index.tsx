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
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import { type TasksProps } from "../../interfaces/ITasks";
import { Input } from "../Input";
import { TextArea } from "../TextArea";

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
  const { handleSubmit, register, reset } = useForm<TasksProps>();
  const closeModal = (): void => {
    handleModal(false);
  };

  useEffect(() => {
    reset(task);
  }, [reset, task]);

  const onSubmit: SubmitHandler<TasksProps> = (data: FieldValues): void => {
    console.log(data);
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
            <Button type="submit">Salvar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
