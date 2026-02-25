export interface Comment {
  id: number;
  text: string;
  timestamp: string;
}

export interface Task {
  id: number;
  Task: string;
  comments?: Comment[];
}

export interface Column {
  title: string;
  items: Task[];
}

export type ColumnsState = Record<string, Column>;
