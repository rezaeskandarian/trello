import { useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import styles from "./Column.module.scss";
import { Button, Input } from "../ui";

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

  const handleOnChangeAddListForm = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)

    const handleOnKeyDownAddListForm = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSubmit();
    }

  if (isAdding) {
    return (
      <div className={styles.addColumnForm}>
        <Input
          type="text"
          className={styles.addColumnInput}
          placeholder="Enter list title..."
          value={title}
          onChange={handleOnChangeAddListForm}
          onKeyDown={handleOnKeyDownAddListForm}
        />
        <div className={styles.addColumnActions}>
          <Button
            type="button"
            className={styles.addListButton}
            onClick={handleSubmit}
          >
            Add List
          </Button>
          <Button
            type="button"
            variant="transparent"
            className={styles.cancelAddColumn}
            onClick={() => setIsAdding(false)}
          >
            ×
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.addColumnContainer}>
      <Button
        type="button"
        variant="transparent"
        className={styles.addColumnButton}
        onClick={() => setIsAdding(true)}
      >
        + Add another list
      </Button>
    </div>
  );
};

export default AddListForm;
