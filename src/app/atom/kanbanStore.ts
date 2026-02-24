import { atom } from "jotai";
import { DragEndEvent } from "@dnd-kit/core";
import { ColumnsState } from "../components/kanban/kanban.types";
import { moveTask } from "../utils/kanbanUtils";
import { columnsFromBackend } from "../constants/KanbanData";

export const columnsAtom = atom<ColumnsState>(columnsFromBackend);

export const moveTaskAtom = atom(null, (get, set, event: DragEndEvent) => {
  const currentState = get(columnsAtom);
  const nextState = moveTask(currentState, event);
  set(columnsAtom, nextState);
});