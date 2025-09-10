import { Form } from "../../../components/Form";
import styles from "./styles.module.css";
import { RouterLink } from "../../../components/RouterLink";
import { PageRoutesName } from "../../../constants/PageRoutesName";

import { loginUser } from "../../../services/auth/loginUser";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../server/types";
import { setLocalStorageToken } from "../../../utils/setLocalStorageToken";
import { useNavigate } from "react-router";
import { ModalChangePassword } from "../../../components/ModalChangePassword";
import { useState } from "react";

const LoginSchema = z.object({
	email: z
		.email("Informe um e-email válido")
		.min(1, "O e-mail é obrigatorio para efetuar o login"),
	password: z
		.string()
		.min(1, "Este campo é obrigatório")
		.max(30, "A senha não pode ultrapassar 30 digitos"),
});

type LoginUserForm = z.infer<typeof LoginSchema>;

export function LoginPage() {
	const navigate = useNavigate();

	const [showForgotPasswordModal, setShowForgotPasswordModal] =
		useState(false);

	const {
		setError,
		handleSubmit,
		register,
		formState: { errors },
	} = useForm({ resolver: zodResolver(LoginSchema) });

	const onSubmitForm: SubmitHandler<LoginUserForm> = async (
		data: LoginUserForm
	) => {
		try {
			const response = await loginUser(data);
			console.log(response);
			setLocalStorageToken(response.data.token);
			navigate(PageRoutesName.home, { replace: true });
		} catch (error) {
			const axiosError = error as AxiosError<ApiErrorResponse>;
			setError("root", {
				message: axiosError.response?.data.message,
			});
			console.log(error);
		}
	};

	return (
		<div className={styles.containerLogin}>
			<Form onSubmit={handleSubmit(onSubmitForm)}>
				<Form.Header
					title="Login"
					subtitle="Faça o login na sua conta"
				/>
				<div className={styles.group}>
					<Form.Field
						{...register("email")}
						nameInput="email"
						label="EMAIL"
						placeholder="Informe o seu email"
						type="text"
					/>
					{errors.email?.message && (
						<p className={styles.error}>{errors.email.message}</p>
					)}
				</div>
				<div className={styles.group}>
					<Form.Field
						{...register("password")}
						nameInput="password"
						label="SENHA"
						placeholder="Digite a sua senha"
						type="password"
					/>
					{errors.password?.message && (
						<p className={styles.error}>
							{errors.password.message}
						</p>
					)}
				</div>
				{errors.root?.message && (
					<p className={styles.error}>{errors.root.message}</p>
				)}
				<Form.Button type="submit" nameButton="Logar" />
			</Form>
			<div className={styles.links}>
				<RouterLink
					onClick={() =>
						setShowForgotPasswordModal(!showForgotPasswordModal)
					}
					href=""
				>
					Esqueci a senha
				</RouterLink>
				<RouterLink href={PageRoutesName.register}>
					Não possui conta? Crie uma aqui
				</RouterLink>
			</div>

			{showForgotPasswordModal && (
				<ModalChangePassword
					titleModal="Esqueceu a senha?"
					subtitleModal="Digite sua nova senha nos campos abaixo"
					isOpen={showForgotPasswordModal}
					onClose={() => setShowForgotPasswordModal(false)}
				/>
			)}
		</div>
	);
}
