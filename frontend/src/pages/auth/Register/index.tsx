import { Form } from "../../../components/Form";
import { RouterLink } from "../../../components/RouterLink";
import { RoutesName } from "../../../constants/RoutesName";

import styles from "./styles.module.css";

export function Register() {
	return (
		<div className={styles.containerRegister}>
			<Form>
				<Form.Header
					title="Cadastro"
					subtitle="Digite suas informações para efetuar o cadastro"
				/>

				<Form.Field
					label="NOME COMPLETO"
					nameInput="NomeCompleto"
					placeholder="Informe o seu nome completo"
					type="text"
				/>

				<Form.Field
					label="EMAIL"
					nameInput="email"
					placeholder="Digite um email válido"
					type="email"
				/>

				<Form.Field
					label="SENHA"
					nameInput="senha"
					placeholder="Digite sua senha"
					type="password"
				/>
				<Form.Field
					label="CONFIRMAR SENHA"
					nameInput="confirmarSenha"
					placeholder="Digite sua senha novamente"
					type="email"
				/>
				<Form.Field
					label="CONTATO"
					nameInput="contato"
					placeholder="(11) 9 1111-1111"
					type="email"
				/>

				<Form.Button
					onClick={() => console.log("teste")}
					nameButton="CADASTRAR"
				/>
			</Form>
			<div className={styles.links}>
				<RouterLink
					children="Já possui conta? Ir para login"
					href={RoutesName.login}
				/>
			</div>
		</div>
	);
}
