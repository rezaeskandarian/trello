import { atom } from "jotai";
import { DragEndEvent } from "@dnd-kit/core";
import { ColumnsState } from "../components/kanban/kanban.types";
import { moveTask, addTask, addColumn, updateColumnTitle } from "../utils/kanbanUtils";
import { columnsFromBackend } from "../constants/KanbanData";

export const columnsAtom = atom<ColumnsState>(columnsFromBackend);

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
