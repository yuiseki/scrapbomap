import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>scrapbomap</title>
        <meta name="description" content="scrapbomap" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>scrapbomap</h1>
        <h2>オススメの地図</h2>
        <ul className={styles.list}>
          <li>
            <Link href="/masuimap">masuimap</Link>
          </li>
          <li>
            <Link href="/yuiseki">yuiseki</Link>
          </li>
          <li>
            <Link href="/inoue2002">inoue2002</Link>
          </li>
          <li>
            <Link href="/kyoto-sightseeing-map">kyoto-sightseeing-map</Link>
          </li>
        </ul>
      </main>
    </>
  );
}
