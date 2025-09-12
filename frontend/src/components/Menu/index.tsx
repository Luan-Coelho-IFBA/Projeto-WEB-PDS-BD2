import { useState } from "react";
import styles from "./styles.module.css";
import { MenuIcon, UserCog2Icon, XIcon } from "lucide-react";
import { RouterLink } from "../RouterLink";
import { PageRoutesName } from "../../constants/PageRoutesName";

export function Menu() {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	if (isOpen)
		return (
			<div className={styles.backgroundModal}>
				<nav className={styles.containerModalMenu}>
					<XIcon
						onClick={() => setIsOpen((isopen) => !isopen)}
						className={styles.closeModal}
					/>

					<header className={styles.menuHeader}>
						<h2 className={styles.menuTitle}>MENU</h2>
					</header>

					<ul className={styles.containerList}>
						<RouterLink
							href={PageRoutesName.home}
							className={styles.item}
						>
							<span>Pagina Inicial</span>
						</RouterLink>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
						<li className={styles.item}>LOREM</li>
					</ul>

					<footer className={styles.profileContainer}>
						<RouterLink
							className={styles.link}
							href={PageRoutesName.configUser}
						>
							<UserCog2Icon size={32} />
							<span>Seu Perfil</span>
						</RouterLink>
					</footer>
				</nav>
			</div>
		);

	if (!isOpen)
		return (
			<nav
				onClick={() => setIsOpen((isopen) => !isopen)}
				className={styles.menu}
			>
				<MenuIcon />
				<span>MENU</span>
			</nav>
		);
}
