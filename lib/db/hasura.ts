export async function queryHasuraGQL(
  operationsDoc: string,
  operationName: string,
  variables: Record<string, any>
) {
  try {
    const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL ?? "", {
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
    });
    return await result.json();
  } catch (error) {
    console.log(error);
  }
}
