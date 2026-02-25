import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils"; // Import atomWithStorage
import { DragEndEvent } from "@dnd-kit/core";
import { ColumnsState } from "../components/kanban/kanban.types";
import { moveTask, addTask, addColumn, updateColumnTitle, addComment, deleteColumn, clearColumnTasks } from "../utils/kanbanUtils";
import { columnsFromBackend } from "../constants/KanbanData";

export const columnsAtom = atomWithStorage<ColumnsState>("kanbanColumns", columnsFromBackend);
export const boardTitleAtom = atomWithStorage<string>("kanbanBoardTitle", "Demo Board");

export const moveTaskAtom = atom(null, (get, set, event: DragEndEvent) => {
  const currentState = get(columnsAtom);
  const nextState = moveTask(currentState, event);
  set(columnsAtom, nextState);
});

export const addTaskAtom = atom(
  null,
  (get, set, { columnId, content }: { columnId: string; content: string }) => {
    const currentState = get(columnsAtom);
    const nextState = addTask(currentState, columnId, content);
    set(columnsAtom, nextState);
  }
);

export const addColumnAtom = atom(
  null,
  (get, set, title: string) => {
    const currentState = get(columnsAtom);
    const nextState = addColumn(currentState, title);
    set(columnsAtom, nextState);
  }
);

export const updateColumnTitleAtom = atom(
    null,
    (get, set, { columnId, newTitle }: { columnId: string; newTitle: string }) => {
        const currentState = get(columnsAtom);
        const nextState = updateColumnTitle(currentState, columnId, newTitle);
        set(columnsAtom, nextState);
    }
);

export const addCommentAtom = atom(
    null,
    (get, set, { columnId, taskId, text }: { columnId: string; taskId: number; text: string }) => {
        const currentState = get(columnsAtom);
        const nextState = addComment(currentState, columnId, taskId, text);
        set(columnsAtom, nextState);
    }
);

export const deleteColumnAtom = atom(
  null,
  (get, set, columnId: string) => {
    const currentState = get(columnsAtom);
    const nextState = deleteColumn(currentState, columnId);
    set(columnsAtom, nextState);
  }
);

export const clearColumnTasksAtom = atom(
  null,
  (get, set, columnId: string) => {
    const currentState = get(columnsAtom);
    const nextState = clearColumnTasks(currentState, columnId);
    set(columnsAtom, nextState);
  }
);

export const resetBoardAtom = atom(
  null,
  (get, set) => {
    set(columnsAtom, columnsFromBackend);
    set(boardTitleAtom, "Demo Board");
  }
);
