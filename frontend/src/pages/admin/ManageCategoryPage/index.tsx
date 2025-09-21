import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

import styles from "./styles.module.css";
import { getAllCategories } from "../../../services/categories/getAllCategories";
import { useQuery } from "@tanstack/react-query";
import { errorFetchingData } from "../../../constants/textContent";

export function ManageCategoryPage() {
    const { data, isSuccess, isError, isLoading, refetch } = useQuery({
        queryKey: ["categoryAdmin"],
        queryFn: getAllCategories,
        retry: 2,
        staleTime: 2 * 60 * 1000,
    });

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <DefaultLayout className={styles.generalContainer}>
            <main className={styles.sectionContainer}>
                <h2 className={styles.title}>
                    Gerenciar categorias existentes
                </h2>
                <div className={styles.addCategory}>
                    <PlusIcon className={styles.addIcon} />
                    <span>Adicionar Categoria</span>
                </div>

                <div className={styles.tableContainer}>
                    {isSuccess && data.categories.length === 0 && (
                        <div className={styles.feedbackMessage}>
                            <p>
                                Nenhuma categoria registrada. Clique em
                                adicionar categoria para criar uma nova
                            </p>
                        </div>
                    )}
                    {isSuccess && data.categories.length > 0 && (
                        <table className={styles.tableList}>
                            <thead>
                                <tr>
                                    <th>Nome da Categoria</th>
                                    <th>ID da Categoria</th>
                                    <th>Data de Criação</th>
                                    <th>Editar</th>
                                    <th>Remover</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.categories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className={styles.tableLineData}
                                    >
                                        <td>
                                            <span>{category.name}</span>
                                        </td>
                                        <td>
                                            <span>{category.id}</span>
                                        </td>
                                        <td>
                                            <span>
                                                {formatDate(category.createdAt)}
                                            </span>
                                        </td>
                                        <td className={styles.iconAction}>
                                            <PencilIcon />
                                            <span>Alterar Categoria</span>
                                        </td>
                                        <td className={styles.iconAction}>
                                            <TrashIcon color="red" />
                                            <span>Remover Categoria</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {isError && (
                        <div className={styles.feedbackMessage}>
                            <p className={styles.error}>{errorFetchingData}</p>
                            <button
                                className={styles.error}
                                onClick={() => refetch()}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}
                    {isLoading && (
                        <div className={styles.feedbackMessage}>
                            <p>Carregando conteúdo, aguarde...</p>
                        </div>
                    )}
                </div>
            </main>
        </DefaultLayout>
    );
}
