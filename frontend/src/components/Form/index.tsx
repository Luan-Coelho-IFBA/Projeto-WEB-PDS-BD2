import { FormButton } from "./FormButton";
import { FormField } from "./FormField";
import { FormHeader } from "./FormHeader";

import styles from "./styles.module.css";

type FormProps = {
	children: React.ReactNode;
} & React.ComponentProps<"form">;

export function Form({ children, ...formProps }: FormProps) {
	return <form className={styles.formGroup} {...formProps}>{children}</form>;
}

Form.Header = FormHeader;
Form.Field = FormField;
Form.Button = FormButton;
