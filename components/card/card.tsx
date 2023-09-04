import React, { FC, useState } from "react";
import Image from "next/image";
import styles from "./card.module.css";

type CardProps = {
  imgUrl: string;
  size: "large" | "medium" | "small";
};

const Card: FC<CardProps> = ({ imgUrl, size = "medium" }) => {
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
  return (
    <div className={styles.container}>
      <div className={classMap[size]}>
        <Image
          onError={handleImageError}
          src={imgSrc}
          alt="card image"
          fill
          className={styles.cardImg}
        />
      </div>
    </div>
  );
};

export default Card;
