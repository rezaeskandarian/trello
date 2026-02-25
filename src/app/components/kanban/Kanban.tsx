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

import { useAtomValue, useSetAtom } from "jotai";
import { columnsAtom, moveTaskAtom, addColumnAtom } from "../../atom/kanbanStore";
import styles from "./Kanban.module.scss";
import Column from "./Colomn";
import TaskCard from "./TaskCard";
import { Task } from "./kanban.types";

const Kanban = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const columns = useAtomValue(columnsAtom);
  const moveTask = useSetAtom(moveTaskAtom);
  const addColumn = useSetAtom(addColumnAtom);

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

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle);
      setNewColumnTitle("");
      setIsAddingColumn(false);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <section className={styles.container}>
        <div className={styles.columnsWrapper}>
          {Object.entries(columns).map(([columnId, column]) => (
            <Column key={columnId} columnId={columnId} column={column} />
          ))}

           {isAddingColumn ? (
            <div className={styles.addColumnForm}>
              <input
                type="text"
                className={styles.addColumnInput}
                placeholder="Enter list title..."
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn();
                }}
              />
              <div className={styles.addColumnActions}>
                <button
                  className={styles.addListButton}
                  onClick={handleAddColumn}
                >
                  Add List
                </button>
                <button
                  className={styles.cancelAddColumn}
                  onClick={() => setIsAddingColumn(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.addColumnContainer}>
            <button
              className={styles.addColumnButton}
              onClick={() => setIsAddingColumn(true)}
            >
              + Add another list
            </button>
            </div>
          )}
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
