import { CircleX } from "lucide-react";
import styles from "./styles.module.css";
import { ModalHeader } from "./ModalHeader";
import { ModalSubtitle } from "./ModalSubtitle";
import { ModalConfirmationInput } from "./ModalConfirmationInput";
import { ModalActions } from "./ModalActions";
import { ModalAction } from "./ModalAction";
import { ModalBodyText } from "./ModalBodyText";

type ModalProps = {
	closeHandler: () => void;
	isOpen: boolean;
	children: React.ReactNode;
};

export function Modal({ closeHandler, isOpen, children }: ModalProps) {
	if (isOpen) {
		return (
			<div className={styles.backgroundModal}>
				<div className={styles.modal}>
					{children}

					{/* <CircleX
						width={32}
						height={32}
						onClick={closeHandler}
						className={styles.closeWindow}
					/> */}
				</div>
			</div>
		);
	}
}

Modal.Header = ModalHeader;
Modal.Subtitle = ModalSubtitle;
Modal.ConfirmationInput = ModalConfirmationInput;
Modal.Actions = ModalActions;
Modal.Action = ModalAction;
Modal.BodyText = ModalBodyText;
