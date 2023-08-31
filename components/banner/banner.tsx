import React, { FC } from "react";
import Image from "next/image";
import styles from "./banner.module.css";

type BannerProps = {
  title: string;
  subTitle: string;
  imgUrl: string;
};

const Banner: FC<BannerProps> = ({ imgUrl, subTitle, title }) => {
  const handleOnPlay = () => {
    console.log("play");
  };
  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          <div className={styles.nseriesWrapper}>
            <p className={styles.firstLetter}>N</p>
            <p className={styles.series}>S E R I E S</p>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <h3 className={styles.subTitle}>{subTitle}</h3>
          <div className={styles.playBtnWrapper}>
            <button className={styles.btnWithIcon} onClick={handleOnPlay}>
              <Image
                src="/static/play_arrow.svg"
                width={32}
                height={32}
                alt="play icon"
              />
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      ></div>
    </div>
  );
};

export default Banner;
