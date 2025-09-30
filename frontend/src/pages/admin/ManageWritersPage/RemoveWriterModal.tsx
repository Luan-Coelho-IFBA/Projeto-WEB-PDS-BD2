import { Modal } from "../../../components/Modal";
import { ApiResponseUser } from "../../../services/auth/getWriters";

type RemoveWriterModalProps = {
    selectedWriter: ApiResponseUser;
    isOpen: boolean;
    handlerClose: React.Dispatch<React.SetStateAction<boolean>>;
    refetchWriters: () => void;
};

export function RemoveWriterModal({
    selectedWriter,
    handlerClose: setModalRemoveWriter,
    isOpen: modalRemoveWriter,
    refetchWriters,
}: RemoveWriterModalProps) {
    return (
        <Modal
            isOpen={modalRemoveWriter}
            closeHandler={() => setModalRemoveWriter((prev) => !prev)}
        >
            <Modal.Header title="Remover Jornalista" />
            <Modal.BodyText>
                <p>
                    {`Tem certeza que deseja remover o jornalista "${selectedWriter.name}"`}
                </p>
            </Modal.BodyText>
            <Modal.Actions>
                <button>Cancelar</button>
                <button onClick={() => {}}>Remover</button>
            </Modal.Actions>
        </Modal>
    );
}
