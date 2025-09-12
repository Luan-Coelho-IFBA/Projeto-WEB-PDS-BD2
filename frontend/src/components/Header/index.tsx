import { useState } from "react";
import { RouterLink } from "../RouterLink";

import styles from "./styles.module.css";
import { MenuIcon, SearchIcon } from "lucide-react";
import { applicationName } from "../../constants/textContent";
import { Menu } from "../Menu";

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleMenuClick = () => {
		setIsMenuOpen((isopen) => !isopen);
	};

	return (
		<header className={styles.header}>
			<nav className={styles.container}>
				<div onClick={handleMenuClick} className={styles.menu}>
					<MenuIcon size={32} />
					<span>MENU</span>

					{isMenuOpen && <Menu />}
				</div>

				<div className={styles.rightSide}>
					<h1 className={styles.title}>{applicationName}</h1>

					<div className={styles.containerLinks}>
						<RouterLink href="" className={styles.itemLink}>
							<span>Jornalistas</span>
						</RouterLink>

						<RouterLink href="" className={styles.itemLink}>
							<span>Meus Artigos</span>
						</RouterLink>
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
	);
}
