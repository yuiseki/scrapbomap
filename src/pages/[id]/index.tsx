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

  useEffect(() => {
    router.replace(`/scrapbox/${id}`);
  }, [id, router]);

  return null;
};

export default Post;
