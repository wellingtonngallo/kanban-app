import { type ConnectDropTarget, useDrop } from "react-dnd";
import { useBoard } from "./useBoard";

type UseCardDragAndDropReturnType = {
  dropRef: ConnectDropTarget;
};

type DragItemProps = {
  id: string;
  index: number;
  listIndex: number;
};

export const useBoardDrop = (
  boardIndex: number,
): UseCardDragAndDropReturnType => {
  const { onDrop } = useBoard();

  const [, dropRef] = useDrop({
    accept: "TASK",
    hover: (dragItem: DragItemProps) => {
      if (dragItem.listIndex === boardIndex) {
        return;
      }

      onDrop(dragItem, boardIndex);

      dragItem.listIndex = boardIndex;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  return {
    dropRef,
  };
};
