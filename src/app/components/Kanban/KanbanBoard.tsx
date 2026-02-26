"use client";
import { useCallback } from "react";
import type { DragEndEvent } from "@dnd-kit/core";

import { DndContext, DragOverlay } from "@dnd-kit/core";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  columnsAtom,
  moveTaskAtom,
  addColumnAtom,
  boardTitleAtom,
  resetBoardAtom,
} from "../../atom/kanbanStore";
import styles from "./Kanban.module.scss";
import Column from "../Column/Column";
import TaskCard from "../TaskCard/TaskCard";
import EditableTitle from "../EditableTitle";
import AddListForm from "../Column/AddListForm";
import { useKanbanDnd } from "../../hooks/useKanbanDnd";
import {Button} from "@/src/app/components/ui";

const KanbanBoard = () => {
  const columns = useAtomValue(columnsAtom);
  const moveTask = useSetAtom(moveTaskAtom);
  const addColumn = useSetAtom(addColumnAtom);

  const [boardTitle, setBoardTitle] = useAtom(boardTitleAtom);
  const resetBoard = useSetAtom(resetBoardAtom);

  const onMoveTask = useCallback(
    (event: DragEndEvent) => {
      moveTask(event);
    },
    [moveTask],
  );

  const { sensors, collisionDetection, activeTask, onDragStart, onDragEnd } =
    useKanbanDnd({
      columns,
      onMoveTask,
    });

  const handleAddColumn = (title: string) => {
    addColumn(title);
  };

  const handleBoardTitleSave = (newTitle: string) => {
    setBoardTitle(newTitle);
  };

  return (
    <DndContext
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <section className={styles.container} aria-label="Kanban board">
        <header className={styles.boardHeader}>
          <div className={styles.titleContainer}>
            <div className={styles.boardTitleWrapper}>
              <EditableTitle
                title={boardTitle}
                onSave={handleBoardTitleSave}
                titleClassName={styles.boardTitle}
                inputClassName={styles.boardTitleInput}
              />
            </div>
            <Button
              type="button"
              className={styles.resetButton}
              onClick={resetBoard}
            >
              Reset All Fields
            </Button>
          </div>
        </header>

        <main className={styles.columnsWrapper} aria-label="Columns">
          <ul className={styles.columnsList} role="list">
            {Object.entries(columns).map(([columnId, column]) => (
              <li key={columnId} className={styles.columnListItem}>
                <Column columnId={columnId} column={column} />
              </li>
            ))}
            <li className={styles.columnListItem}>
              <AddListForm onAdd={handleAddColumn} />
            </li>
          </ul>
        </main>
      </section>

      <DragOverlay>
        {activeTask && (
          <div className={styles.dragOverlay} aria-label="Dragging task preview">
            <TaskCard task={activeTask} columnId="overlay" />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
