import { ArrowRightIcon, UserIcon } from "lucide-react";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

import styles from "./styles.module.css";
import { useState } from "react";
import { ModalChangePassword } from "../../../components/ModalChangePassword";

export function ConfigPage() {
    const [modalChangePassword, setModalChangePassword] =
        useState<boolean>(false);

    return (
        <DefaultLayout>
            <main className={styles.mainSection}>
                <h2 className={styles.titleSection}>Configurações</h2>

                <UserIcon className={styles.userPhotoSection} />

                <section className={styles.inputSections}>
                    <div className={styles.inputSectionRow}>
                        <label htmlFor="changeName">Alterar Nome</label>
                        <div className={styles.changeNameArea}>
                            <input
                                type="text"
                                id="changeName"
                                placeholder="Informe o seu nome completo"
                            />
                            <button className={styles.changeNameButton}>
                                Alterar nome
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputSectionRow}>
                        <div
                            onClick={() =>
                                setModalChangePassword((prev) => !prev)
                            }
                            className={styles.changePasswordButton}
                        >
                            <span>Alterar Senha</span>
                            <ArrowRightIcon
                                className={styles.iconChangePassword}
                            />
                        </div>
                    </div>
                    {modalChangePassword && (
                        <ModalChangePassword
                            titleModal="Alterar senha"
                            subtitleModal="Informe a nova senha que deseja alterar"
                            isOpen={modalChangePassword}
                            onClose={() =>
                                setModalChangePassword((prev) => !prev)
                            }
                        />
                    )}
                </section>
            </main>
        </DefaultLayout>
    );
}
