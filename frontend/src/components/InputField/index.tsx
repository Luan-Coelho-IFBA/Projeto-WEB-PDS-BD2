import { useState } from "react";
import { EyeOffIcon, EyeIcon } from "lucide-react";

import styles from "./styles.module.css";

type InputFieldProps = {
	type?: React.HTMLInputTypeAttribute;
} & React.ComponentProps<"input">;

export function InputField({ type = "text", ...props }: InputFieldProps) {
	if (type === "password") {
		const [visible, setVisible] = useState<boolean>(false);

		const isEyeVisibleDictionary = {
			true: EyeIcon,
			false: EyeOffIcon,
		};

		const EyeComponent =
			isEyeVisibleDictionary[String(visible) as "true" | "false"];

		return (
			<div className={styles.containerInput}>
				<input
					type={visible ? "text" : "password"}
					{...props}
					className={styles.input}
				/>
				<button
					type="button"
					className={styles.eyeButton}
					onClick={() => setVisible((v) => !v)}
					tabIndex={-1}
					aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
				>
					<EyeComponent size={20} />
				</button>
			</div>
		);
	} else {
		return <input type={type} {...props} className={styles.input} />;
	}
}
