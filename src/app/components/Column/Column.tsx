import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "../TaskCard/TaskCard";
import { useDroppable } from "@dnd-kit/core";
import styles from "./Column.module.scss";
import { useSetAtom } from "jotai";
import { addTaskAtom, updateColumnTitleAtom } from "../../atom/kanbanStore";
import type { Column as ColumnType } from "../Kanban/kanban.types";
import ColumnActionsMenu from "./ColumnActionsMenu";
import EditableTitle from "../EditableTitle";
import AddCardForm from "./AddCardForm";

const Column = ({
  columnId,
  column,
}: {
  columnId: string;
  column: ColumnType;
}) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  const addTask = useSetAtom(addTaskAtom);
  const updateColumnTitle = useSetAtom(updateColumnTitleAtom);

  const handleAddCard = (content: string) => {
    addTask({ columnId, content });
  };

  const handleTitleSave = (newTitle: string) => {
    updateColumnTitle({ columnId, newTitle });
  };

  return (
    <section
      ref={setNodeRef}
      className={styles.taskList}
      aria-label={`Column: ${column.title}`}
    >
      <header className={styles.columnHeader}>
        <div>
          <EditableTitle
            title={column.title}
            onSave={handleTitleSave}
            titleClassName={styles.title}
            inputClassName={styles.titleInput}
          />
        </div>
        <ColumnActionsMenu columnId={columnId} />
      </header>

      <SortableContext
        items={column.items.map((task) => `${columnId}-${task.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <ul className={styles.cardsList} role="list">
          {column.items.map((task) => (
            <li key={task.id} className={styles.cardsListItem}>
              <TaskCard task={task} columnId={columnId} />
            </li>
          ))}
        </ul>
      </SortableContext>

      <AddCardForm onAdd={handleAddCard} />
    </section>
  );
};
export default Column;
