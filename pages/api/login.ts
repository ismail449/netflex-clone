import type { NextApiRequest, NextApiResponse } from "next";
import { magicAdmin } from "@/lib/magic";

type Data = {
  response: any;
};

const login = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== "POST") {
    res.status(500).send({ response: "only POST method is allowed" });
    return;
  }
  try {
    const didToken = req.headers.authorization?.substring(7) ?? "";
    const metaData = await magicAdmin.users.getMetadataByToken(didToken);
    res.send({ response: metaData });
  } catch (error) {
    console.error("something went wrong logging in", error);
    res.status(500).send({ response: "not done" });
  }
};
export default login;
