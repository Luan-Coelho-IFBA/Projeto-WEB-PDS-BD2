import { useState } from "react";
import { RouterLink } from "../RouterLink";

import styles from "./styles.module.css";
import { MenuIcon, SearchIcon } from "lucide-react";
import { applicationName } from "../../constants/textContent";
import { Menu } from "../Menu";
import { getLocalStorageRole } from "../../utils/getLocalStorageRole";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const role = getLocalStorageRole();

    const isAdmin = role == "ADMIN";
    const isJornalista = role == "JORNALISTA";

    const handleMenuClick = () => {
        setIsMenuOpen((isopen) => !isopen);
    };

    return (
        <>
            <header className={styles.header}>
                <nav className={styles.container}>
                    <div onClick={handleMenuClick} className={styles.menu}>
                        <MenuIcon size={32} />
                        <span>MENU</span>
                    </div>

                    <div className={styles.title}>
                        <h1>{applicationName}</h1>
                    </div>
                    <div className={styles.rightSide}>
                        <div className={styles.containerLinks}>
                            {isAdmin && (
                                <RouterLink href="" className={styles.itemLink}>
                                    <span>Jornalistas</span>
                                </RouterLink>
                            )}

                            {(isAdmin || isJornalista) && (
                                <RouterLink href="" className={styles.itemLink}>
                                    <span>Meus Artigos</span>
                                </RouterLink>
                            )}
                        </div>
                        <div className={styles.searchContainer}>
                            <SearchIcon className={styles.searchIcon} />

                            <input
                                className={styles.searchInput}
                                type="search"
                                placeholder="Pesquisar"
                            />
                        </div>
                    </div>
                </nav>
            </header>

            {/* Menu renderizado fora do header para evitar conflitos de evento */}
            {isMenuOpen && (
                <Menu isOpen={isMenuOpen} handlerCloseMenu={setIsMenuOpen} />
            )}
        </>
    );
}
