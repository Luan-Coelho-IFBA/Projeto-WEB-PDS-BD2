import type React from "react";
import styles from "./styles.module.css";

type ModalBodyTextProps = {
	children: React.ReactNode;
};

export function ModalBodyText({ children }: ModalBodyTextProps) {
	return <div className={styles.containerBodyModal}>{children}</div>;
}
