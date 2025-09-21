import { useForm, type SubmitHandler } from "react-hook-form";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import { getAllCategories } from "../../../services/categories/getAllCategories";
import { useQuery } from "@tanstack/react-query";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { useEffect } from "react";
import { getLocalStorageRole } from "../../../utils/getLocalStorageRole";
import { useNavigate } from "react-router";
import { PageRoutesName } from "../../../constants/PageRoutesName";
import { createArticles } from "../../../services/articles/createArticle";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../server/types";

import styles from "./styles.module.css";
import { MultiSelectDropdown } from "../../../components/MultiSelectDropdown";

const CreateArticleSchema = z.object({
    categoryId: z
        .number()
        .array()
        .nonempty("Você precisa escolher uma categoria."),
    title: z.string().nonempty("O titulo precisa ser preenchido."),
    subtitle: z
        .string()
        .nonempty("Você precisa de uma descrição no seu artigo."),
    text: z.string().nonempty("Seu artigo precisa ter um corpo."),
    image: z.any(),
});

type CreateArticleForm = z.infer<typeof CreateArticleSchema>;

export function CreateArticlePage() {
    const navigate = useNavigate();

    useEffect(() => {
        if (getLocalStorageRole() === "JORNALISTA")
            navigate(PageRoutesName.home);
    }, []);

    const { data: categoryQuery } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
        retry: 2,
    });

    const {
        setError,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(CreateArticleSchema),
    });

    const onSubmitForm: SubmitHandler<CreateArticleForm> = async (
        data: CreateArticleForm
    ) => {
        try {
            const response = await createArticles({ ...data });
            console.log(response);
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            setError("root", {
                message: axiosError.response?.data.message,
            });
            console.log(axiosError);
        }
    };

    return (
        <DefaultLayout>
            <main className={styles.pageCointainer}>
                <form
                    onSubmit={handleSubmit(onSubmitForm)}
                    className={styles.formContainer}
                >
                    <h2 className={styles.formTitle}>Criação de novo artigo</h2>

                    <div className={styles.formRow}>
                        <label className={styles.inputArea}>
                            TITULO
                            <input
                                {...register("title")}
                                type="text"
                                placeholder="Titulo do seu artigo"
                            />
                        </label>
                        {errors?.title?.message && (
                            <p className={styles.error}>
                                {errors.title.message}
                            </p>
                        )}
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.inputArea}>
                            SUBTITULO
                            <input
                                {...register("subtitle")}
                                type="text"
                                placeholder="Informe a descrição do seu artigo"
                            />
                        </label>
                        {errors?.subtitle?.message && (
                            <p className={styles.error}>
                                {errors.subtitle.message}
                            </p>
                        )}
                    </div>

                    {/* <img className={styles.formRow} /> */}
                    <div className={styles.formRow}>
                        <label className={styles.inputArea}>
                            CONTEÚDO
                            <textarea
                                {...register("text")}
                                id={styles.textareaField}
                                placeholder="Informe o conteudo do seu artigo"
                            />
                        </label>

                        {errors?.text?.message && (
                            <p className={styles.error}>
                                {errors.text.message}
                            </p>
                        )}
                    </div>

                    <div className={styles.formRow && styles.footerFields}>
                        <label className={styles.item}>
                            CAPA
                            <input {...register("image")} type="file" />
                            {/* {errors?.image?.message && (
                                <p className={styles.error}>
                                    {errors.image.message}
                                </p>
                            )} */}
                        </label>

                        <label className={styles.item}>
                            CATEGORIAS DO ARTIGO
                            <MultiSelectDropdown
                                options={categoryQuery?.categories.map(
                                    (category) => category.name
                                )}
                            />
                            {errors?.categoryId?.message && (
                                <p className={styles.error}>
                                    {errors.categoryId.message}
                                </p>
                            )}
                        </label>
                    </div>

                    <input
                        className={styles.sendButton}
                        type="submit"
                        value={"Criar artigo"}
                    />
                </form>
            </main>
        </DefaultLayout>
    );
}
