import { Modal } from "../Modal";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { createCategory } from "../../services/categories/createCategory";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../server/types";

import styles from "./styles.module.css";

type ModalAddNewCategoryProps = {
    isOpen: boolean;
    handleModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const createNewCategoryForm = z.object({
    name: z.string().min(1, "A categoria precisa de nome"),
    description: z.string().min(1, "Este campo é obrigatorio"),
});

type CreateNewCategory = z.infer<typeof createNewCategoryForm>;

export function ModalAddNewCategory({
    isOpen,
    handleModal,
}: ModalAddNewCategoryProps) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitSuccessful, isSubmitting },
    } = useForm({ resolver: zodResolver(createNewCategoryForm) });

    const onSubmitFunction: SubmitHandler<CreateNewCategory> = async (data) => {
        console.log(data);

        try {
            const response = await createCategory(data.name, data.description);
            console.log(response);
        } catch (error) {
            console.log(error);

            const axiosError = error as AxiosError<ApiErrorResponse>;
            setError("root", { message: axiosError.message });
        }
    };

    function handleCloseModal() {
        handleModal((prev) => !prev);
    }

    return (
        <form onSubmit={handleSubmit(onSubmitFunction)}>
            <Modal isOpen={isOpen} closeHandler={handleCloseModal}>
                <Modal.Header title="Criar nova categoria" />
                <Modal.Subtitle subtitle="Passe as informações para criar uma nova categoria." />
                <Modal.BodyText>
                    <div className={styles.field}>
                        <label htmlFor="categoryName">Nome da Categoria</label>
                        <input
                            {...register("name")}
                            id="categoryName"
                            type="text"
                            placeholder="Informe o nome da nova categoria a ser adicionada"
                        />
                        {errors?.name?.message && (
                            <p className={styles.error}>
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="description">
                            Descrição da categoria
                        </label>
                        <input
                            {...register("description")}
                            id="description"
                            type="text"
                            placeholder="Adicione uma descrição para a categoria"
                        />
                        {errors?.description?.message && (
                            <p className={styles.error}>
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                    {errors.root?.message && (
                        <p className={styles.error}>{errors.root.message}</p>
                    )}
                </Modal.BodyText>
                <Modal.Actions>
                    <button
                        onClick={handleCloseModal}
                        className={`${styles.actionButton} ${styles.cancel}`}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={
                            isSubmitting || isSubmitSuccessful ? true : false
                        }
                        className={`${styles.actionButton} ${styles.confirm}`}
                    >
                        Enviar
                    </button>
                </Modal.Actions>
            </Modal>
        </form>
    );
}
