import React from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import classNames from "classnames";
import styles from "@/styles/Video.module.css";
import { getYoutubeVideoById, Video } from "@/lib/videos";
import { formatDate } from "@/utils";

Modal.setAppElement("#__next");

const Video = ({ video }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { videoId } = router.query;

  const { channelTitle, description, publishTime, title, statistics } = video;
  console.log(formatDate(publishTime));
  return (
    <div className={styles.container}>
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
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}> {formatDate(publishTime)} </p>
              <p className={styles.title}> {title} </p>
              <p className={styles.description}> {description} </p>
            </div>
            <div className={styles.col2}>
              <p className={classNames(styles.subText, styles.subTextWrapper)}>
                {" "}
                <span className={styles.textColor}> Cast: </span>
                <span className={styles.channelTitle}> {channelTitle} </span>
              </p>
              <p className={classNames(styles.subText, styles.subTextWrapper)}>
                {" "}
                <span className={styles.textColor}> View Count: </span>
                <span className={styles.channelTitle}>
                  {" "}
                  {statistics.viewCount.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  )}{" "}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export const getStaticProps = (async () => {
  /* const video = {
    title: "Hi cute dog",
    publishTime: "1990-01-01",
    description: "A big red dog that is super cute, can he get any bigger?",
    channelTitle: "Paramount Pictures",
    viewCount: 10000,
  }; */
  const videoId = "4zH5iYM4wJo";
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
