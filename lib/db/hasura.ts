import { MagicUserMetadata } from "@magic-sdk/admin/dist/cjs/types";

export async function queryHasuraGQL(
  operationsDoc: string,
  operationName: string,
  variables: Record<string, any>,
  token: string
) {
  try {
    const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL ?? "", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables,
        operationName,
      }),
    });
    return await result.json();
  } catch (error) {
    console.log(error);
  }
}
export async function isNewUser(token: string, issuer: string) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {      
      email
      id
      issuer
    }
  }
`;
  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    { issuer },
    token
  );
  return response?.data?.users?.length === 0;
}

export async function createNewUser(
  token: string,
  metaData: MagicUserMetadata
) {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;

  const { issuer, email, publicAddress } = metaData;
  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );
  console.log({ response, issuer });
  return response;
}
