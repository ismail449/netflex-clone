import React, { FC } from "react";
import Link from "next/link";
import Card, { CardSizeType } from "../card/card";
import { Video } from "@/lib/videos";
import styles from "./cards-section.module.css";

type CardsSectionProps = {
  title: string;
  videos: Video[];
  size: CardSizeType;
};

const CardsSection: FC<CardsSectionProps> = ({ title, videos = [], size }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.length > 0
          ? videos.map(({ id, imgUrl, title }, index) => (
              <Link key={id} href={`/video/${id}`}>
                <Card id={index} imgUrl={imgUrl} size={size} />
              </Link>
            ))
          : null}
      </div>
    </section>
  );
};

export default CardsSection;
