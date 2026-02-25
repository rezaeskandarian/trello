import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./kanban.types";
import { useState } from "react";
import styles from "./TaskCard.module.scss";
import { useSetAtom } from "jotai";
import { addCommentAtom } from "../../atom/kanbanStore";

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
  const [commentText, setCommentText] = useState("");
  const addComment = useSetAtom(addCommentAtom);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms ease",
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start when clicking the button
    setIsModalOpen(true);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
        addComment({ columnId, taskId: task.id, text: commentText });
        setCommentText("");
    }
  };

  // Prevent drag listeners on the modal
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={styles.card}>
        <p>{task.Task}</p>

        <div className={styles.secondary}>
          <button
            className={styles.commentButton}
            onPointerDown={stopPropagation} // Check if this stops drag
            onClick={handleOpenModal}
          >
            Comments ({task.comments?.length || 0})
          </button>
        </div>
      </div>
    </div>

    {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal} onPointerDown={stopPropagation}>
            <div className={styles.modalContent} onClick={stopPropagation}>
                <div className={styles.modalHeader}>
                    <h3>{task.Task}</h3>
                    <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
                </div>

                <div className={styles.commentsList}>
                    {(!task.comments || task.comments.length === 0) ? (
                        <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
                    ) : (
                        task.comments.map(comment => (
                            <div key={comment.id} className={styles.commentItem}>
                                <div className={styles.commentHeader}>
                                    <span className={styles.commentUser}>You</span>
                                    <span className={styles.commentTime}>
                                        {new Date(comment.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <p className={styles.commentText}>{comment.text}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.addCommentSection}>
                    <textarea
                        className={styles.commentInput}
                        placeholder="write the comment ...."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button className={styles.addCommentBtn} onClick={handleAddComment}>
                        Add Comment
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default TaskCard;
