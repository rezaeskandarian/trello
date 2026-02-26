import type { ColumnsState, Task } from "../components/Kanban/kanban.types";

let taskId = 1;

const createTask = (title: string): Task => ({
  id: taskId++,
  Task: title,
});

const todoTasks: Task[] = [
  createTask("Lorem ipsum dolor sit amet, consectetur adipiscing elit."),
  createTask("Fix Styling Issues"),
  createTask("Handle Door Specs"),
];

const inProgressTasks: Task[] = [];

const doneTasks: Task[] = [
  createTask("Morbi Refactor"),
  createTask("Proin Optimization"),
];

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
