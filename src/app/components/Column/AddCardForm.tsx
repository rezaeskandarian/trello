import { useState } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import styles from "../Column/Column.module.scss";
import { Button, Textarea } from "../ui";

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
        <Textarea
          className={styles.addCardTextarea}
          placeholder="Enter a title for this card..."
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          autoFocus
          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className={styles.addCardActions}>
          <Button
            type="button"
            className={styles.addCardButton}
            onClick={handleSubmit}
          >
            Add Card
          </Button>
          <Button
            className={styles.cancelButton}
            variant="transparent"
            type="button"
            onClick={() => {
              setIsAdding(false);
              setText("");
            }}
          >
            ×
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="transparent"
      className={styles.addCardTrigger}
      onClick={() => setIsAdding(true)}
    >
      + Add another card
    </Button>
  );
};

export default AddCardForm;
