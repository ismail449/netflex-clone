import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { insertStats, findVideIdByUser, updateStats } from "@/lib/db/hasura";

export default async function stats(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).send({ response: "only POST method is allowed" });
    return;
  }

  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403).send({ response: "Not Authorized" });
      return;
    }
    const { videoId, favourited, watched = true } = req.body;
    if (!videoId || typeof favourited !== "number") {
      res.status(400).send({ error: "video id or favourited are missing" });
      return;
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decodedToken === "string") {
      res.status(400).send({ error: "error decoding JWT Token" });
      return;
    }

    const userId = decodedToken.issuer;

    const isStatesFound = await findVideIdByUser(token, userId, videoId);
    let responseStats;
    if (isStatesFound) {
      responseStats = await updateStats(token, {
        favourited,
        userId,
        videoId,
        watched,
      });
    } else {
      responseStats = await insertStats(token, {
        favourited,
        userId,
        videoId,
        watched,
      });
    }

    res.status(200).json({ data: responseStats });
  } catch (error) {
    res.status(500).send({ error });
  }
}
