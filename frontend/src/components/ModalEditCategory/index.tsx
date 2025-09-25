import { Modal } from "../Modal";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../server/types";

import styles from "./styles.module.css";
import type { Category } from "../../types/Category";
import { updateCategory } from "../../services/categories/updateCategory";

type ModalEditCategoryProps = {
    category: Category;
    isOpen: boolean;
    refetchCategories?: () => void;
    handleModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditCategorySchema = z.object({
    name: z.string().min(1, "A categoria precisa de nome"),
    description: z.string().min(1, "Este campo é obrigatorio"),
});

type EditCategoryForm = z.infer<typeof EditCategorySchema>;

export function ModalEditCategory({
    category,
    isOpen,
    refetchCategories,
    handleModal,
}: ModalEditCategoryProps) {
    const {
        setError,
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<EditCategoryForm>({
        resolver: zodResolver(EditCategorySchema),
    });

    const onSubmitFunction: SubmitHandler<EditCategoryForm> = async (data) => {
        console.log(data);

        try {
            await updateCategory({
                categoryId: category.id,
                newDescription: data.description,
                newName: data.name,
            });
            refetchCategories?.();
            handleModal(false);
        } catch (error) {
            console.log(error);

            const axiosError = error as AxiosError<ApiErrorResponse>;
            setError("root", { message: axiosError.response?.data.message });
        }
    };

    function handleCloseModal() {
        handleModal((prev) => !prev);
    }

    return (
        <form onSubmit={handleSubmit(onSubmitFunction)}>
            <Modal isOpen={isOpen} closeHandler={handleCloseModal}>
                <>
                    <Modal.Header title="Editar uma categoria" />
                    <Modal.Subtitle
                        subtitle={`Altere as informações que julgar necessario na categoria.`}
                    />
                    <Modal.BodyText>
                        <div className={styles.field}>
                            <label htmlFor="categoryName">
                                Nome da Categoria
                            </label>
                            <input
                                {...register("name")}
                                defaultValue={category?.name}
                                name="name"
                                id="categoryName"
                                type="text"
                                placeholder="Informe o nome da nova categoria."
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
                                defaultValue={category?.description}
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
                            <p className={styles.error}>
                                {errors.root.message}
                            </p>
                        )}
                        {isSubmitSuccessful && (
                            <p className={styles.sucess}>
                                Categoria criada com sucesso
                            </p>
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
                                isSubmitting || isSubmitSuccessful
                                    ? true
                                    : false
                            }
                            className={`${styles.actionButton} ${styles.confirm}`}
                        >
                            Enviar
                        </button>
                    </Modal.Actions>
                </>
            </Modal>
        </form>
    );
}
