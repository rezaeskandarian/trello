import type { ColumnsState, Task } from "@/src/app/components/Kanban/kanban.types";

export function findTaskByDraggableId(
  columns: ColumnsState,
  draggableId: string,
): Task | null {
  for (const colId in columns) {
    if (draggableId.startsWith(`${colId}-`)) {
      const taskId = Number(draggableId.slice(colId.length + 1));

      if (!Number.isNaN(taskId)) {
        const task = columns[colId].items.find((t) => t.id === taskId);
        if (task) return task;
      }
    }
  }

  return null;
}
