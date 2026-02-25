import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import styles from "./Column.module.scss";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { addTaskAtom, updateColumnTitleAtom } from "../../atom/kanbanStore";
import { type Column as ColumnType } from "./kanban.types";

const Column = ({ columnId, column }: { columnId: string, column: ColumnType }) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newCardText, setNewCardText] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(column.title);

  const addTask = useSetAtom(addTaskAtom);
  const updateColumnTitle = useSetAtom(updateColumnTitleAtom);

  const handleAddCard = () => {
    if (newCardText.trim()) {
      addTask({ columnId, content: newCardText });
      setNewCardText("");
      setIsAdding(false);
    }
  };

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleText.trim() && titleText !== column.title) {
        updateColumnTitle({ columnId, newTitle: titleText });
    } else {
        setTitleText(column.title);
    }
  };

  return (
    <div ref={setNodeRef} className={styles.taskList}>
       {isEditingTitle ? (
        <input
          className={styles.titleInput}
          value={titleText}
          onChange={(e) => setTitleText(e.target.value)}
          onBlur={handleTitleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTitleSubmit();
            }
          }}
          autoFocus
        />
      ) : (
        <span
          className={styles.title}
          onClick={() => {
            setIsEditingTitle(true);
            setTitleText(column.title);
          }}
        >
          {column.title}
        </span>
      )}

      <SortableContext
        items={column.items.map((task) => `${columnId}-${task.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {column.items.map((task) => (
          <TaskCard key={task.id} task={task} columnId={columnId} />
        ))}
      </SortableContext>

      {isAdding ? (
        <div className={styles.addCardContainer}>
          <textarea
            className={styles.addCardTextarea}
            placeholder="Enter a title for this card..."
            value={newCardText}
            onChange={(e) => setNewCardText(e.target.value)}
            autoFocus
          />
          <div className={styles.addCardActions}>
            <button className={styles.addCardButton} onClick={handleAddCard}>
              Add Card
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setIsAdding(false);
                setNewCardText("");
              }}
            >
             ✕
            </button>
          </div>
        </div>
      ) : (
        <button
          className={styles.addCardTrigger}
          onClick={() => setIsAdding(true)}
        >
          + Add another card
        </button>
      )}
    </div>
  );
};
export default Column;
