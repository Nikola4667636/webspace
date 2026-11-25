import styles from "./PageHead.module.css";

interface Props {
  title: string;
  text: string;
}

export default function PageHead({ title, text }: Props) {
  return (
    <div className={styles.head}>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
