import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import styles from "./styles.module.css";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../server/types";
import { updateUsername } from "../../../services/auth/updateUsername";

const ChangeNameSchema = z.object({
    name: z
        .string("Este campo não pode ser vazio")
        .min(5, "Seu nome precisa ter ao menos 5 digitos"),
});

type ChangeNameField = z.infer<typeof ChangeNameSchema>;

export function ConfigPageForm() {
    const {
        setError,
        handleSubmit,
        register,
        formState: { errors, isSubmitSuccessful: isUsernameChanged },
    } = useForm({ resolver: zodResolver(ChangeNameSchema) });

    const onSubmitForm: SubmitHandler<ChangeNameField> = async (
        data: ChangeNameField
    ) => {
        try {
            const response = await updateUsername(data.name);
            console.log(response);
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            setError("root", {
                message: axiosError.response?.data.message,
            });
        }
    };

    return (
        <section className={styles.inputSections}>
            <div className={styles.inputSectionRow}>
                <label htmlFor="changeName">Alterar Nome</label>

                <form
                    onSubmit={handleSubmit(onSubmitForm)}
                    className={styles.changeNameArea}
                >
                    <input
                        {...register("name")}
                        type="text"
                        id="changeName"
                        placeholder="Informe o seu nome completo"
                        className={errors.name ? styles.inputError : ""}
                    />
                    {errors.name?.message && (
                        <p className={styles.errorMessage}>
                            {errors.name.message}
                        </p>
                    )}
                    <button type="submit" className={styles.changeNameButton}>
                        Alterar nome
                    </button>
                    {isUsernameChanged && (
                        <p className={styles.sucessMessage}>
                            Nome alterado com sucesso
                        </p>
                    )}
                    {errors.root?.message && (
                        <p className={styles.errorMessage}>
                            {errors.root.message}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}
