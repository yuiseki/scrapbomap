/* eslint-disable @next/next/no-html-link-for-pages */
import {
  Map,
  MapProvider,
  MapRef,
  MapboxEvent,
  NavigationControl,
  useMap,
} from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRouter } from "next/router";
import useSWR from "swr";
import * as turf from "@turf/turf";
import { useCallback, useEffect, useRef, useState } from "react";
import { GyamapResponse } from "@/types/GyamapResponse";
import { fetcher } from "@/lib/fetcher";
import { Photo } from "@/components/Photo";
import { Title } from "@/components/TextRow";
import { RedMarker } from "@/components/RedMarker";
import Head from "next/head";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;

  const mapRef = useRef<MapRef | null>(null);
  const [currentCenter, setCurrentCenter] = useState<number[] | undefined>(
    undefined
  );

  const gyamapUrl = id ? `https://gyamap.com/project_entries/${id}` : undefined;
  const { data } = useSWR<GyamapResponse[]>(gyamapUrl, fetcher);
  const [sortedData, setSortedData] = useState<GyamapResponse[] | undefined>(
    undefined
  );

  // 初回のみ地図をデータにあわせる
  useEffect(() => {
    if (!mapRef || !mapRef.current) return;
    if (!data) return;

    const [minLng, minLat, maxLng, maxLat] = turf.bbox(
      turf.lineString(
        data.map((poi) => {
          // Note order: longitude, latitude.
          return [poi.longitude, poi.latitude];
        })
      )
    );

    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 40, duration: 1000 }
    );
  }, [data]);

  const onLoad = useCallback(() => {
    if (!mapRef || !mapRef.current) return;
    setCurrentCenter([
      mapRef.current.getCenter().lng,
      mapRef.current.getCenter().lat,
    ]);
  }, []);

  const onMove = useCallback(() => {
    if (!mapRef || !mapRef.current) return;
    setCurrentCenter([
      mapRef.current.getCenter().lng,
      mapRef.current.getCenter().lat,
    ]);
  }, []);

  useEffect(() => {
    if (!currentCenter) return;
    if (!data) return;
    const sorted = data.sort((poi1, poi2) => {
      // Note order: longitude, latitude.
      const center = turf.point(currentCenter);
      const from = turf.point([poi1.longitude, poi1.latitude]);
      const to = turf.point([poi2.longitude, poi2.latitude]);
      const centerToFrom = turf.distance(center, from, { units: "degrees" });
      const centerToTo = turf.distance(center, to, { units: "degrees" });
      return centerToFrom - centerToTo;
    });
    setSortedData(sorted);
  }, [currentCenter, data]);

  return (
    <>
      <Head>
        <title>{id}の地図 - scrapbomap</title>
        <meta name="description" content={`${id}の地図 - scrapbomap`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px",
          }}
        >
          <h3 style={{ margin: "0px", padding: "0px" }}>
            <a href="/">
              <b>scrapbomap</b>
            </a>
            <span> / </span>
            <a target="_blank" href={`https://scrapbox.io/${id}`}>
              {id}
            </a>
            の地図
          </h3>
          <p style={{ margin: "0px", paddingLeft: "20px" }}>
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
        <MapProvider>
          <div style={{ display: "flex", margin: "20px" }}>
            <Map
              style={{
                display: "block",
                flexGrow: 1,
                minWidth: "400px",
                maxWidth: "400px",
                width: "400px",
                height: "400px",
              }}
              id="mainMap"
              ref={mapRef}
              mapLib={maplibregl}
              mapStyle="https://tile.openstreetmap.jp/styles/osm-bright/style.json"
              attributionControl={true}
              initialViewState={{
                latitude: 35.7084,
                longitude: 139.784,
                zoom: 11,
              }}
              hash={false}
              maxZoom={22}
              maxPitch={85}
              onLoad={onLoad}
              onMove={onMove}
            >
              {data &&
                data.map((poi) => {
                  return (
                    <RedMarker
                      key={poi.title}
                      icon={"yuiseki_icon.png"}
                      {...poi}
                    />
                  );
                })}
              <NavigationControl
                position="bottom-right"
                visualizePitch={true}
                showZoom={true}
                showCompass={true}
              />
            </Map>
            <div style={{ flexGrow: 0 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginLeft: "5px",
                  maxHeight: "400px",
                  overflowY: "hidden",
                }}
              >
                {sortedData &&
                  sortedData
                    .filter((poi) => poi.photo && poi.photo.length > 0)
                    .slice(0, 14)
                    .map((poi, idx) => {
                      return <Photo key={poi.title} poi={poi} />;
                    })}
              </div>
            </div>
          </div>
          <div>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px" }}>
              {sortedData &&
                sortedData.map((poi) => {
                  return (
                    <Title
                      key={poi.title}
                      projectName={id as string}
                      poi={poi}
                    />
                  );
                })}
            </ul>
          </div>
        </MapProvider>
      </div>
    </>
  );
};

export default Post;
