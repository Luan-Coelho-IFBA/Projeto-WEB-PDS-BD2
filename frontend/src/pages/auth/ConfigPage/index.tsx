import { LoaderIcon, UserIcon } from "lucide-react";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../../services/auth/getMe";
import { getLocalStorageRole } from "../../../utils/getLocalStorageRole";
import { getLocalStorageToken } from "../../../utils/getLocalStorageToken";
import { getRoleIcon, getTextFromRoleName } from "./roleInteractions";
import { ConfigPageActions } from "./ConfigPageActions";
import { ConfigPageForm } from "./ConfigPageForm";

import styles from "./styles.module.css";
import { RouterLink } from "../../../components/RouterLink";
import { PageRoutesName } from "../../../constants/PageRoutesName";

ConfigPage.Form = ConfigPageForm;
ConfigPage.Actions = ConfigPageActions;

export function ConfigPage() {
    const { data: user, isLoading } = useQuery({
        queryKey: ["myUserQuery"],
        queryFn: getMe,
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
                        Crie sua conta na pagina de{" "}
                        <RouterLink href={PageRoutesName.auth.register}>
                            cadastro
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

                {/* area com icone do usuario */}
                <section className={styles.profileSection}>
                    <div className={styles.userPhotoContainer}>
                        <UserIcon className={styles.userPhotoSection} />
                    </div>

                    {isLoading && <LoaderIcon />}

                    {user && (
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
                    )}
                </section>
                <ConfigPage.Form />
                <ConfigPage.Actions />
            </main>
        </DefaultLayout>
    );
}
