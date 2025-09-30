import { useQuery } from "@tanstack/react-query";
import { Modal } from "../../../components/Modal";
import { getReaders } from "../../../services/auth/getReaders";
import { useState } from "react";
import { Loader } from "../../../components/Loader";

import styles from "./styles.module.css";

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

    const [modalConfirm, setModalConfirm] = useState(false);

    const getReadersQuery = useQuery({
        queryKey: ["getReaders"],
        queryFn: () => getReaders(),
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

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
                            <>
                                <span
                                    className={styles.reader}
                                    key={r.id}
                                    onClick={() => {
                                        setModalConfirm((prev) => !prev);
                                    }}
                                >
                                    <p>{r.name}</p>
                                </span>
                            </>
                        ))}
                </div>
                <Modal.Actions>
                    <button onClick={() => closeHandler((prev) => !prev)}>
                        Cancelar
                    </button>
                </Modal.Actions>
            </Modal.BodyText>
            
            {modalConfirm && (
                <Modal 
                isOpen={modalConfirm}
                closeHandler={()=>setModalConfirm(prev=>!prev)}>
                    <Modal.Header title="Confirmação"/>
                    <Modal.BodyText>
                        <p>Você tem certeza que deseja adicionar esse leitor </p>
                    </Modal.BodyText>
                </Modal>
            )}
        </Modal>
    );
}
