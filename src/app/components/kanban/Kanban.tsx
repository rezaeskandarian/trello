"use client";
import { useState } from "react";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { columnsAtom, moveTaskAtom, addColumnAtom, boardTitleAtom, resetBoardAtom } from "../../atom/kanbanStore";
import styles from "./Kanban.module.scss";
import Column from "./Colomn";
import TaskCard from "./TaskCard";
import { Task } from "./kanban.types";
import EditableTitle from "./EditableTitle";
import AddListForm from "./AddListForm";

const Kanban = () => {
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
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id.toString();

    let foundTask: Task | null = null;

    for (const colId in columns) {
      if (activeId.startsWith(`${colId}-`)) {
        const remaining = activeId.slice(colId.length + 1);
        if (!isNaN(Number(remaining))) {
            const taskId = Number(remaining);
            const task = columns[colId].items.find((t) => t.id === taskId);
            if (task) {
                foundTask = task;
                break;
            }
        }
      }
    }

    setActiveTask(foundTask);
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
                isBoardTitle={true}
                onSave={handleBoardTitleSave}
                titleClassName={styles.boardTitle}
                inputClassName={styles.boardTitleInput}
             />
            </div>
            <button className={styles.resetButton} onClick={resetBoard}>
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
        {activeTask ? (
          <div className={styles.dragOverlay}>
            <TaskCard task={activeTask} columnId="overlay" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Kanban;
