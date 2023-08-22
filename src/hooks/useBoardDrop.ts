import { type ConnectDropTarget, useDrop } from "react-dnd";
import { useBoard } from "./useBoard";
import { useAuth } from "./useAuth";

type UseCardDragAndDropReturnType = {
  dropRef: ConnectDropTarget;
};

type DragItemProps = {
  id: string;
  index: number;
  listIndex: number;
  isTaskBlocked: boolean;
  uidAuthor: string;
};

export const useBoardDrop = (
  boardIndex: number,
): UseCardDragAndDropReturnType => {
  const { user } = useAuth();
  const { onDrop } = useBoard();

  const [, dropRef] = useDrop({
    accept: "TASK",
    hover: (dragItem: DragItemProps) => {
      if (dragItem.listIndex === boardIndex) {
        return;
      }

      if (dragItem.isTaskBlocked && user.uid !== dragItem.uidAuthor) {
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
