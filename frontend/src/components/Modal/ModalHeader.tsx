import styles from "./styles.module.css";

type ModalHeaderProps = {
	title: string;
};

export function ModalHeader({ title }: ModalHeaderProps) {
	return <h1 className={styles.header}>{title}</h1>;
}
