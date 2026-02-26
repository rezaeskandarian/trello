import React, { useState } from "react";
import styles from "../TaskCard/TaskCard.module.scss";
import type { Comment, Task } from "../kanban/kanban.types";
import { useSetAtom } from "jotai";
import { addCommentAtom } from "../../atom/kanbanStore";

interface CommentModalProps {
  task: Task;
  columnId: string;
  onClose: () => void;
}

const CommentModal = ({ task, columnId, onClose }: CommentModalProps) => {
  const [commentText, setCommentText] = useState("");
  const addComment = useSetAtom(addCommentAtom);

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment({ columnId, taskId: task.id, text: commentText });
      setCommentText("");
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      onPointerDown={stopPropagation}
    >
      <div className={styles.modalContent} onClick={stopPropagation}>
        <div className={styles.modalHeader}>
          <h3>{task.Task}</h3>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.commentsList}>
          {!task.comments || task.comments.length === 0 ? (
            <p className={styles.noComments}>
              No comments yet. Be the first to comment!
            </p>
          ) : (
            task.comments.map((comment: Comment) => (
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
          <button
            type="button"
            className={styles.addCommentBtn}
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
