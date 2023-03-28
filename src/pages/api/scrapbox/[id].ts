// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as turf from "@turf/turf";

type ScrapboxPageSummary = {
  id: string;
  title: string;
  image: string;
  descriptions: string[];
  user: {
    id: string;
  };
  pin: number;
  views: number;
  linked: number;
  commitId: string;
  created: number;
  updated: number;
  accessed: number;
  snapshotCreated: number;
  pageRank: number;
};

type Data = {
  id: string;
  pages: ScrapboxPageSummary;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<turf.helpers.FeatureCollection>
) {
  const { id } = req.query;
  const scrapboxRes = await fetch(
    `https://scrapbox.io/api/pages/${id}?skip=0&sort=updated&limit=1000`
  );
  const scrapboxJson = await scrapboxRes.json();
  const scrapboxLocationPages = scrapboxJson.pages.filter(
    (page: ScrapboxPageSummary) => {
      return (
        page.descriptions.filter((desc) => {
          return (
            (desc.startsWith("[N") || desc.startsWith("[E")) &&
            desc.includes("N") &&
            desc.includes("E") &&
            desc.includes("Z")
          );
        }).length > 0
      );
    }
  );
  const scrapboxGeoJsonPoints = scrapboxLocationPages.map(
    (page: ScrapboxPageSummary) => {
      // Note order: longitude, latitude.
      // N=latitude
      // E=longitude
      const locationString = page.descriptions.filter((desc) => {
        return (
          (desc.startsWith("[N") || desc.startsWith("[E")) &&
          desc.includes("N") &&
          desc.includes("E") &&
          desc.includes("Z")
        );
      })[0];
      const locationArray = locationString
        .replace("[", "")
        .replace("]", "")
        .split(",");
      try {
        const latitude = locationArray[0].replace("N", "");
        const longitude = locationArray[1].replace("E", "");
        const point = turf.point([parseFloat(longitude), parseFloat(latitude)]);
        let image = page.image;
        if (image.includes(".png")) {
          image = image.replace(".png", "");
        }
        if (image.includes(".jpg")) {
          image = image.replace(".jpg", "");
        }
        if (image.includes(".gif")) {
          image = image.replace(".gif", "");
        }
        if (image.includes(".wepb")) {
          image = image.replace(".webp", "");
        }
        point.properties = {
          title: page.title,
          image: image,
          descriptions: page.descriptions.filter((desc) => {
            return !desc.startsWith("[");
          }),
        };
        return point;
      } catch (error) {
        console.error(error);
      }
    }
  );
  const scrapboxGeoJson = turf.featureCollection(scrapboxGeoJsonPoints);
  res.status(200).json(scrapboxGeoJson);
}
