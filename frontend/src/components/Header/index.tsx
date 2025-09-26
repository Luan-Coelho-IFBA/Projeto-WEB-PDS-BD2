import { useState } from "react";

import styles from "./styles.module.css";
import { MenuIcon, SearchIcon } from "lucide-react";
import { applicationName } from "../../constants/textContent";
import { Menu } from "../Menu";
import { createSearchParams, useLocation, useNavigate } from "react-router";
import { PageRoutesName } from "../../constants/PageRoutesName";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [search, setSearch] = useState("");
    const location = useLocation();
    const navigation = useNavigate();

    const isHomePage = location.pathname === PageRoutesName.home;

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

                    <div
                        className={styles.title}
                        onClick={() => navigation(PageRoutesName.home)}
                    >
                        <h1>{applicationName}</h1>
                    </div>

                    {isHomePage && (
                        <div className={styles.rightSide}>
                            <div className={styles.searchContainer}>
                                <input
                                    className={styles.searchInput}
                                    type="search"
                                    value={search}
                                    placeholder="Pesquisar"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <SearchIcon
                                color="white"
                                strokeWidth={"3px"}
                                className={styles.searchIcon}
                                onClick={() => {
                                    navigation({
                                        pathname:
                                            PageRoutesName.articles.search,
                                        search: createSearchParams({
                                            query: search,
                                        }).toString(),
                                    });
                                }}
                            />
                        </div>
                    )}
                </nav>
            </header>

            {isMenuOpen && (
                <Menu isOpen={isMenuOpen} handlerCloseMenu={setIsMenuOpen} />
            )}
        </>
    );
}
