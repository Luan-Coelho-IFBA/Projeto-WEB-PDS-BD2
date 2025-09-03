import { useEffect } from "react";
import styles from "./styles.module.css";
import axios from "axios";

export function Header() {
	useEffect(() => {
		let products = {};
		axios.get("https://dummyjson.com/products").then((data) => {
			products = data;
			console.log(products);
		});
	}, []);

	return (
		<header className={styles.header}>
			<nav className={styles.menu}>
				<h1>Placeholder</h1>
			</nav>
		</header>
	);
}
