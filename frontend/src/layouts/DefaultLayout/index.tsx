import { Header } from "../../components/Header";

import styles from "./styles.module.css";

type DefaultLayoutProps = {
	children: React.ReactNode;
};

export function DefaultLayout({ children }: DefaultLayoutProps) {
	return (
		<div className={styles.container}>
			<Header />
			{children}
		</div>
	);
}
