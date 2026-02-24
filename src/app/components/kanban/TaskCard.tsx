import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./kanban.types";
import styles from "./TaskCard.module.scss";

interface TaskCardProps {
  task: Task;
  columnId: string;
}

const TaskCard = ({ task, columnId }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `${columnId}-${task.id}`,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms ease",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={styles.card}>
        <p>{task.Task}</p>

        <div className={styles.secondary}>
          {new Date(task.Due_Date).toLocaleDateString("en-us", {
            month: "short",
            day: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
