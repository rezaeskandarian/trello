import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "../TaskCard/TaskCard";
import { useDroppable } from "@dnd-kit/core";
import styles from "./Column.module.scss";
import { useSetAtom } from "jotai";
import { addTaskAtom, updateColumnTitleAtom } from "../../atom/kanbanStore";
import type { Column as ColumnType } from "../kanban/kanban.types";
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
    <div ref={setNodeRef} className={styles.taskList}>
      <div className={styles.columnHeader}>
        <div>
          <EditableTitle
            title={column.title}
            onSave={handleTitleSave}
            titleClassName={styles.title}
            inputClassName={styles.titleInput}
          />
        </div>
        <ColumnActionsMenu columnId={columnId} />
      </div>

      <SortableContext
        items={column.items.map((task) => `${columnId}-${task.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {column.items.map((task) => (
          <TaskCard key={task.id} task={task} columnId={columnId} />
        ))}
      </SortableContext>

      <AddCardForm onAdd={handleAddCard} />
    </div>
  );
};
export default Column;
