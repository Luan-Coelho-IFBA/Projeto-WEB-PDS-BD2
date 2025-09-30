import { useQuery } from "@tanstack/react-query";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import { ApiResponseUser, getWriters } from "../../../services/auth/getWriters";
import styles from "./styles.module.css";
import { PlusIcon, TrashIcon } from "lucide-react";
import { AddWriterModal } from "./AddWriterModal";
import { useState } from "react";
import { RemoveWriterModal } from "./RemoveWriterModal";

ManageWritersPage.AddWriter = AddWriterModal;
ManageWritersPage.RemoveWritter = RemoveWriterModal;

export function ManageWritersPage() {
    const getWritersQuery = useQuery({
        queryKey: ["getWriters"],
        queryFn: () => getWriters(),
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    const [selectedWriter, setSelectedWriter] = useState<ApiResponseUser>();

    const [modalAddWriter, setModalAddWriter] = useState(false);
    const [modalRemoveWriter, setModalRemoveWriter] = useState(false);

    return (
        <DefaultLayout className={styles.generalContainer} authenticated>
            <main className={styles.sectionContainer}>
                <h2 className={styles.title}>Gerenciamento de jornalistas</h2>
                <div
                    onClick={() => setModalAddWriter((prev) => !prev)}
                    className={styles.addCategory}
                >
                    <PlusIcon className={styles.addIcon} />
                    <span>Adicionar Jornalista</span>
                </div>
                {modalAddWriter && (
                    <ManageWritersPage.AddWriter
                        refetchWritersTable={getWritersQuery.refetch}
                        isOpen={modalAddWriter}
                        closeHandler={setModalAddWriter}
                    />
                )}
                {selectedWriter && modalRemoveWriter && (
                    <ManageWritersPage.RemoveWritter
                        refetchWriters={getWritersQuery.refetch}
                        selectedWriter={selectedWriter}
                        isOpen={modalRemoveWriter}
                        handlerClose={setModalRemoveWriter}
                    />
                )}
                {getWritersQuery.data && getWritersQuery.data.length === 0 && (
                    <div className={styles.feedbackMessage}>
                        <p>
                            Nenhuma jornalista registrado. Clique em adicionar
                            jornalista para adicionar a lista.
                        </p>
                    </div>
                )}

                {getWritersQuery.data && getWritersQuery.data.length > 0 && (
                    <table className={styles.tableList}>
                        <thead>
                            <tr>
                                <th>Nome do Jornalista</th>
                                <th>ID do Jornalista</th>
                                <th>Remover</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getWritersQuery.data &&
                                getWritersQuery.data.length > 0 &&
                                getWritersQuery.data.map((writer) => (
                                    <tr
                                        key={writer.id}
                                        className={styles.tableLineData}
                                    >
                                        <td>
                                            <span>{writer.name}</span>
                                        </td>
                                        <td>
                                            <span>{writer.id}</span>
                                        </td>

                                        {/* REMOVER JORNALISTA */}
                                        <td
                                            className={styles.iconAction}
                                            onClick={() => {
                                                setSelectedWriter(writer);
                                                setModalRemoveWriter(
                                                    (prev) => !prev
                                                );
                                            }}
                                        >
                                            <TrashIcon color="red" />
                                            <span>Remover jornalista</span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </main>
        </DefaultLayout>
    );
}
