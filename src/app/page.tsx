"use client";
import dynamic from "next/dynamic";

const Kanban = dynamic(() => import("./components/kanban"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Kanban />
    </>
  );
}
