import type { Category } from "../../types/Category";
import { Modal } from "../Modal";
import { removeCategory } from "../../services/categories/removeCategory";
import { useState } from "react";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../server/types";

import styles from "./styles.module.css";

type ModalRemoveCategoryProps = {
    category: Category;
    isOpen: boolean;
    refetchCategories?: () => void;
    handleModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ModalRemoveCategory({
    category,
    isOpen,
    handleModal,
    refetchCategories,
}: ModalRemoveCategoryProps) {
    const [removeError, setRemoveError] = useState<undefined | string>();
    const [isLoadingRemove, setIsLoadingRemove] = useState(false);
    const [isRemoveSucess, setIsRemoveSucess] = useState(false);

    async function removeCategoryFn() {
        try {
            setIsLoadingRemove(true);
            await removeCategory(category.id).then(() => {
                setIsLoadingRemove(false);
            });
            setIsRemoveSucess(true);
            setRemoveError(undefined);
            refetchCategories?.();
            handleModal((prev) => !prev);
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            setRemoveError(axiosError.response?.data.message);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            closeHandler={() => handleModal((prev) => !prev)}
        >
            <Modal.Header title="REMOVER CATEGORIA" />
            <Modal.Subtitle
                subtitle={`Tem certeza que deseja remover a categoria "${category.name}" ?`}
            />
            <Modal.BodyText>
                <p>Essa ação não possui volta.</p>
                {removeError && (
                    <p className={styles.errorMessage}>{removeError}</p>
                )}
                {isRemoveSucess && (
                    <p className={styles.sucessMessage}>
                        Categoria excluida com sucesso
                    </p>
                )}
            </Modal.BodyText>
            <Modal.Actions>
                <button
                    className={`${styles.buttonActionModal} ${styles.cancel}`}
                    onClick={() => {
                        if (isRemoveSucess) {
                            handleModal((prev) => !prev);
                            refetchCategories?.();
                        }
                        handleModal((prev) => !prev);
                    }}
                >
                    {isRemoveSucess ? "Sair" : "Cancelar"}
                </button>
                {!isRemoveSucess && (
                    <button
                        disabled={
                            isLoadingRemove || isRemoveSucess ? true : false
                        }
                        className={`${styles.buttonActionModal} ${styles.remove}`}
                        onClick={removeCategoryFn}
                    >
                        {"Remover categoria"}
                    </button>
                )}
            </Modal.Actions>
        </Modal>
    );
}
