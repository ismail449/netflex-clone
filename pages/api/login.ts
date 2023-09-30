import type { NextApiRequest, NextApiResponse } from "next";
import { magicAdmin } from "@/lib/magic";
import jwt from "jsonwebtoken";
import { isNewUser } from "@/lib/db/hasura";

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
    const token = jwt.sign(
      {
        ...metaData,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user", "admin"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": `${metaData.issuer}`,
        },
      },
      "7MUCcF13iWfqmTLWeafaNQC5A2FgehNr"
    );
    const isNew = await isNewUser(token, didToken);
    res.send({ response: { token, isNew } });
  } catch (error) {
    console.error("something went wrong logging in", error);
    res.status(500).send({ response: "not done" });
  }
};
export default login;
