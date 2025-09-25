import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

import styles from "./styles.module.css";
import { getAllCategories } from "../../../services/categories/getAllCategories";
import { useQuery } from "@tanstack/react-query";
import { errorFetchingData } from "../../../constants/textContent";
import { useState } from "react";
import { ModalAddNewCategory } from "../../../components/ModalAddNewCategory";
import { formatDate } from "../../../utils/formatDate";
import { ModalEditCategory } from "../../../components/ModalEditCategory";
import type { Category } from "../../../types/Category";
import { ModalRemoveCategory } from "../../../components/ModalRemoveCategory";

export function ManageCategoryPage() {
    const {
        data: allCategoriesQueries,
        isSuccess,
        isError,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["categoryAdmin"],
        queryFn: getAllCategories,
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    const [selectedCategoryEdit, setSelectedCategoryEdit] =
        useState<Category>();
    const [selectedCategoryRemove, setSelectedCategoryRemove] =
        useState<Category>();

    const [modalNewCategory, setModalNewCategory] = useState(false);
    const [modalEditACategory, setModalEditACategory] = useState(false);
    const [modalRemoveCategory, setModalRemoveCategory] = useState(false);

    return (
        <DefaultLayout className={styles.generalContainer}>
            <main className={styles.sectionContainer}>
                <h2 className={styles.title}>
                    Gerenciar categorias existentes
                </h2>
                <div
                    onClick={() => setModalNewCategory((prev) => !prev)}
                    className={styles.addCategory}
                >
                    <PlusIcon className={styles.addIcon} />
                    <span>Adicionar Categoria</span>
                </div>

                {/* MODAL DE ADICIONAR NOVA CATEGORIA */}
                {modalNewCategory && (
                    <ModalAddNewCategory
                        handleModal={setModalNewCategory}
                        refetchCategories={refetch}
                        isOpen={modalNewCategory}
                    />
                )}

                {selectedCategoryEdit && modalEditACategory && (
                    <ModalEditCategory
                        category={selectedCategoryEdit}
                        handleModal={setModalEditACategory}
                        refetchCategories={refetch}
                        isOpen={modalEditACategory}
                    />
                )}
                {selectedCategoryEdit && modalRemoveCategory && (
                    <ModalRemoveCategory
                        category={selectedCategoryEdit}
                        handleModal={setModalRemoveCategory}
                        refetchCategories={refetch}
                        isOpen={modalRemoveCategory}
                    />
                )}

                <div className={styles.tableContainer}>
                    {isSuccess &&
                        allCategoriesQueries.categories.length === 0 && (
                            <div className={styles.feedbackMessage}>
                                <p>
                                    Nenhuma categoria registrada. Clique em
                                    adicionar categoria para criar uma nova
                                </p>
                            </div>
                        )}
                    {isSuccess &&
                        allCategoriesQueries.categories.length > 0 && (
                            <table className={styles.tableList}>
                                <thead>
                                    <tr>
                                        <th>Nome da Categoria</th>
                                        <th>ID da Categoria</th>
                                        <th>Data de Criação</th>
                                        <th>Descrição</th>
                                        <th>Editar</th>
                                        <th>Remover</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allCategoriesQueries.categories.map(
                                        (category) => (
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
                                                        {formatDate(
                                                            category.createdAt
                                                        )}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        title={
                                                            category.description
                                                        }
                                                    >
                                                        {category.description}
                                                    </span>
                                                </td>
                                                {/* ALTERAR CATEGORIA */}
                                                <td
                                                    onClick={() => {
                                                        setSelectedCategoryEdit(
                                                            category
                                                        );
                                                        setModalEditACategory(
                                                            (prev) => !prev
                                                        );
                                                    }}
                                                    className={
                                                        styles.iconAction
                                                    }
                                                >
                                                    <PencilIcon />
                                                    <span>
                                                        Alterar Categoria
                                                    </span>
                                                </td>

                                                {/* REMOVER CATEGORIA */}
                                                <td
                                                    className={
                                                        styles.iconAction
                                                    }
                                                    onClick={() => {
                                                        setSelectedCategoryEdit(
                                                            category
                                                        );
                                                        setModalRemoveCategory(
                                                            (prev) => !prev
                                                        );
                                                    }}
                                                >
                                                    <TrashIcon color="red" />
                                                    <span>
                                                        Remover Categoria
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    )}
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
