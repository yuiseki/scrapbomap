// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as turf from "@turf/turf";

type GyazoImage = {
  metadata?: {
    exif_normalized?: {
      longitude?: number;
      latitude?: number;
    };
  };
};

type GyazoImageWithLocation = {
  created_at: string;
  updated_at: string;
  exif_captured_at: string;
  metadata: {
    exif_normalized: {
      longitude: number;
      latitude: number;
    };
    app?: string;
    title?: string;
  };
  grid_thumbs: {
    large_url_webp_2x: string;
  };
  desc: string;
  links: string[];
  url: string;
  permalink_url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<turf.helpers.FeatureCollection>
) {
  const { id } = req.query;

  const imagesRes = await fetch(
    `https://gyazo.com/api/internal/boards/${id}/images?per=100`
  );
  const imagesJson = await imagesRes.json();
  const poiList = imagesJson
    .filter((image: GyazoImage) => {
      return (
        image.metadata &&
        image.metadata.exif_normalized &&
        image.metadata.exif_normalized.longitude &&
        image.metadata.exif_normalized.latitude
      );
    })
    .map((image: GyazoImageWithLocation) => {
      const metadata = image.metadata;
      const exifdata = image.metadata.exif_normalized;
      const point = turf.point([exifdata.longitude, exifdata.latitude]);
      let title = "No title";
      if (metadata.title) {
        title = metadata.title;
      } else {
        if (image.desc.length > 0) {
          title = image.desc.split("\n")[0];
        } else {
          if (image.metadata.app) {
            title = image.metadata.app;
          }
        }
      }
      let desc = image.desc;
      if (title === image.desc.split("\n")[0]) {
        desc = image.desc
          .split("\n")
          .slice(1, (image.desc.match(/\n/g) || []).length + 1)
          .join(" ");
      }
      point.properties = {
        title: title,
        image: image.grid_thumbs.large_url_webp_2x,
        descriptions: desc,
        links: image.links,
        url: image.permalink_url,
        created_at: image.created_at,
        captured_at: image.exif_captured_at,
      };
      return point;
    });
  const resGeoJson = turf.featureCollection(poiList);

  res.status(200).json(resGeoJson);
}
