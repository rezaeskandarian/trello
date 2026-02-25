import { ColumnsState, Task } from "../components/kanban/kanban.types";

let taskId = 1;

const createTask = (title: string, dueDate: string): Task => ({
  id: taskId++,
  Task: title,

});

/**
 * Seed Tasks
 */
const todoTasks: Task[] = [
  createTask(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "2020-05-25"
  ),
  createTask("Fix Styling Issues", "2020-05-26"),
  createTask("Handle Door Specs", "2020-05-27"),
];

const inProgressTasks: Task[] = [];

const doneTasks: Task[] = [
  createTask("Morbi Refactor", "2020-08-23"),
  createTask("Proin Optimization", "2021-01-05"),
];

/**
 * Stable Column IDs
 */
export const columnsFromBackend: ColumnsState = {
  1: {
    title: "To-do",
    items: todoTasks,
  },
  2: {
    title: "In Progress",
    items: inProgressTasks,
  },
  3: {
    title: "Done",
    items: doneTasks,
  },
};