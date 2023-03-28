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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px 0",
          }}
        >
          <p style={{ margin: "0px" }}>
            このWebサービスは
            <a
              target="_blank"
              href="https://ja.wikipedia.org/wiki/%E5%A2%97%E4%BA%95%E4%BF%8A%E4%B9%8B"
            >
              増井俊之さん
            </a>
            が発明した
            <a target="_blank" href="https://gyamap.com/">
              Gyamap
            </a>
            をNext.jsで写経したものです（
            <a target="_blank" href="https://github.com/yuiseki/scrapbomap">
              GitHubで絶賛開発中
            </a>
            ）
          </p>
          <p style={{ margin: "0px", paddingLeft: "20px" }}>
            <a
              target="_blank"
              href="https://scrapbox.io/Gyamap/%E6%A6%82%E8%A6%81"
            >
              Gyamapとは
            </a>
          </p>
        </div>
        <h2>オススメの地図</h2>
        <ul className={styles.list}>
          <li>
            <Link href="/scrapbox/kyoto-sightseeing-map">
              kyoto-sightseeing-map
            </Link>
          </li>
          <li>
            <Link href="/scrapbox/nara-tour-map">nara-tour-map</Link>
          </li>
          <li>
            <Link href="/scrapbox/kanagawa-ramen-map">kanagawa-ramen-map</Link>
          </li>
          <li>
            <Link href="/scrapbox/jihanki-map">jihanki-map</Link>
          </li>
          <li>
            <Link href="/scrapbox/masuimap">masuimap</Link>
          </li>
          <li>
            <Link href="/scrapbox/yuiseki">yuiseki</Link>
          </li>
          <li>
            <Link href="/scrapbox/inoue2002">inoue2002</Link>
          </li>
        </ul>
      </main>
    </>
  );
}
