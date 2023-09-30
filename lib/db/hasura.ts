export async function queryHasuraGQL(
  operationsDoc: string,
  operationName: string,
  variables: Record<string, any>,
  token: string
) {
  console.log({ token });
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
export async function isNewUser(token: string, didToken: string) {
  const operationsDoc = `
  query MyQuery {
    users(where: {issuer: {_eq: ${didToken}}}) {      
      email
      id
      issuer
    }
  }
`;
  const response = await queryHasuraGQL(operationsDoc, "MyQuery", {}, token);
  console.log({ response });
  return response?.data?.users?.length === 0;
}
function fetchMyQuery() {
  const operationsDoc = `
    query MyQuery {
      users(where: {issuer: {_eq: ""}}) {
        email
        id
        issuer
      }
    }
  `;
  return queryHasuraGQL(operationsDoc, "MyQuery", {}, "");
}
export async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();
  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }
  // do something great with this precious data
  console.log(data);
}
startFetchMyQuery();
