import React, { useRef, useState, useEffect } from "react";
import styles from "./Column.module.scss";
import { useSetAtom } from "jotai";
import { deleteColumnAtom, clearColumnTasksAtom } from "../../atom/kanbanStore";

interface ColumnActionsMenuProps {
  columnId: string;
}

const ColumnActionsMenu = ({ columnId }: ColumnActionsMenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownView, setDropdownView] = useState<
    "main" | "deleteList" | "clearList"
  >("main");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const deleteColumn = useSetAtom(deleteColumnAtom);
  const clearColumnTasks = useSetAtom(clearColumnTasksAtom);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setDropdownView("main");
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
    setDropdownView("main");
  };

  const renderDropdownContent = () => {
    switch (dropdownView) {
      case "main":
        return (
          <>
            <div className={styles.dropdownHeader}>
              <span className={styles.dropdownTitle}>List Actions</span>
              <button
                type="button"
                className={styles.dropdownCloseBtn}
                onClick={() => setIsDropdownOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.dropdownDivider}></div>
            <ul className={styles.dropdownList}>
              <li onClick={() => setDropdownView("deleteList")}>
                Delete List...
              </li>
              <li onClick={() => setDropdownView("clearList")}>
                Delete All Cards...
              </li>
            </ul>
          </>
        );
      case "deleteList":
        return (
          <>
            <div className={styles.dropdownHeader}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => setDropdownView("main")}
              >
                ←
              </button>
              <span className={styles.dropdownTitle}>Delete List?</span>
              <button
                type="button"
                className={styles.dropdownCloseBtn}
                onClick={() => setIsDropdownOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.dropdownDivider}></div>
            <div className={styles.dropdownBody}>
              <p>
                All actions will be removed from the activity feed and you won’t
                be able to re-open the list. There is no undo.
              </p>
              <button
                type="button"
                className={`${styles.dangerButton}`}
                onClick={() => deleteColumn(columnId)}
              >
                Delete List
              </button>
            </div>
          </>
        );
      case "clearList":
        return (
          <>
            <div className={styles.dropdownHeader}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => setDropdownView("main")}
              >
                ←
              </button>
              <span className={styles.dropdownTitle}>Delete All Cards?</span>
              <button
                type="button"
                className={styles.dropdownCloseBtn}
                onClick={() => setIsDropdownOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.dropdownDivider}></div>
            <div className={styles.dropdownBody}>
              <p>This will remove all the cards in this list from the board.</p>
              <button
                type="button"
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
    <div className={styles.menuContainer} ref={dropdownRef}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={toggleDropdown}
      >
        •••
      </button>
      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>{renderDropdownContent()}</div>
      )}
    </div>
  );
};

export default ColumnActionsMenu;
