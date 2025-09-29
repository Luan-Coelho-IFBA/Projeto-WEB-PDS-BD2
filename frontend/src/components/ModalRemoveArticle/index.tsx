import { useState } from "react";
import { Article } from "../../types/Article";

import styles from "./styles.module.css";
import { removeArticle } from "../../services/articles/removeArticle";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../server/types";
import { Modal } from "../Modal";
import { notify } from "../../adapters/toastHotAdapter";

type ModalRemoveCategoryProps = {
    article: Article;
    isOpen: boolean;
    refetchMyArticles?: () => void;
    handleModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ModalRemoveArticle({
    article,
    isOpen,
    handleModal,
    refetchMyArticles,
}: ModalRemoveCategoryProps) {
    const [removeError, setRemoveError] = useState<undefined | string>();
    const [isLoadingRemove, setIsLoadingRemove] = useState(false);
    const [isRemoveSucess, setIsRemoveSucess] = useState(false);

    async function removeArticleFn() {
        try {
            setIsLoadingRemove(true);
            await removeArticle(article.id).then(() => {
                setIsLoadingRemove(false);
            });
            setIsRemoveSucess(true);
            setRemoveError(undefined);
            refetchMyArticles?.();
            notify.sucess("Seu artigo foi removido.");
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
            <Modal.Header title="Remover Artigo" />
            <Modal.BodyText>
                <p>Você tem certeza que deseja remover o seguinte artigo:</p>
                <p>
                    Titulo:<strong>"{article.title}"</strong>
                </p>
                <p>
                    Subtitulo: <strong>"{article.subtitle}"</strong>
                </p>
                <p>
                    Essa ação não possui volta, todas as interações feitas nesse
                    artigo também serão perdidas
                </p>
                {removeError && (
                    <p className={styles.errorMessage}>{removeError}</p>
                )}
            </Modal.BodyText>
            <Modal.Actions>
                <button
                    className={`${styles.buttonActionModal} ${styles.cancel}`}
                    onClick={() => {
                        if (isRemoveSucess) {
                            handleModal((prev) => !prev);
                            refetchMyArticles?.();
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
                        onClick={removeArticleFn}
                    >
                        {"Remover Artigo"}
                    </button>
                )}
            </Modal.Actions>
        </Modal>
    );
}
