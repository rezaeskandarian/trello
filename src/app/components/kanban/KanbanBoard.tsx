"use client";
import { useState } from "react";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  columnsAtom,
  moveTaskAtom,
  addColumnAtom,
  boardTitleAtom,
  resetBoardAtom,
} from "../../atom/kanbanStore";
import styles from "./Kanban.module.scss";
import Column from "../Column/Colomn";
import TaskCard from "../TaskCard/TaskCard";
import type { Task } from "./kanban.types";
import EditableTitle from "../EditableTitle";
import AddListForm from "../Column/AddListForm";
import { findTaskByDraggableId } from "@/src/app/utils/findTaskByDraggableIdUtils";

const KanbanBoard = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const columns = useAtomValue(columnsAtom);
  const moveTask = useSetAtom(moveTaskAtom);
  const addColumn = useSetAtom(addColumnAtom);

  const [boardTitle, setBoardTitle] = useAtom(boardTitleAtom);
  const resetBoard = useSetAtom(resetBoardAtom);

  const handleDragEnd = (event: DragEndEvent) => {
    moveTask(event);
    setActiveTask(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = findTaskByDraggableId(columns, event.active.id.toString());
    setActiveTask(task);
  };

  const handleAddColumn = (title: string) => {
    addColumn(title);
  };

  const handleBoardTitleSave = (newTitle: string) => {
    setBoardTitle(newTitle);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <section className={styles.container}>
        <div className={styles.boardHeader}>
          <div className={styles.titleContainer}>
            <div className={styles.boardTitleWrapper}>
              <EditableTitle
                title={boardTitle}
                onSave={handleBoardTitleSave}
                titleClassName={styles.boardTitle}
                inputClassName={styles.boardTitleInput}
              />
            </div>
            <button
              type="button"
              className={styles.resetButton}
              onClick={resetBoard}
            >
              Reset All Fields
            </button>
          </div>
        </div>
        <div className={styles.columnsWrapper}>
          {Object.entries(columns).map(([columnId, column]) => (
            <Column key={columnId} columnId={columnId} column={column} />
          ))}

          <AddListForm onAdd={handleAddColumn} />
        </div>
      </section>
      <DragOverlay>
        {activeTask && (
          <div className={styles.dragOverlay}>
            <TaskCard task={activeTask} columnId="overlay" />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
