import styles from "./styles.module.css";

type FormButtonProps = {
	nameButton?: string;
	onClick?: () => void;
	children?: React.ReactNode;
	className?: string;
};

export function FormButton({
	children,
	nameButton,
	onClick,
	className,
}: FormButtonProps) {
	if (children) {
		return (
			<div className={`${styles.formRow} ${className || ""}`}>
				{children}
			</div>
		);
	}

	if (!nameButton || !onClick) {
		console.warn(
			"FormButton: nameButton e onClick são obrigatórios quando children não é fornecido"
		);
		return;
	}

	return (
		<div className={`${styles.formRow} ${className || ""}`}>
			<input
				type="button"
				onClick={onClick}
				className={styles.defaultButton}
				value={nameButton}
			></input>
		</div>
	);
}
