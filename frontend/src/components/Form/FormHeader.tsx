import styles from "./styles.module.css";

type FormHeaderProps = {
	title: string;
	subtitle?: string;
	children?: React.ReactNode;
};

export function FormHeader({ title, subtitle, children }: FormHeaderProps) {
	if (children) {
		return <div className={styles.formHeader}>{children}</div>;
	}

	return (
		<div className={styles.formHeader}>
			<h2 className={styles.formTitle}>{title}</h2>
			{subtitle && <p className={styles.formSubtitle}>{subtitle}</p>}
		</div>
	);
}
