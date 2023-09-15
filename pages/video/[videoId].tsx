import React from "react";
import { useRouter } from "next/router";

const Video = () => {
  const router = useRouter();
  const { videoId } = router.query;

  return <div>Video {videoId} </div>;
};

export default Video;
