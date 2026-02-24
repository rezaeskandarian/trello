import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import styles from "./Column.module.scss";

const Column = ({ columnId, column }) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <div ref={setNodeRef} className={styles.taskList}>
      <span className={styles.title}>{column.title}</span>

      <SortableContext
        items={column.items.map((task) => `${columnId}-${task.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {column.items.map((task) => (
          <TaskCard key={task.id} task={task} columnId={columnId} />
        ))}
      </SortableContext>
    </div>
  );
};
export default Column;
