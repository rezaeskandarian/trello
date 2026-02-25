import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./kanban.types";
import { useState } from "react";
import styles from "./TaskCard.module.scss";
import CommentModal from "./CommentModal";

interface TaskCardProps {
  task: Task;
  columnId: string;
}

const TaskCard = ({ task, columnId }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `${columnId}-${task.id}`,
    });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms ease",
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <section ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div className={styles.card}>
          <p>{task.Task}</p>

          <div className={styles.secondary}>
            <button
              className={styles.commentButton}
              onPointerDown={stopPropagation}
              onClick={handleOpenModal}
            >
              Comments ({task.comments?.length || 0})
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <CommentModal
            task={task}
            columnId={columnId}
            onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default TaskCard;
