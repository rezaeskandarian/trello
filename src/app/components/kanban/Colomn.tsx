import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import styles from "./Column.module.scss";
import { useState, useRef, useEffect } from "react";
import { useSetAtom } from "jotai";
import { addTaskAtom, updateColumnTitleAtom, deleteColumnAtom, clearColumnTasksAtom } from "../../atom/kanbanStore";
import { type Column as ColumnType } from "./kanban.types";

const Column = ({ columnId, column }: { columnId: string, column: ColumnType }) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newCardText, setNewCardText] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(column.title);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownView, setDropdownView] = useState<'main' | 'deleteList' | 'clearList'>('main');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const addTask = useSetAtom(addTaskAtom);
  const updateColumnTitle = useSetAtom(updateColumnTitleAtom);
  const deleteColumn = useSetAtom(deleteColumnAtom);
  const clearColumnTasks = useSetAtom(clearColumnTasksAtom);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
            setDropdownView('main');
        }
    };

    if (isDropdownOpen) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

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

  const toggleDropdown = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDropdownOpen(!isDropdownOpen);
      setDropdownView('main');
  };

  const renderDropdownContent = () => {
      switch (dropdownView) {
          case 'main':
              return (
                  <>
                      <div className={styles.dropdownHeader}>
                          <span className={styles.dropdownTitle}>List Actions</span>
                          <button className={styles.dropdownCloseBtn} onClick={() => setIsDropdownOpen(false)}>✕</button>
                      </div>
                      <div className={styles.dropdownDivider}></div>
                      <ul className={styles.dropdownList}>
                          <li onClick={() => setDropdownView('deleteList')}>Delete List...</li>
                          <li onClick={() => setDropdownView('clearList')}>Delete All Cards...</li>
                      </ul>
                  </>
              );
          case 'deleteList':
              return (
                  <>
                      <div className={styles.dropdownHeader}>
                          <button className={styles.backButton} onClick={() => setDropdownView('main')}>←</button>
                          <span className={styles.dropdownTitle}>Delete List?</span>
                          <button className={styles.dropdownCloseBtn} onClick={() => setIsDropdownOpen(false)}>✕</button>
                      </div>
                      <div className={styles.dropdownDivider}></div>
                      <div className={styles.dropdownBody}>
                          <p>All actions will be removed from the activity feed and you won’t be able to re-open the list. There is no undo.</p>
                          <button
                            className={`${styles.dangerButton}`}
                            onClick={() => deleteColumn(columnId)}
                          >
                            Delete List
                          </button>
                      </div>
                  </>
              );
           case 'clearList':
              return (
                  <>
                      <div className={styles.dropdownHeader}>
                          <button className={styles.backButton} onClick={() => setDropdownView('main')}>←</button>
                          <span className={styles.dropdownTitle}>Delete All Cards?</span>
                          <button className={styles.dropdownCloseBtn} onClick={() => setIsDropdownOpen(false)}>✕</button>
                      </div>
                      <div className={styles.dropdownDivider}></div>
                      <div className={styles.dropdownBody}>
                          <p>This will remove all the cards in this list from the board.</p>
                          <button
                             className={`${styles.dangerButton}`}
                             onClick={() => {
                                 clearColumnTasks(columnId);
                                 setIsDropdownOpen(false);
                             }}
                          >
                            Delete All
                          </button>
                      </div>
                  </>
              );
          default:
              return null;
      }
  };

  return (
    <div ref={setNodeRef} className={styles.taskList}>
      <div className={styles.columnHeader}>
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
        <div className={styles.menuContainer} ref={dropdownRef}>
            <button className={styles.menuButton} onClick={toggleDropdown}>•••</button>
            {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                    {renderDropdownContent()}
                </div>
            )}
        </div>
      </div>

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
