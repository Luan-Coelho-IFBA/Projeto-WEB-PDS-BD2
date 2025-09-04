import { InputField } from "../InputField";
import styles from "./styles.module.css";

type FormFieldProps = {
	placeholder: string;
	type: React.HTMLInputTypeAttribute;
	nameInput: string;
	label?: string;
	children?: React.ReactNode;
} & React.ComponentProps<"input">;

export function FormField({
	children,
	type,
	nameInput,
	placeholder,
	label,
	...rest
}: FormFieldProps) {
	if (children) {
		return <div className={styles.formRow}>{children}</div>;
	}

	return (
		<div className={styles.formRow}>
			<label htmlFor={nameInput}>{label}</label>
			<InputField
				id={nameInput}
				type={type}
				placeholder={placeholder}
				{...rest}
			/>
		</div>
	);
}
