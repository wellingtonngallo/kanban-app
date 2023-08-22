import { type RefObject, useRef } from "react";
import { useDrag, useDrop, type XYCoord } from "react-dnd";
import { useBoard } from "./useBoard";
import { useAuth } from "./useAuth";

type UseCardDragAndDropReturnType = {
  ref: RefObject<HTMLDivElement>;
  isDragging: boolean;
};

type DropItemProps = {
  listIndex: number;
  index: number;
};

export const useCardDragAndDrop = (
  index: number,
  listIndex: number,
  id: string,
  isTaskBlocked: boolean,
  uidAuthor: string,
): UseCardDragAndDropReturnType => {
  const { onDrop } = useBoard();
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    item: { index, listIndex, id, isTaskBlocked, uidAuthor },
    type: "TASK",
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: "TASK",
    hover(item: DropItemProps, monitor) {
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      const draggedIndex = item.index;
      const targetIndex = index;

      if (isTaskBlocked && user.uid !== uidAuthor) return;

      if (
        draggedIndex === targetIndex &&
        draggedListIndex === targetListIndex
      ) {
        return;
      }

      const draggedOffset: XYCoord | null = monitor.getClientOffset();

      if (ref.current && draggedOffset) {
        const targetSize = ref.current.getBoundingClientRect();
        const targetCenter = (targetSize.bottom - targetSize.top) / 2;

        const draggedTop = draggedOffset.y - targetSize.top;

        if (draggedIndex < targetIndex && draggedTop < targetCenter) {
          return;
        }

        if (draggedIndex > targetIndex && draggedTop > targetCenter) {
          return;
        }
      }

      onDrop({ listIndex: draggedListIndex, id }, listIndex);

      item.index = targetIndex;
      item.listIndex = targetListIndex;
    },
  });

  dragRef(dropRef(ref));

  return {
    ref,
    isDragging,
  };
};
