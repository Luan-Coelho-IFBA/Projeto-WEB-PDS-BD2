import styles from "./styles.module.css";
import { UserCog2Icon, XIcon } from "lucide-react";
import { RouterLink } from "../RouterLink";
import { PageRoutesName } from "../../constants/PageRoutesName";

interface MenuProps {
	isOpen: boolean;
	handlerCloseMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Menu({ isOpen, handlerCloseMenu }: MenuProps) {
	const handleCloseMenu = () => {
		handlerCloseMenu(false);
	};

	const handleBackgroundClick = (e: React.MouseEvent) => {
		// Fechar apenas se clicar no fundo, não no conteúdo do menu
		if (e.target === e.currentTarget) {
			handleCloseMenu();
		}
	};

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
