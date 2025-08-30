import { RouterLink } from "../../components/RouterLink";
import { RoutesName } from "../../components/routes/RoutesName";

import styles from './styles.module.css'

export function LandingPage() {
	return (
		<div className={styles.container}>
			<h1>Landing Page</h1>
			<p>Bem-vindo ao nosso site!</p>

			<nav className={styles.menu}>
				<RouterLink href={RoutesName.login}>Fazer Login</RouterLink>
				<RouterLink href={RoutesName.register}>Criar Conta</RouterLink>
				<RouterLink href={RoutesName.home}>Ir para Home</RouterLink>
			</nav>
		</div>
	);
}
