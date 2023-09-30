import type { NextApiRequest, NextApiResponse } from "next";
import { magicAdmin } from "@/lib/magic";
import jwt from "jsonwebtoken";
import { isNewUser, createNewUser } from "@/lib/db/hasura";
import { setTokenCookie } from "@/lib/cookies";

type Data = {
  response: any;
};

const login = async (req: NextApiRequest, res: NextApiResponse<any>) => {
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
      process.env.JWT_SECRET ?? ""
    );
    const isNewUserQuery = await isNewUser(token, metaData.issuer ?? "");
    let newUser = null;
    if (isNewUserQuery) {
      newUser = await createNewUser(token, metaData);
    }
    setTokenCookie(token, res);
    res.send({ response: { token, isNewUserQuery, newUser } });
  } catch (error) {
    console.error("something went wrong logging in", error);
    res.status(500).send({ response: "not done" });
  }
};
export default login;
