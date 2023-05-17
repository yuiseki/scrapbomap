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
            <Link href="/gyazo/86c21448cb5b45f6ba58ca778e67288a">
              yuisekiの京都マップ
            </Link>
          </li>
          <li>
            <Link href="/gyazo/0ec2e37273e2bae34de604e70f24b64d">
              yuisekiの静岡マップ
            </Link>
          </li>
          <li>
            <Link href="/gyazo/f550e905a4f8988430750e6a621b00ea">
              yuisekiのアキバマップ
            </Link>
          </li>
          <li>
            <Link href="/gyazo/13dd158ce0e158452f9752ecc318b707">
              yuisekiの蕎麦マップ
            </Link>
          </li>
          <li>
            <Link href="/gyazo/482dc52de945a8eaeef9353f37d257fd">
              yuisekiの鰻マップ
            </Link>
          </li>
          <li>
            <Link href="/gyazo/76463b962124408b3c487b8a1d52cd09">
              RubyKaigi 2023-05 長野県松本市 yuiseki
            </Link>
          </li>
          <li>
            <Link href="/gyazo/5939495c0dd36429de93875b915e729a">
              言語処理学会 2023-03 沖縄県那覇市 yuiseki
            </Link>
          </li>
          <li>
            <Link href="/gyazo/5679cc5548023adc67349722596ce2a7">
              RubyKaigi 2022-09 三重県津市 yuiseki
            </Link>
          </li>
          <li>
            <Link href="/gyazo/6ac4f1d1c99aaee992aa13046303fa21">
              韓国ソウル 2020-02 yuiseki
            </Link>
          </li>
          <li>
            <Link href="/gyazo/f73ce288199f7d3163dc0aa47c9e9c6d">
              開発テスト用
            </Link>
          </li>
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
