import styles from "./Loader.module.css";

export function Loader(props: { text?: string }) {
  return (
    <div className="flex-center text-center w-full h-full">
      <div className="grid grid-cols-1">
        <div className={styles.loader}>
          <div className={`${styles.loaderItem} ${styles.a}`}></div>
          <div className={`${styles.loaderItem} ${styles.b}`}></div>
          <div className={`${styles.loaderItem} ${styles.c}`}></div>
          <div className={`${styles.loaderItem} ${styles.d}`}></div>
        </div>
        <div className="mt-8 text-[#bbb] text-sm">{props.text}</div>
      </div>
    </div>
  );
}
