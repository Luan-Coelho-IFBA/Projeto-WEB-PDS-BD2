import { useState } from "react";
import { Modal } from "../../../components/Modal";
import { ModalHeader } from "../../../components/Modal/ModalHeader";

export function ModalRegister() {
	const [isOpen, setIsOpen] = useState(true);

	function handleModal() {
		setIsOpen((isOpen) => !isOpen);
	}

	if (isOpen) {
		return (
			<Modal isOpen={isOpen} closeHandler={handleModal}>
				<Modal.Header title="Verifique o seu email" />
				<Modal.BodyText contentText="Verifique a caixa de entrada do seu email cadastrado para realizar a autenticação da sua conta" />
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
