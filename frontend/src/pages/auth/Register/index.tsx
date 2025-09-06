import { useForm, type SubmitHandler } from "react-hook-form";
import { Form } from "../../../components/Form";
import { RouterLink } from "../../../components/RouterLink";
import { RoutesName } from "../../../constants/RoutesName";

import styles from "./styles.module.css";

import type { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUsers } from "../../../services/registerUser";
import { ModalVerifyEmail } from "./ModalRegister";

const registerSchema = z
	.object({
		name: z
			.string()
			.min(1, "É necessário digitar um nome")
			.min(2, "Nome deve ter pelo menos 2 caracteres"),
		email: z.email("Digite um email válido").min(1, "Email é obrigatório"),
		password: z
			.string()
			.min(8, "A senha precisa ter no mínimo 8 dígitos")
			.max(30, "A senha precisa ter no máximo 30 dígitos"),
		confirmPassword: z
			.string()
			.min(1, "Você precisa digitar a senha de confirmação"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type FormFields = z.infer<typeof registerSchema>;

type ApiErrorResponse = {
	message: string;
};

export function Register() {
	const {
		getValues,
		setError,
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = useForm<FormFields>({ resolver: zodResolver(registerSchema) });

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		console.log(data);

		if (data.confirmPassword === data.password) {
			try {
				const response = await registerUsers({
					email: data.email,
					name: data.name,
					password: data.password,
				});
				console.log(response);
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
						{...register("name")}
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
						{...register("email")}
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
						{...register("password")}
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
						{...register("confirmPassword")}
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

				{isSubmitSuccessful && (
					<ModalVerifyEmail email={getValues("email")} />
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
