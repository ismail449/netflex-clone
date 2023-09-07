import React, { FC } from "react";
import Card, { CardSizeType } from "../card/card";
import styles from "./cards-section.module.css";

type CardsSectionProps = {
  title: string;
  videos: { imgUrl: string }[];
  size: CardSizeType;
};

const CardsSection: FC<CardsSectionProps> = ({ title, videos, size }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.length > 0
          ? videos.map(({ imgUrl }, index) => (
              <Card key={index} id={index} imgUrl={imgUrl} size={size} />
            ))
          : null}
      </div>
    </section>
  );
};

export default CardsSection;
