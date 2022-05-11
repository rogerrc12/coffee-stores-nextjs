import styles from "./banner.module.css";

export const Banner = ({ onFind, findText }) => {
  return (
    <header className={styles.container}>
      <h1 className={styles.title}>
        Coffee <span>shops</span>
      </h1>
      <p className={styles.subtitle}>Descubre coffee shops en tu área</p>
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={onFind}>
          {findText}
        </button>
      </div>
    </header>
  );
};
