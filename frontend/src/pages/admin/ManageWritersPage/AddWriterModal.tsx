import { useQuery } from "@tanstack/react-query";
import { Modal } from "../../../components/Modal";
import { getReaders } from "../../../services/auth/getReaders";
import { useState } from "react";
import { Loader } from "../../../components/Loader";

import styles from "./styles.module.css";
import { ApiResponseUser } from "../../../services/auth/getWriters";
import { changeToWriter } from "../../../services/role/changeToWriter";
import { notify } from "../../../adapters/toastHotAdapter";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../../server/types";

type AddWriterModalProps = {
    isOpen: boolean;
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>;
    refetchWritersTable: () => void;
};

export function AddWriterModal({
    closeHandler,
    isOpen: modalOpen,
    refetchWritersTable,
}: AddWriterModalProps) {
    const [filter, setFilter] = useState("");

    const [selectedReader, setSelectedReader] = useState<ApiResponseUser>();
    const [modalConfirm, setModalConfirm] = useState(false);

    const getReadersQuery = useQuery({
        queryKey: ["getReaders"],
        queryFn: () => getReaders(),
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    const onConfirmar = async () => {
        if (selectedReader?.id == undefined) return;
        try {
            await changeToWriter(selectedReader?.id);
            notify.sucess("Jornalista adicionado com sucesso!");
            setModalConfirm(false);
            closeHandler(false);
            refetchWritersTable();
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            console.log(axiosError);
        }
    };

    return (
        <Modal
            closeButton={false}
            isOpen={modalOpen}
            closeHandler={() => closeHandler((prev) => !prev)}
        >
            <Modal.Header title="Adicionar Jornalista" />
            <Modal.Subtitle subtitle="Insira o nome do leitor que deseja adicionar como jornalista " />
            <Modal.BodyText>
                <input
                    placeholder="Buscar leitor por nome..."
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <div className={styles.readers}>
                    {getReadersQuery.isLoading && (
                        <Loader direction="column">
                            <Loader.TextMessage
                                color="black"
                                feedbackMessage="Carregando leitores"
                            />
                            <Loader.Icon />
                        </Loader>
                    )}
                    {getReadersQuery.data
                        ?.filter((r) => r.name.includes(filter))
                        .map((r) => (
                            <span
                                className={styles.reader}
                                key={r.id}
                                onClick={() => {
                                    setSelectedReader(r);
                                    setModalConfirm((prev) => !prev);
                                }}
                            >
                                <p>{r.name}</p>
                            </span>
                        ))}
                </div>
                <Modal.Actions>
                    <button
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={() => closeHandler((prev) => !prev)}
                    >
                        Cancelar
                    </button>
                </Modal.Actions>
            </Modal.BodyText>

            {modalConfirm && (
                <Modal
                    isOpen={modalConfirm}
                    closeButton
                    closeHandler={() => setModalConfirm((prev) => !prev)}
                >
                    <Modal.Header title="Confirmação" />
                    <Modal.BodyText>
                        <p>Você tem certeza que deseja adicionar o leitor:</p>
                        <p>
                            Leitor: <strong>"{selectedReader?.name}"</strong>
                        </p>
                        <p>
                            Email: "<strong>{selectedReader?.email}</strong>"{" "}
                        </p>
                    </Modal.BodyText>
                    <Modal.Actions>
                        <button className={styles.button} onClick={onConfirmar}>
                            Confirmar
                        </button>
                    </Modal.Actions>
                </Modal>
            )}
        </Modal>
    );
}
