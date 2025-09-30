import { useState } from "react";
import { Modal } from "../../../components/Modal";
import { ApiResponseUser } from "../../../services/auth/getWriters";
import { changeToReader } from "../../../services/role/changeToReader";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../../server/types";
import { Loader } from "../../../components/Loader";

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<string | undefined>();

    async function removeWriterFn() {
        setIsLoading(true);
        try {
            await changeToReader(selectedWriter.id);
            setIsLoading(false);
            refetchWriters();
            setModalRemoveWriter(false);
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            setIsError(axiosError.response?.data.message);
        }
    }

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
                {isError && <p style={{ color: "red" }}>{isError}</p>}
            </Modal.BodyText>
            <Modal.Actions>
                <button onClick={() => setModalRemoveWriter((prev) => !prev)}>
                    Cancelar
                </button>
                <button disabled={isLoading} onClick={removeWriterFn}>
                    {isLoading && (
                        <Loader direction="row">
                            <Loader.TextMessage
                                color="white"
                                feedbackMessage="Removendo..."
                            />
                            <Loader.Icon />
                        </Loader>
                    )}
                </button>
            </Modal.Actions>
        </Modal>
    );
}
