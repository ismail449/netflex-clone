export type Video = {
  imgUrl: string;
  title: string;
  id: string;
};

export interface Videos {
  items: Item[];
}

export interface Item {
  id: ID | string;
  snippet: Snippet;
}

export interface ID {
  videoId: string;
}

export interface Snippet {
  publishedAt: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
}

export interface Thumbnails {
  high: Default;
}

export interface Default {
  url: string;
  width?: number;
  height?: number;
}

export const getCommonVideos = async (url: string) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const baseUrl = "https://youtube.googleapis.com/youtube/v3";

  try {
    const response = await fetch(
      `${baseUrl}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      return [];
    }
    const videosData: Videos = await response.json();

    return videosData.items.map((item) => {
      return {
        imgUrl: item.snippet.thumbnails.high.url,
        title: item.snippet.title,
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
