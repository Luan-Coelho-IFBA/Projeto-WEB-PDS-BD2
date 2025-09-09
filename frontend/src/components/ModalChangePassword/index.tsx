import { Modal } from "../Modal";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod"; // Mudança: usar { z } ao invés de z from "zod"
import { Form } from "../Form";
import { zodResolver } from "@hookform/resolvers/zod";

import styles from "./styles.module.css";
import { updatePassword } from "../../services/updatePassword";
import type { AxiosError } from "axios";

const ChangePasswordFieldsSchema = z
	.object({
		password: z
			.string()
			.min(1, "A senha é obrigatória")
			.min(8, "A senha precisa ter no minimo 8 digitos")
			.max(30, "Sua nova senha não pode ultrapassar 30 digitos"),
		confirmPassword: z.string().min(1, "Este campo é obrigatorio"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type ChangePasswordFields = z.infer<typeof ChangePasswordFieldsSchema>;

type ModalChangePasswordProps = {
	titleModal: string;
	subtitleModal: string;
	isOpen: boolean;
	onClose: () => void;
};

export function ModalChangePassword({
	titleModal,
	subtitleModal,
	isOpen,
	onClose,
}: ModalChangePasswordProps) {
	const {
		setError,
		handleSubmit,
		register,
		formState: { errors, isSubmitSuccessful, isSubmitting },
	} = useForm({
		resolver: zodResolver(ChangePasswordFieldsSchema),
	});

	const onSubmitHandler: SubmitHandler<ChangePasswordFields> = async (
		data: ChangePasswordFields
	) => {
		console.log(data);

		try {
			const response = await updatePassword(data.password);
			console.log(response);
		} catch (error) {
			const axiosError = error as AxiosError;
			console.log(axiosError);
			if (axiosError.status === 401) {
				setError("root", {
					message: "Você não possui autorização para fazer isso.",
				});
			}
		}
	};

	return (
		<Modal closeButton={true} isOpen={isOpen} closeHandler={onClose}>
			<Modal.Header title={titleModal} />
			<Modal.Subtitle subtitle={subtitleModal} />
			<Modal.BodyText>
				<Form onSubmit={handleSubmit(onSubmitHandler)}>
					<div className={styles.group}>
						<Form.Field
							{...register("password")}
							nameInput="password"
							label="NOVA SENHA"
							placeholder="Digite a sua nova senha"
							type="password"
						/>
						{errors.password?.message && (
							<p className={styles.error}>
								{errors.password.message}
							</p>
						)}
					</div>

					<div className={styles.group}>
						<Form.Field
							{...register("confirmPassword")}
							nameInput="confirmPassword"
							label="CONFIRMAR SENHA"
							placeholder="Insira novamente a sua senha"
							type="password"
						/>
						{errors.confirmPassword?.message && (
							<p className={styles.error}>
								{errors.confirmPassword.message}
							</p>
						)}
					</div>
					{errors.root?.message && (
						<p className={styles.error}>{errors.root.message}</p>
					)}
					{/* Caso nao tenha sido enviado ainda */}
					{!isSubmitSuccessful && (
						<Form.Button
							disabled={isSubmitting ? true : false}
							type={"submit"}
							nameButton="Confirmar Senha"
						/>
					)}
					{isSubmitSuccessful && (
						<>
							<p className={styles.sucess}>
								Sua senha foi alterada com sucesso
							</p>
							<Modal.Actions>
								<Modal.Action
									nameButton="Sair"
									variant="confirm"
									onClickHandler={onClose}
								/>
							</Modal.Actions>
						</>
					)}
				</Form>
			</Modal.BodyText>
		</Modal>
	);
}
