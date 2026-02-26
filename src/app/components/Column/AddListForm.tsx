import { useState } from "react";
import styles from "../kanban/Kanban.module.scss";

interface AddListFormProps {
  onAdd: (title: string) => void;
}

const AddListForm = ({ onAdd }: AddListFormProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title);
      setTitle("");
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className={styles.addColumnForm}>
        <input
          type="text"
          className={styles.addColumnInput}
          placeholder="Enter list title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <div className={styles.addColumnActions}>
          <button
            type="button"
            className={styles.addListButton}
            onClick={handleSubmit}
          >
            Add List
          </button>
          <button
            type="button"
            className={styles.cancelAddColumn}
            onClick={() => setIsAdding(false)}
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.addColumnContainer}>
      <button
        type="button"
        className={styles.addColumnButton}
        onClick={() => setIsAdding(true)}
      >
        + Add another list
      </button>
    </div>
  );
};

export default AddListForm;
