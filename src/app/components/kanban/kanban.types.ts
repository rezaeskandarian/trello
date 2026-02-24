export interface Task {
  id: number;
  Task: string;
  Due_Date: string;
}

export interface Column {
  title: string;
  items: Task[];
}

export type ColumnsState = Record<string, Column>;
