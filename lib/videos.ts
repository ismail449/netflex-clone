import videoTestData from "../data/videos.json";
export type Video = {
  title: string;
  description: string;
  publishTime: string;
  channelTitle: string;
  statistics: Statistics;
  imgUrl: string;
  id: string;
};

export interface VideoItem {
  id: ID | string;
  snippet: Snippet;
  statistics: Statistics;
}

export interface ID {
  videoId: string;
}

export interface Snippet {
  publishedAt: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
}
export interface Statistics {
  viewCount: string;
}

export interface Thumbnails {
  high: Default;
}

export interface Default {
  url: string;
  width?: number;
  height?: number;
}

export const fetchVideos = async (url: string) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const baseUrl = "https://youtube.googleapis.com/youtube/v3";
  const response = await fetch(
    `${baseUrl}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    return [];
  }
  return await response.json();
};

export const getCommonVideos = async (url: string) => {
  try {
    const isDev = process.env.DEVELOPMENT;
    const videos =
      isDev === "true" && url.includes("search")
        ? videoTestData
        : await fetchVideos(url);
    return videos.items.map((item: VideoItem) => {
      const snippet = item.snippet;
      return {
        title: snippet.title,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: "0" },
        imgUrl: item.snippet.thumbnails.high.url,
        id: typeof item.id === "string" ? item.id : item.id.videoId,
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getVideos = async (searchQuery: string) => {
  const url = `search?part=snippet&type=video&q=${searchQuery}`;
  return await getCommonVideos(url);
};

export const getPopularVideos = async () => {
  const url =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=EG";
  return await getCommonVideos(url);
};

export const getYoutubeVideoById = async (id: string) => {
  const url = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}`;
  return await getCommonVideos(url);
};

export const likeDislikeVideo = async (videoId: string, favourited: number) => {
  const response = await fetch("/api/stats", {
    method: "POST",
    body: JSON.stringify({
      videoId,
      favourited,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

export const getVideoLikeDislike = async (videoId: string) => {
  const response = await fetch(`/api/stats?videoId=${videoId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { foundVideo } = await response.json();
  if (foundVideo.length > 0) {
    console.log(foundVideo);

    return foundVideo[0].favourited;
  }
};
