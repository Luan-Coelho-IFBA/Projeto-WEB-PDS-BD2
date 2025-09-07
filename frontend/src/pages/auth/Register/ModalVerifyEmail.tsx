import { useState } from "react";
import { Modal } from "../../../components/Modal";
import { resendEmail } from "../../../services/resendEmail";

import styles from "./styles.module.css";

type ModalVerifyEmailProps = {
	email: string;
};

export function ModalVerifyEmail({ email }: ModalVerifyEmailProps) {
	const [isOpen, setIsOpen] = useState(true);

	function handleModal() {
		setIsOpen((isOpen) => !isOpen);
	}

	if (isOpen) {
		{
			console.log(`Modal abriu, email: ${email}`);
		}
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
							/* const response =  */ await resendEmail({
								email: email,
							});
							/* console.log(response); */
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
