import { DragEndEvent } from "@dnd-kit/core";
import type { ColumnsState } from "../components/Kanban/kanban.types";
import { arrayMove } from "@dnd-kit/sortable";

/**
 * DnD ID format used in this app:
 * - Task:   "{columnId}-{taskId}"
 * - Column: "{columnId}"
 */

type TaskLocation = { columnId: string; taskId: number };

type DropLocation =
  | { type: "column"; columnId: string }
  | { type: "task"; columnId: string; taskId: number };

const parseTaskLocation = (
  state: ColumnsState,
  id: string,
): TaskLocation | null => {
  // columnId can contain dashes, so we match by checking every column prefix.
  for (const columnId in state) {
    const prefix = `${columnId}-`;
    if (!id.startsWith(prefix)) continue;

    const taskId = Number(id.slice(prefix.length));

    // Keep previous behavior: if we matched a column prefix but taskId isn't a number, bail out.
    if (Number.isNaN(taskId)) return null;

    return { columnId, taskId };
  }

  return null;
};

const getDropLocation = (state: ColumnsState, overId: string): DropLocation | null => {
  // Dropped on the empty area of a column.
  if (overId in state) return { type: "column", columnId: overId };

  const task = parseTaskLocation(state, overId);
  if (!task) return null;

  return { type: "task", columnId: task.columnId, taskId: task.taskId };
};

const findTaskIndex = (state: ColumnsState, columnId: string, taskId: number) => {
  return state[columnId].items.findIndex((t) => t.id === taskId);
};

const resolveInsertIndex = (
  state: ColumnsState,
  drop: DropLocation,
): number => {
  const items = state[drop.columnId].items;

  if (drop.type === "column") return items.length;

  const index = findTaskIndex(state, drop.columnId, drop.taskId);
  return index === -1 ? items.length : index;
};

export const moveTask = (state: ColumnsState, event: DragEndEvent): ColumnsState => {
  const { active, over } = event;
  if (!over) return state;

  const source = parseTaskLocation(state, active.id.toString());
  if (!source) return state;

  const drop = getDropLocation(state, over.id.toString());
  if (!drop) return state;

  const fromColumnId = source.columnId;
  const toColumnId = drop.columnId;

  const fromItems = state[fromColumnId].items;
  const toItems = state[toColumnId].items;

  const fromIndex = findTaskIndex(state, fromColumnId, source.taskId);
  if (fromIndex === -1) return state;

  const toIndex = resolveInsertIndex(state, drop);

  // 1) Move inside the same column (reorder)
  if (fromColumnId === toColumnId) {
    return {
      ...state,
      [fromColumnId]: {
        ...state[fromColumnId],
        items: arrayMove(fromItems, fromIndex, toIndex),
      },
    };
  }

  // 2) Move between columns
  const nextFromItems = [...fromItems];
  const [movedTask] = nextFromItems.splice(fromIndex, 1);

  const nextToItems = [...toItems];
  nextToItems.splice(toIndex, 0, movedTask);

  return {
    ...state,
    [fromColumnId]: { ...state[fromColumnId], items: nextFromItems },
    [toColumnId]: { ...state[toColumnId], items: nextToItems },
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
