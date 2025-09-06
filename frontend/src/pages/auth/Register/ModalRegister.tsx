import { useState } from "react";
import { Modal } from "../../../components/Modal";
import { resendEmail } from "../../../services/resendEmail";

import styles from "./styles.module.css";

export function ModalVerifyEmail() {
	const [isOpen, setIsOpen] = useState(true);

	function handleModal() {
		setIsOpen((isOpen) => !isOpen);
	}

	if (isOpen) {
		return (
			<Modal isOpen={isOpen} closeHandler={handleModal}>
				<Modal.Header title="Verifique o seu email" />
				<Modal.BodyText>
					<p>
						Cheque a sua caixa de entrada do email cadastrado para
						autenticar o seu email
					</p>
					<p
						onClick={async () => {
							const response = await resendEmail();
							console.log(response);
						}}
						className={styles.resendEmailLink}
					>
						Reenviar Email
					</p>
				</Modal.BodyText>
				<Modal.Actions>
					<Modal.Action
						nameButton="Fechar"
						variant="confirm"
						onClickHandler={handleModal}
					/>
				</Modal.Actions>
			</Modal>
		);
	}
}
