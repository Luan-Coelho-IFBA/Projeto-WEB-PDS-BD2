import { RouterLink } from "../RouterLink";

import styles from "./styles.module.css";

type ModalConfirmationInputProps = {
	reSendConfirmationCode?: string;
	placeholderInput: string;
};

export function ModalConfirmationInput({
	reSendConfirmationCode,
	placeholderInput,
}: ModalConfirmationInputProps) {
	return (
		<div className={styles.containerBodyModal}>
			<input
				className={styles.inputConfirmation}
				type="text"
				placeholder={placeholderInput}
			/>
			{reSendConfirmationCode && (
				<RouterLink className={styles.link} href="">
					{reSendConfirmationCode}
				</RouterLink>
			)}
		</div>
	);
}
