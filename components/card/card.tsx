import React, { FC, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import classNames from "classnames";
import styles from "./card.module.css";

type CardProps = {
  imgUrl: string;
  size: CardSizeType;
  id?: number;
};

export type CardSizeType = "small" | "large" | "medium";

const Card: FC<CardProps> = ({ imgUrl, size = "medium", id }) => {
  const [imgSrc, setImgSrc] = useState(imgUrl);
  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleImageError = () => {
    setImgSrc(
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80"
    );
  };
  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
  return (
    <div className={styles.container}>
      <motion.div
        whileHover={{ ...scale }}
        className={classNames(styles.imgMotionWrapper, classMap[size])}
      >
        <Image
          onError={handleImageError}
          src={imgSrc}
          alt="card image"
          fill
          className={styles.cardImg}
        />
      </motion.div>
    </div>
  );
};

export default Card;
