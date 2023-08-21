import { Card, CardBody, Heading } from "@chakra-ui/react";
import React, { useState } from "react";
import { type TasksProps } from "../../interfaces/ITasks";
import { CardDetailsModal } from "../CardDetailsModal";
import { useCardDragAndDrop } from "../../hooks/useCardDragAndDrop";

export const Task = ({
  id,
  name,
  author,
  description,
  index,
  deadline,
  listIndex,
}: TasksProps): JSX.Element => {
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const { ref, isDragging } = useCardDragAndDrop(index, listIndex, id);

  const openModal = (): void => {
    setOpenModalDetails(true);
  };

  return (
    <>
      <Card
        key={name}
        ref={ref}
        opacity={isDragging ? "0.5" : ""}
        cursor="grabbing"
        onClick={openModal}
      >
        <CardBody h={200}>
          <Heading size="xs" textTransform="uppercase">
            {name}
          </Heading>
        </CardBody>
      </Card>
      <CardDetailsModal
        isOpen={openModalDetails}
        handleModal={setOpenModalDetails}
        task={{ name, description, deadline, author } as TasksProps}
      />
    </>
  );
};
