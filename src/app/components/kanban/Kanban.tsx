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
import { columnsAtom, moveTaskAtom } from "../../atom/kanbanStore";
import styles from "./Kanban.module.scss";
import Column from "./Colomn";
import TaskCard from "./TaskCard";
import { Task } from "./kanban.types";

const Kanban = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const columns = useAtomValue(columnsAtom);
  const moveTask = useSetAtom(moveTaskAtom);

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

    const [columnId, taskId] = active.id.toString().split("-");
    const task =
      columns[columnId].items.find((t) => t.id === Number(taskId)) ?? null;

    setActiveTask(task);
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
