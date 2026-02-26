import { useState } from "react";
import styles from "../Column/Column.module.scss";

interface AddCardFormProps {
  onAdd: (text: string) => void;
}

const AddCardForm = ({ onAdd }: AddCardFormProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text);
      setText("");
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className={styles.addCardContainer}>
        <textarea
          className={styles.addCardTextarea}
          placeholder="Enter a title for this card..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className={styles.addCardActions}>
          <button
            type="button"
            className={styles.addCardButton}
            onClick={handleSubmit}
          >
            Add Card
          </button>
          <button
            className={styles.cancelButton}
            type="button"
            onClick={() => {
              setIsAdding(false);
              setText("");
            }}
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.addCardTrigger}
      onClick={() => setIsAdding(true)}
    >
      + Add another card
    </button>
  );
};

export default AddCardForm;
