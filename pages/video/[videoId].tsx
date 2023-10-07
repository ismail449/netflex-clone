import React, { useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import classNames from "classnames";
import styles from "@/styles/Video.module.css";
import { getYoutubeVideoById, likeDislikeVideo, Video } from "@/lib/videos";
import { formatDate } from "@/utils";
import Head from "next/head";
import Navbar from "@/components/navbar/navbar";
import Like from "@/components/icons/like-icon";
import DisLike from "@/components/icons/dislike-icon";

Modal.setAppElement("#__next");

const Video = ({ video }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);
  const router = useRouter();
  const videoId = router.query.videoId as string;

  const { channelTitle, description, publishTime, title, statistics } = video;
  const viewCount = +statistics.viewCount;

  const handleToggleLike = async () => {
    console.log("handleToggleLike");
    setToggleLike(true);
    setToggleDisLike(false);
    const response = await likeDislikeVideo(videoId, 1);
    console.log(response);
  };
  const handleToggleDislike = async () => {
    console.log("handleToggleDislike");
    setToggleLike(false);
    setToggleDisLike(true);
    const response = await likeDislikeVideo(videoId, 0);
    console.log(response);
  };
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={styles.container}>
        <Navbar />
        <Modal
          isOpen={true}
          contentLabel="Watch the video"
          onRequestClose={() => router.back()}
          overlayClassName={styles.overlay}
          className={styles.modal}
        >
          <iframe
            className={styles.videoPlayer}
            id="player"
            width="100%"
            height="390"
            src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com&controls=0`}
          ></iframe>
          <div className={styles.likeDislikeBtnWrapper}>
            <div className={styles.likeBtnWrapper}>
              <button onClick={handleToggleLike}>
                <div className={styles.btnWrapper}>
                  <Like fill="white" selected={toggleLike} />
                </div>
              </button>
            </div>

            <button onClick={handleToggleDislike}>
              <div className={styles.btnWrapper}>
                <DisLike fill="white" selected={toggleDisLike} />
              </div>
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.modalBodyContent}>
              <div className={styles.col1}>
                <p className={styles.publishTime}>
                  {" "}
                  {formatDate(publishTime)}{" "}
                </p>
                <p className={styles.title}> {title} </p>
                <p className={styles.description}> {description} </p>
              </div>
              <div className={styles.col2}>
                <p
                  className={classNames(styles.subText, styles.subTextWrapper)}
                >
                  {" "}
                  <span className={styles.textColor}> Cast: </span>
                  <span className={styles.channelTitle}> {channelTitle} </span>
                </p>
                <p
                  className={classNames(styles.subText, styles.subTextWrapper)}
                >
                  {" "}
                  <span className={styles.textColor}> View Count: </span>
                  <span className={styles.channelTitle}>
                    {" "}
                    {viewCount.toLocaleString("en-EN")}{" "}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
export const getStaticProps = (async (context) => {
  const videoId =
    typeof context.params?.videoId === "string" ? context.params?.videoId : "";
  const videos = await getYoutubeVideoById(videoId);
  const video = videos[0];
  return {
    props: { video },
    revalidate: 10,
  };
}) satisfies GetStaticProps<{
  video: Video;
}>;

export const getStaticPaths = (() => {
  const videoIds = ["cBFq_6Zj2aA", "-FZ-pPFAjYY", "LDG9bisJEaI"];
  const paths = videoIds.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}) satisfies GetStaticPaths;

export default Video;
