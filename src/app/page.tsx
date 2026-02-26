"use client";
import dynamic from "next/dynamic";

const KanbanBoard = dynamic(() => import("./components/Kanban/KanbanBoard"), {
  ssr: false,
});

export default function Home() {
  return <KanbanBoard />;
}
