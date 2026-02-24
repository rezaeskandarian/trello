import { DragEndEvent } from "@dnd-kit/core";
import { ColumnsState } from "../components/kanban/kanban.types";
import { arrayMove } from "@dnd-kit/sortable";

export const moveTask = (
  state: ColumnsState,
  event: DragEndEvent
): ColumnsState => {
  const { active, over } = event;
  if (!over) return state;

  const activeParts = active.id.toString().split("-");
  const sourceColumnId = activeParts[0];
  const sourceTaskId = Number(activeParts[1]);

  const overParts = over.id.toString().split("-");
  const destColumnId = overParts[0];

  const sourceCol = state[sourceColumnId];
  const destCol = state[destColumnId];

  if (!sourceCol || !destCol) return state;

  const sourceIndex = sourceCol.items.findIndex((t) => t.id === sourceTaskId);

  const destIndex =
    overParts.length === 2
      ? destCol.items.findIndex((t) => t.id === Number(overParts[1]))
      : destCol.items.length; // 👈 اگر ستون خالی بود

  if (sourceColumnId === destColumnId) {
    const reordered = arrayMove(sourceCol.items, sourceIndex, destIndex);

    return {
      ...state,
      [sourceColumnId]: {
        ...sourceCol,
        items: reordered,
      },
    };
  }

  const sourceItems = [...sourceCol.items];
  const destItems = [...destCol.items];

  const [moved] = sourceItems.splice(sourceIndex, 1);
  destItems.splice(destIndex, 0, moved);

  return {
    ...state,
    [sourceColumnId]: { ...sourceCol, items: sourceItems },
    [destColumnId]: { ...destCol, items: destItems },
  };
};
