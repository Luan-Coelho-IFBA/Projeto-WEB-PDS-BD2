import { ArrowRightIcon, LogOutIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { ModalChangePassword } from "../../../components/ModalChangePassword";
import { Modal } from "../../../components/Modal";
import { deleteUser } from "../../../services/auth/deleteUser";
import { removeUserDataLocalStorage } from "../../../utils/removeUserData";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../server/types";
import { useNavigate } from "react-router";
import { PageRoutesName } from "../../../constants/PageRoutesName";

import styles from "./styles.module.css";

export function ConfigPageActions() {
    const [modalChangePassword, setModalChangePassword] =
        useState<boolean>(false);
    const [modalLogout, setModalLogout] = useState<boolean>(false);
    const [modalRemoveAccount, setModalRemoveAccount] =
        useState<boolean>(false);

    const [removeError, setRemoveError] = useState<undefined | string>();
    const [isLoadingRemove, setIsLoadingRemove] = useState(false);
    const [isRemoveSucess, setIsRemoveSucess] = useState(false);

    const navigate = useNavigate();

    function loggoutAccount() {
        removeUserDataLocalStorage();
        navigate(PageRoutesName.auth.login);
    }

    async function removeAccount() {
        try {
            setIsLoadingRemove(true);
            await deleteUser().then(() => {
                setIsLoadingRemove(false);
            });
            setIsRemoveSucess(true);
            setRemoveError(undefined);
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            setRemoveError(axiosError.response?.data.message);
        }
    }

    return (
        <section className={styles.actionSection}>
            <div
                onClick={() => setModalChangePassword((prev) => !prev)}
                className={`${styles.actionDiv} ${styles.changePasswordButton}`}
            >
                <span>Alterar Senha</span>
                <ArrowRightIcon className={styles.iconChangePassword} />
            </div>

            {modalChangePassword && (
                <ModalChangePassword
                    titleModal="Alterar senha"
                    subtitleModal="Informe a nova senha que deseja alterar"
                    isOpen={modalChangePassword}
                    onClose={() => setModalChangePassword((prev) => !prev)}
                />
            )}
            <div
                onClick={() => setModalLogout((prev) => !prev)}
                className={`${styles.actionDiv} ${styles.logout}`}
            >
                <span>Deslogar</span>
                <LogOutIcon className={styles.icon} />
            </div>

            {modalLogout && (
                <Modal
                    isOpen={modalLogout}
                    closeHandler={() => setModalLogout((prev) => !prev)}
                >
                    <Modal.Header title="Deslogar conta" />
                    <Modal.Subtitle subtitle="Tem certeza que deseja deslogar da sua conta?" />
                    <Modal.Actions>
                        <button
                            className={`${styles.buttonActionModal} ${styles.logout}`}
                            onClick={() => setModalLogout((prev) => !prev)}
                        >
                            Cancelar
                        </button>
                        <button
                            className={`${styles.buttonActionModal} ${styles.logoutModalButton}`}
                            onClick={loggoutAccount}
                        >
                            Deslogar
                        </button>
                    </Modal.Actions>
                </Modal>
            )}
            <div
                onClick={() => setModalRemoveAccount((prev) => !prev)}
                className={`${styles.actionDiv} ${styles.remove}`}
            >
                <span>Apagar conta</span>
                <Trash2Icon className={styles.icon} />
            </div>

            {modalRemoveAccount && (
                <Modal
                    isOpen={modalRemoveAccount}
                    closeHandler={() => setModalRemoveAccount((prev) => !prev)}
                >
                    <Modal.Header title="APAGAR CONTA" />
                    <Modal.Subtitle subtitle="Tem certeza que deseja deslogar da sua conta?" />
                    <Modal.BodyText>
                        <p>Essa ação não possui volta.</p>
                        {removeError && (
                            <p className={styles.errorMessage}>{removeError}</p>
                        )}
                        {isRemoveSucess && (
                            <p className={styles.sucessMessage}>
                                Conta excluida com sucesso
                            </p>
                        )}
                    </Modal.BodyText>
                    <Modal.Actions>
                        <button
                            className={`${styles.buttonActionModal} ${styles.logout}`}
                            onClick={() => {
                                if (isRemoveSucess) {
                                    setModalRemoveAccount((prev) => !prev);
                                    navigate(PageRoutesName.auth.login);
                                }
                                setModalRemoveAccount((prev) => !prev);
                            }}
                        >
                            {isRemoveSucess ? "Sair" : "Cancelar"}
                        </button>
                        {!isRemoveSucess && (
                            <button
                                disabled={
                                    isLoadingRemove || isRemoveSucess
                                        ? true
                                        : false
                                }
                                className={`${styles.buttonActionModal} ${styles.remove}`}
                                onClick={removeAccount}
                            >
                                {"Excluir Conta"}
                            </button>
                        )}
                    </Modal.Actions>
                </Modal>
            )}
        </section>
    );
}
