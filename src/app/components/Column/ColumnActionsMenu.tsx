import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Column.module.scss";
import { useSetAtom } from "jotai";
import { clearColumnTasksAtom, deleteColumnAtom } from "../../atom/kanbanStore";
import {Button} from "@/src/app/components/ui";

interface ColumnActionsMenuProps {
  columnId: string;
}

type DropdownView = "main" | "deleteList" | "clearList";

type MenuHeaderProps = {
  title: string;
  onClose: () => void;
  onBack?: () => void;
};

const MenuHeader = ({ title, onClose, onBack }: MenuHeaderProps) => {
  return (
    <div className={styles.dropdownHeader}>
      {onBack ? (
        <button
          type="button"
          className={styles.backButton}
          onClick={onBack}
          aria-label="Back"
        >
          ←
        </button>
      ) : (
        <span className={styles.backButtonPlaceholder} aria-hidden="true" />
      )}

      <span className={styles.dropdownTitle}>{title}</span>

      <button
        type="button"
        className={styles.dropdownCloseBtn}
        onClick={onClose}
        aria-label="Close menu"
      >
        ×
      </button>
    </div>
  );
};

type ConfirmActionProps = {
  description: string;
  actionLabel: string;
  onAction: () => void;
};

const ConfirmAction = ({
  description,
  actionLabel,
  onAction,
}: ConfirmActionProps) => {
  return (
    <div className={styles.dropdownBody}>
      <p>{description}</p>
      <button type="button" className={styles.dangerButton} onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  );
};

const ColumnActionsMenu = ({ columnId }: ColumnActionsMenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownView, setDropdownView] = useState<DropdownView>("main");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const deleteColumn = useSetAtom(deleteColumnAtom);
  const clearColumnTasks = useSetAtom(clearColumnTasksAtom);

  const openDropdown = useCallback(() => {
    setIsDropdownOpen(true);
    setDropdownView("main");
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
    setDropdownView("main");
  }, []);

  const toggleDropdown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsDropdownOpen((prev) => {
        const next = !prev;
        if (next) openDropdown();
        return next;
      });
    },
    [openDropdown],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDropdown, isDropdownOpen]);

  const views = useMemo(
    (): Record<DropdownView, { title: string; back?: () => void; content: React.ReactNode }> =>
      ({
        main: {
          title: "List Actions",
          content: (
            <ul className={styles.dropdownList}>
              <li onClick={() => setDropdownView("deleteList")}>
                Delete List...
              </li>
              <li onClick={() => setDropdownView("clearList")}>
                Delete All Cards...
              </li>
            </ul>
          ),
        },
        deleteList: {
          title: "Delete List?",
          back: () => setDropdownView("main"),
          content: (
            <ConfirmAction
              description="All actions will be removed from the activity feed and you won’t be able to re-open the list. There is no undo."
              actionLabel="Delete List"
              onAction={() => deleteColumn(columnId)}
            />
          ),
        },
        clearList: {
          title: "Delete All Cards?",
          back: () => setDropdownView("main"),
          content: (
            <ConfirmAction
              description="This will remove all the cards in this list from the board."
              actionLabel="Delete All"
              onAction={() => {
                clearColumnTasks(columnId);
                closeDropdown();
              }}
            />
          ),
        },
      }),
    [clearColumnTasks, closeDropdown, columnId, deleteColumn],
  );

  const currentView = views[dropdownView];

  return (
    <div className={styles.menuContainer} ref={dropdownRef}>
      <Button
        type="button"
        className={styles.menuButton}
        onClick={toggleDropdown}
        aria-haspopup="menu"
        aria-expanded={isDropdownOpen}
      >
        •••
      </Button>

      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          <MenuHeader
            title={currentView.title}
            onClose={closeDropdown}
            onBack={currentView.back}
          />
          <div className={styles.dropdownDivider} />
          {currentView.content}
        </div>
      )}
    </div>
  );
};

export default ColumnActionsMenu;
