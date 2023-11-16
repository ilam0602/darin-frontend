'use client'
import OnlyConnect from "../../components/onlyConnect";
import styles from "./page.module.css";
import "./globals.css";

export default function Home() {
  return (
    <main className={styles.main}>
     <OnlyConnect/>
    </main>
  );
}
