import { useSortable } from "@dnd-kit/sortable";
import type { Task } from "../Kanban/kanban.types";
import { useState } from "react";
import styles from "./TaskCard.module.scss";
import CommentModal from "./CommentModal";

interface TaskCardProps {
  task: Task;
  columnId: string;
}

const TaskCard = ({ task, columnId }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef } = useSortable({
    id: `${columnId}-${task.id}`,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <article ref={setNodeRef} {...attributes} {...listeners}>
        <div className={styles.card}>
          <p>{task.Task}</p>

          <footer className={styles.secondary}>
            <button
              type="button"
              className={styles.commentButton}
              onPointerDown={stopPropagation}
              onClick={handleOpenModal}
              aria-haspopup="dialog"
            >
              Comments ({task.comments?.length || 0})
            </button>
          </footer>
        </div>
      </article>

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
