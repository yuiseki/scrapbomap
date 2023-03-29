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

  const detailApiUrl = id ? `/api/detail/gyazo/${id}` : undefined;
  const { data: detaildata } = useSWR(detailApiUrl, fetcher);

  const geoJsonApiUrl = id ? `/api/geojson/gyazo/${id}` : undefined;
  const { data: geojsondata } = useSWR<turf.helpers.FeatureCollection>(
    geoJsonApiUrl,
    fetcher
  );
  const [sortedData, setSortedData] = useState<
    turf.helpers.Feature[] | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);

  // ソートの実装
  useEffect(() => {
    if (!currentCenter) return;
    if (!geojsondata) return;
    console.log(sortOrder);

    switch (sortOrder) {
      case "title": {
        const sorted = geojsondata.features.sort((poi1, poi2) => {
          if (!poi1.properties || !poi2.properties) {
            return 0;
          }
          return poi1.properties.title.localeCompare(
            poi2.properties.title,
            "ja",
            { numeric: true }
          );
        });
        setSortedData(sorted);
        break;
      }
      case "datetime": {
        const sorted = geojsondata.features.sort((poi1, poi2) => {
          if (!poi1.properties || !poi2.properties) {
            return 0;
          }
          const poi1Date = Math.floor(
            new Date(poi2.properties.captured_at).getTime() / 1000
          );
          const poi2Date = Math.floor(
            new Date(poi1.properties.captured_at).getTime() / 1000
          );
          console.log(poi1Date, poi2Date);
          return poi2Date - poi1Date;
        });
        setSortedData(sorted);
        break;
      }
      case "location": {
        const sorted = geojsondata.features.sort((poi1, poi2) => {
          if (
            poi1.geometry.type !== "Point" ||
            poi2.geometry.type !== "Point"
          ) {
            return 0;
          }
          // Note order: longitude, latitude.
          const center = turf.point(currentCenter);
          const from = turf.point(poi1.geometry.coordinates as number[]);
          const to = turf.point(poi2.geometry.coordinates as number[]);
          const centerToFrom = turf.distance(center, from, {
            units: "degrees",
          });
          const centerToTo = turf.distance(center, to, { units: "degrees" });
          return centerToFrom - centerToTo;
        });
        setSortedData(sorted);
        break;
      }
      default:
        break;
    }
  }, [currentCenter, geojsondata, sortOrder]);

  // 初期値は近さ
  useEffect(() => {
    setSortOrder("location");
  }, []);

  // 初回のみ地図をデータにあわせる
  useEffect(() => {
    if (!mapRef || !mapRef.current) return;
    if (!geojsondata) return;

    const [minLng, minLat, maxLng, maxLat] = turf.bbox(geojsondata);

    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 40, duration: 1000 }
    );
  }, [geojsondata]);

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

  return (
    <>
      <Head>
        <title>{detaildata ? detaildata.name : id}の地図 - scrapbomap</title>
        <meta
          name="description"
          content={`${detaildata ? detaildata.name : id}の地図 - scrapbomap`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {sortedData &&
          sortedData.map((poi) => {
            if (!poi.properties) {
              return null;
            }
            return (
              <link
                key={poi.properties.image}
                rel="preload"
                href={poi.properties.image}
                as="image"
              />
            );
          })}
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
            <a target="_blank" href={`${detaildata ? detaildata.url : ""}`}>
              {detaildata ? detaildata.name : id}
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
              {geojsondata &&
                geojsondata.features.map((poi) => {
                  if (!poi.properties) {
                    return null;
                  }
                  if (poi.geometry.type !== "Point") {
                    return null;
                  }
                  return (
                    <RedMarker
                      key={poi.properties.url}
                      icon={"yuiseki_icon.png"}
                      title={poi.properties.title}
                      photo={poi.properties.image}
                      longitude={poi.geometry.coordinates[0] as number}
                      latitude={poi.geometry.coordinates[1] as number}
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
                  sortedData.slice(0, 14).map((poi, idx) => {
                    if (!poi.properties) {
                      return null;
                    }
                    return <Photo key={poi.properties.url} poi={poi} />;
                  })}
              </div>
            </div>
          </div>
          <div style={{ margin: "20px", display: "flex", gap: "10px" }}>
            <div>
              <input
                type="radio"
                id="sort-location"
                checked={sortOrder === "location"}
                onChange={() => {
                  setSortOrder("location");
                }}
                style={{ marginRight: "10px" }}
              />
              <label htmlFor="sort-location">🗺 近さ</label>
            </div>
            <div>
              <input
                type="radio"
                id="sort-datetime"
                checked={sortOrder === "datetime"}
                onChange={() => {
                  setSortOrder("datetime");
                }}
                style={{ marginRight: "10px" }}
              />
              <label htmlFor="sort-datetime">↔ 撮影日時</label>
            </div>
            <div>
              <input
                type="radio"
                id="sort-title"
                checked={sortOrder === "title"}
                onChange={() => {
                  setSortOrder("title");
                }}
                style={{ marginRight: "10px" }}
              />
              <label htmlFor="sort-title">↕ タイトル</label>
            </div>
          </div>
          <div>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px" }}>
              {sortedData &&
                sortedData.map((poi) => {
                  if (!poi.properties) {
                    return null;
                  }
                  return (
                    <Title
                      key={poi.properties.url}
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
