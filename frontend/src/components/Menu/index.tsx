import styles from "./styles.module.css";
import { UserCog2Icon, XIcon } from "lucide-react";
import { RouterLink } from "../RouterLink";
import { PageRoutesName } from "../../constants/PageRoutesName";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../services/categories/getAllCategories";
import type { Category } from "../../types/Category";
import { useNavigate } from "react-router";
import { getLocalStorageRole } from "../../utils/getLocalStorageRole";

interface MenuProps {
    isOpen: boolean;
    handlerCloseMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Menu({ isOpen, handlerCloseMenu }: MenuProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();

    const role = getLocalStorageRole();
    const isAdmin = role == "ADMIN";
    const isJornalista = role == "JORNALISTA";

    const handleCloseMenu = () => {
        handlerCloseMenu(false);
    };

    const handleBackgroundClick = (e: React.MouseEvent) => {
        // Fechar ao clicar no fundo
        if (e.target === e.currentTarget) {
            handleCloseMenu();
        }
    };

    useEffect(() => {
        getAllCategories().then((data) => setCategories(data.categories));
    }, []);

    if (isOpen)
        return (
            <div
                className={styles.backgroundModal}
                onClick={handleBackgroundClick}
            >
                <nav
                    className={styles.containerModalMenu}
                    onClick={(e) => e.stopPropagation()} // Prevenir fechamento ao clicar no menu
                >
                    <XIcon
                        onClick={handleCloseMenu}
                        className={styles.closeModal}
                    />

                    <header className={styles.menuHeader}>
                        <h2 className={styles.menuTitle}>MENU</h2>
                    </header>

                    <ul className={styles.containerList}>
                        <RouterLink
                            href={PageRoutesName.home}
                            className={styles.item}
                            onClick={handleCloseMenu}
                        >
                            <span>Pagina Inicial</span>
                        </RouterLink>

                        {categories.length > 0 &&
                            categories.map((category) => (
                                <>
                                    <li
                                        key={category.id}
                                        className={styles.item}
                                        onClick={() => {
                                            navigate(
                                                `${PageRoutesName.articles.articlesByCategory}/${category.id}`
                                            );
                                            handleCloseMenu();
                                        }}
                                    >
                                        {category.name}
                                    </li>
                                </>
                            ))}
                    </ul>

                    <div
                        className={`${styles.containerList} ${styles.navigationPages}`}
                    >
                        {isAdmin && (
                            <RouterLink
                                href={PageRoutesName.admin.writers}
                                className={styles.item}
                            >
                                <span>Jornalistas</span>
                            </RouterLink>
                        )}
                        {isAdmin && (
                            <RouterLink
                                href={PageRoutesName.admin.categories}
                                className={styles.item}
                            >
                                <span>Categorias</span>
                            </RouterLink>
                        )}

                        {(isAdmin || isJornalista) && (
                            <RouterLink href="" className={styles.item}>
                                <span>Meus Artigos</span>
                            </RouterLink>
                        )}
                    </div>

                    <footer className={styles.profileContainer}>
                        <RouterLink
                            className={styles.link}
                            href={PageRoutesName.auth.configUser}
                            onClick={handleCloseMenu}
                        >
                            <UserCog2Icon size={32} />
                            <span>Seu Perfil</span>
                        </RouterLink>
                    </footer>
                </nav>
            </div>
        );
}
