import { useQuery } from "@tanstack/react-query";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import { getLocalStorageRole } from "../../../utils/getLocalStorageRole";
import { getLocalStorageToken } from "../../../utils/getLocalStorageToken";
import { ConfigPageActions } from "./ConfigPageActions";
import { ConfigPageForm } from "./ConfigPageForm";
import { getMe } from "../../../services/auth/getMe";

import styles from "./styles.module.css";
import { UserIcon } from "lucide-react";
import { RouterLink } from "../../../components/RouterLink";
import { PageRoutesName } from "../../../constants/PageRoutesName";
import { getRoleIcon, getTextFromRoleName } from "./roleInteractions";
import { Loader } from "../../../components/Loader";

ConfigPage.Form = ConfigPageForm;
ConfigPage.Actions = ConfigPageActions;

export function ConfigPage() {
    const {
        data: user,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["myUserQuery"],
        queryFn: getMe,
        retry: 2,
        gcTime: 0,
    });

    if (!getLocalStorageRole() || !getLocalStorageToken()) {
        return (
            <DefaultLayout>
                <main className={styles.mainSection}>
                    <h2 className={styles.titleSection}>Configurações</h2>
                    <section className={styles.profileSection}>
                        <div className={styles.userPhotoContainer}>
                            <UserIcon className={styles.userPhotoSection} />
                        </div>
                        <div className={styles.userInfo}>
                            <h3 className={styles.userName}>
                                Usuario sem conta
                            </h3>
                            <div className={styles.userRole}>
                                {getRoleIcon("")}
                                <span className={styles.roleName}>
                                    {getTextFromRoleName("")}
                                </span>
                            </div>
                        </div>
                    </section>
                    <p>
                        Faça login na conta na pagina de{" "}
                        <RouterLink href={PageRoutesName.auth.login}>
                            login
                        </RouterLink>
                    </p>
                </main>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <main className={styles.mainSection}>
                <h2 className={styles.titleSection}>Configurações</h2>

                <section className={styles.profileSection}>
                    <div className={styles.userPhotoContainer}>
                        <UserIcon className={styles.userPhotoSection} />
                    </div>

                    {isLoading ? (
                        <Loader
                            /* color="black" */
                            textMessage="Carregando dados do usuário..."
                            direction="column"
                        />
                    ) : user ? (
                        <div className={styles.userInfo}>
                            <h3 className={styles.userName}>{user.name}</h3>
                            <p className={styles.userName}>{user.email}</p>
                            <div className={styles.userRole}>
                                {getRoleIcon(user.role)}
                                <span className={styles.roleName}>
                                    {getTextFromRoleName(user.role)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.loadingSection}>
                            <span>Erro ao carregar dados do usuário</span>
                        </div>
                    )}
                </section>

                {/* Só mostrar os formulários quando não estiver carregando */}
                {!isLoading && user && (
                    <>
                        <ConfigPage.Form refetchUserData={refetch} />
                        <ConfigPage.Actions />
                    </>
                )}
            </main>
        </DefaultLayout>
    );
}
