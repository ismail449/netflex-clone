import { MagicUserMetadata } from "@magic-sdk/admin/dist/cjs/types";

export async function insertStats(
  token: string,
  stats: {
    favourited: number;
    userId: string;
    watched: boolean;
    videoId: string;
  }
) {
  const operationsDoc = `
  mutation insertStats($favourited: Int!, $userId: 
  String!, $watched: Boolean!, $videoId: String!) {
    insert_stats_one(object: {favourited: $favourited, 
    userId: $userId, watched: $watched, videoId: $videoId}
    ) {
      favourited
      id
      userId
    }
  }
`;
  const { favourited, userId, videoId, watched } = stats;
  const response = await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    {
      favourited,
      userId,
      videoId,
      watched,
    },
    token
  );
  return response;
}

export async function updateStats(
  token: string,
  stats: {
    favourited: number;
    userId: string;
    watched: boolean;
    videoId: string;
  }
) {
  const operationsDoc = `
  mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    update_stats(
      _set: {watched: $watched, favourited: $favourited}, 
      where: {
        userId: {_eq: $userId}, 
        videoId: {_eq: $videoId}
      }) {
      returning {
        favourited,
        userId,
        watched,
        videoId
      }
    }
  }
  `;
  const { favourited, userId, videoId, watched } = stats;
  const response = await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    {
      favourited,
      userId,
      videoId,
      watched,
    },
    token
  );
  return response;
}
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
  return response;
}

export const findVideIdByUser = async (
  token: string,
  userId: string,
  videoId: string
) => {
  const operationsDoc = `
  query findVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: { userId: {_eq: $userId}, videoId: {_eq: $videoId }}) {
      id
      userId
      videoId
      favourited
      watched
    }
  }
`;
  const response = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUserId",
    {
      videoId,
      userId,
    },
    token
  );
  return response?.data?.stats;
};

export const getWatchedVideos = async (userId: string, token: string) => {
  const operationsDoc = `
  query watchedVideos($userId: String!) {
    stats(where: {
      watched: {_eq: true}, 
      userId: {_eq: $userId},
    }) {
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "watchedVideos",
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
};
