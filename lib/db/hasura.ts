/*
This is an example snippet - you should consider tailoring it
to your service.

Note: we only handle the first operation here
*/

async function fetchGraphQL(
  operationsDoc: string,
  operationName: string,
  variables: Record<string, any>
) {
  try {
    const result = await fetch(
      "https://neutral-piglet-10.hasura.app/v1/graphql",
      {
        method: "POST",
        headers: {
          "x-hasura-admin-secret":
            process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ?? "",
        },
        body: JSON.stringify({
          query: operationsDoc,
          variables,
          operationName,
        }),
      }
    );
    return await result.json();
  } catch (error) {
    console.log(error);
  }
}

const operationsDoc = `
  query MyQuery {
    users {
      email
      id
      issuer
      publicAddress
    }
  }
`;

function fetchMyQuery() {
  return fetchGraphQL(operationsDoc, "MyQuery", {});
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
