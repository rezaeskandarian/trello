"use client";
import dynamic from "next/dynamic";
import styles from "./page.module.scss";

const Kanban = dynamic(() => import("./components/kanban"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.page}>
      <Kanban />
    </div>
  );
}
