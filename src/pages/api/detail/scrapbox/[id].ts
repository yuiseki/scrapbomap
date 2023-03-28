// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query;

  const aboutRes = await fetch(`https://scrapbox.io/api/projects/${id}/`);
  const aboutJson = await aboutRes.json();

  res.status(200).json(aboutJson);
}
