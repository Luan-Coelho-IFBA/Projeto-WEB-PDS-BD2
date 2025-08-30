import { useState } from "react";
import { Form } from "../../components/Form";
import styles from "./styles.module.css";
import { loginAccount } from "../../utils/loginAccount";

export function LoginPage() {
	const [email, setEmail] = useState("");

	return (
		<div className={styles.containerLogin}>
			<Form>
				<Form.Header
					title="Login"
					subtitle="Faça o login na sua conta"
				/>
				<Form.Field
					nameInput=""
					label="EMAIL"
					placeholder="Informe o seu email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<Form.Button onClick={loginAccount} nameButton="Logar" />
			</Form>
			<div className={styles.links}>
				<a href="">Esqueci a senha</a>
				<a href="">Não possui conta? Crie uma aqui</a>
			</div>
		</div>
	);
}
