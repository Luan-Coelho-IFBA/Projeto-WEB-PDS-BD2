import { useState } from "react";
import { Form } from "../../../components/Form";
import styles from "./styles.module.css";
import { loginAccount } from "../../../utils/loginAccount";
import { RouterLink } from "../../../components/RouterLink";
import { RoutesName } from "../../../constants/RoutesName";

export function LoginPage() {
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
				/>
				<Form.Field
					nameInput="password"
					label="SENHA"
					placeholder="Digite a sua senha"
					type="password"
				/>

				<Form.Button onClick={loginAccount} nameButton="Logar" />
			</Form>
			<div className={styles.links}>
				<RouterLink href={RoutesName.forgotPassword}>
					Esqueci a senha
				</RouterLink>
				<RouterLink href={RoutesName.register}>
					Não possui conta? Crie uma aqui
				</RouterLink>
			</div>
		</div>
	);
}
