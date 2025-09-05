import { useForm, type SubmitHandler } from "react-hook-form";
import { Form } from "../../../components/Form";
import { RouterLink } from "../../../components/RouterLink";
import { RoutesName } from "../../../constants/RoutesName";

import styles from "./styles.module.css";
import api from "../../../server/api";
import type { AxiosError } from "axios";

type FormFields = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

type ApiErrorResponse = {
	message: string;
};

export function Register() {
	const {
		setError,
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = useForm<FormFields>();

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		console.log(data);

		if (data.confirmPassword === data.password) {
			try {
				await api
					.post(RoutesName.register, {
						name: data.name,
						email: data.email,
						password: data.password,
					})
					.then((data) => console.log(data));
			} catch (error) {
				const axiosError = error as AxiosError<ApiErrorResponse>;
				setError("email", {
					message: axiosError.response?.data.message,
				});
			}
		}
	};

	console.log("render");

	return (
		<div className={styles.containerRegister}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Form.Header
					title="Cadastro"
					subtitle="Digite suas informações para efetuar o cadastro"
				/>
				<div className={styles.group}>
					<Form.Field
						{...register("name", {
							required: "Necessario digitar um nome",
						})}
						label="NOME COMPLETO"
						nameInput="NomeCompleto"
						placeholder="Informe o seu nome completo"
						type="text"
					/>
					{errors.name?.message && (
						<p className={styles.error}>{errors.name?.message}</p>
					)}
				</div>

				<div className={styles.group}>
					<Form.Field
						{...register("email", {
							required: "Email é obrigatorio",
							pattern: {
								value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
								message: "Digite um email válido",
							},
						})}
						label="EMAIL"
						nameInput="email"
						placeholder="Digite um email válido"
						type="text"
					/>
					{errors.email && (
						<p className={styles.error}>{errors.email?.message}</p>
					)}
				</div>

				<div className={styles.group}>
					<Form.Field
						{...register("password", {
							required: {
								value: true,
								message: "Você precisa digitar uma senha",
							},
							minLength: {
								value: 8,
								message:
									"A sua senha precisa ter no minimo 8 digitos",
							},
							maxLength: {
								value: 30,
								message:
									"A senha precisa ter no máximo 30 digitos",
							},
						})}
						label="SENHA"
						nameInput="senha"
						placeholder="Digite sua senha"
						type="password"
					/>
					{errors.password?.message && (
						<p className={styles.error}>
							{errors.password?.message}
						</p>
					)}
				</div>

				<div className={styles.group}>
					<Form.Field
						{...register("confirmPassword", {
							required:
								"Você precisa digitar a senha de confirmação",
							minLength: {
								value: 8,
								message:
									"A sua senha precisa ter no minimo 8 digitos",
							},
							maxLength: {
								value: 30,
								message:
									"A senha precisa ter no máximo 30 digitos",
							},
							validate: (value, formValues) => {
								if (value !== formValues.password) {
									return "As senhas não coincidem";
								}
								return true;
							},
						})}
						label="CONFIRMAR SENHA"
						nameInput="confirmPassword"
						placeholder="Digite novamente a sua senha"
						type="password"
					/>
					{errors.confirmPassword?.message && (
						<p className={styles.error}>
							{errors.confirmPassword?.message}
						</p>
					)}
				</div>
				<Form.Button
					disabled={isSubmitting || isSubmitSuccessful ? true : false}
					type="submit"
					nameButton={isSubmitting ? "Carregando" : "Cadastrar"}
				/>
				{errors.root?.message && (
					<p className={styles.error}>{errors.root?.message}</p>
				)}
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
