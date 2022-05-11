import Link from "next/link";
import Image from "next/image";
import cls from "classnames";

import styles from "./card.module.css";

const Card = ({ name, imgUrl, href }) => {
  return (
    <Link href={href}>
      <a className={styles.cardLink}>
        <div className={cls("glass", styles.container)}>
          <h2>{name}</h2>
          <div className={styles.cardImageWrapper}>
            <Image src={imgUrl} className={styles.cardImage} width={260} height={160} alt={name} />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
