import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { insertStats, findVideIdByUser, updateStats } from "@/lib/db/hasura";

export default async function stats(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403).send({ error: "Not Authorized" });
      return;
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decodedToken === "string") {
      res.status(400).send({ error: "error decoding JWT Token" });
      return;
    }
    const userId = decodedToken.issuer;
    const inputParams = req.method === "POST" ? req.body : req.query;
    const { videoId } = inputParams;
    if (!videoId) {
      res.status(400).send({ error: "video id is missing" });
      return;
    }
    const foundVideo = await findVideIdByUser(token, userId, videoId);
    const isStatesFound = foundVideo.length > 0;
    if (req.method === "POST") {
      const { favourited, watched = true } = req.body;
      if (typeof favourited !== "number") {
        res.status(400).send({ error: "favourited is missing" });
        return;
      }
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
    } else if (req.method === "GET") {
      if (!isStatesFound) {
        res.status(404).send({ error: "video id not found" });
        return;
      }

      res.status(200).json({ foundVideo });
    } else {
      res.status(405).send({ response: "only POST method is allowed" });
      return;
    }
  } catch (error) {
    res.status(500).send({ error });
  }
}
