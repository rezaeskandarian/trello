import { DragEndEvent } from "@dnd-kit/core";
import type { ColumnsState } from "../components/kanban/kanban.types";
import { arrayMove } from "@dnd-kit/sortable";

export const moveTask = (
  state: ColumnsState,
  event: DragEndEvent,
): ColumnsState => {
  const { active, over } = event;
  if (!over) return state;

  const activeId = active.id.toString();
  const overId = over.id.toString();

  let sourceColumnId = "";
  let sourceTaskId = -1;

  for (const colId in state) {
    if (activeId.startsWith(`${colId}-`)) {
      const remainder = activeId.slice(colId.length + 1);
      if (!Number.isNaN(Number(remainder))) {
        sourceColumnId = colId;
        sourceTaskId = Number(remainder);
        break;
      }
    }
  }

  if (!sourceColumnId) return state;

  let destColumnId = "";
  let isOverColumn = false;
  let overTaskId = -1;

  if (overId in state) {
    destColumnId = overId;
    isOverColumn = true;
  } else {
    for (const colId in state) {
      if (overId.startsWith(`${colId}-`)) {
        const remainder = overId.slice(colId.length + 1);
        if (!isNaN(Number(remainder))) {
          destColumnId = colId;
          overTaskId = Number(remainder);
          break;
        }
      }
    }
  }

  if (!destColumnId) return state;

  const sourceCol = state[sourceColumnId];
  const destCol = state[destColumnId];

  const sourceIndex = sourceCol.items.findIndex((t) => t.id === sourceTaskId);

  let destIndex = -1;

  if (isOverColumn) {
    destIndex = destCol.items.length;
  } else {
    destIndex = destCol.items.findIndex((t) => t.id === overTaskId);
  }

  if (sourceIndex === -1) return state;
  if (destIndex === -1) destIndex = destCol.items.length;

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

export const addTask = (
  state: ColumnsState,
  columnId: string,
  content: string,
): ColumnsState => {
  const column = state[columnId];
  if (!column) return state;

  const newTask = {
    id: Date.now(),
    Task: content,
    Due_Date: new Date().toISOString(),
  };

  return {
    ...state,
    [columnId]: {
      ...column,
      items: [...column.items, newTask],
    },
  };
};

export const addColumn = (state: ColumnsState, title: string): ColumnsState => {
  const newColumnId = `col-${Date.now()}`;
  return {
    ...state,
    [newColumnId]: {
      title,
      items: [],
    },
  };
};

export const updateColumnTitle = (
  state: ColumnsState,
  columnId: string,
  newTitle: string,
): ColumnsState => {
  const column = state[columnId];
  if (!column) return state;

  return {
    ...state,
    [columnId]: {
      ...column,
      title: newTitle,
    },
  };
};

export const addComment = (
  state: ColumnsState,
  columnId: string,
  taskId: number,
  text: string,
): ColumnsState => {
  const column = state[columnId];
  if (!column) return state;

  const taskIndex = column.items.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return state;

  const task = column.items[taskIndex];
  const newComment = {
    id: Date.now(),
    text,
    timestamp: new Date().toISOString(),
  };

  const updatedTask = {
    ...task,
    comments: [...(task.comments || []), newComment],
  };

  const newItems = [...column.items];
  newItems[taskIndex] = updatedTask;

  return {
    ...state,
    [columnId]: {
      ...column,
      items: newItems,
    },
  };
};

export const deleteColumn = (
  state: ColumnsState,
  columnId: string,
): ColumnsState => {
  const newState = { ...state };
  delete newState[columnId];
  return newState;
};

export const clearColumnTasks = (
  state: ColumnsState,
  columnId: string,
): ColumnsState => {
  const column = state[columnId];
  if (!column) return state;

  return {
    ...state,
    [columnId]: {
      ...column,
      items: [],
    },
  };
};
