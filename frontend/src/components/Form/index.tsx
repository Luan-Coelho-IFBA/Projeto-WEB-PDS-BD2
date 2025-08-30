import { FormButton } from "./FormButton";
import { FormField } from "./FormField";
import { FormHeader } from "./FormHeader";

import styles from "./styles.module.css";

type FormProps = {
	children: React.ReactNode;
};

export function Form({ children }: FormProps) {
	return <div className={styles.formGroup}>{children}</div>;
}

Form.Header = FormHeader;
Form.Field = FormField;
Form.Button = FormButton;
