import type { MouseEventHandler } from "react";
import styles from "./styles.module.css";

type ModalActionProps = {
	onClickHandler: MouseEventHandler<HTMLButtonElement>;
	nameButton: string;
	variant: "confirm" | "cancel";
};

export function ModalAction({
	onClickHandler,
	nameButton,
	variant,
}: ModalActionProps) {
	return (
		<button
			onClick={onClickHandler}
			className={`${styles.actionButton} ${styles[variant]}`}
		>
			{nameButton}
		</button>
	);
}
