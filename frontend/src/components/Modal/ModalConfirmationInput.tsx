import { RouterLink } from "../RouterLink";

import styles from "./styles.module.css";

type ModalConfirmationInputProps = {
	reSendConfirmationCode?: string;
	placeholderInput: string;
} & React.ComponentProps<"input">;

export function ModalConfirmationInput({
	reSendConfirmationCode,
	placeholderInput,
	...rest
}: ModalConfirmationInputProps) {
	return (
		<div className={styles.containerBodyModal}>
			<input
				className={styles.inputConfirmation}
				type="text"
				placeholder={placeholderInput}
				{...rest}
			/>
			{reSendConfirmationCode && (
				<RouterLink className={styles.link} href="">
					{reSendConfirmationCode}
				</RouterLink>
			)}
		</div>
	);
}
