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

const CreateArticleSchema = z.object({
    categoryId: z.number().array(),
    title: z.string().nonempty("O titulo precisa não pode ser vazio"),
    subtitle: z
        .string()
        .nonempty("A descrição do seu artigo precisa ser preenchida"),
    text: z.string().nonempty("Seu artigo precisa ter um corpo"),
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
                    <label className={styles.formRow}>
                        TITULO
                        <input
                            {...register("title")}
                            type="text"
                            placeholder="Titulo do seu artigo"
                        />
                    </label>
                    <label className={styles.formRow}>
                        SUBTITULO
                        <input
                            {...register("title")}
                            type="text"
                            placeholder="Informe a descrição do seu artigo"
                        />
                    </label>

                    {/* <img className={styles.formRow} /> */}

                    <label className={styles.formRow}>
                        CONTEÚDO
                        <textarea
                            {...register("text")}
                            id={styles.textareaField}
                            placeholder="Informe o conteudo do seu artigo"
                        />
                    </label>

                    <div className={styles.formRow && styles.footerFields}>
                        <label className={styles.item}>
                            CAPA
                            <input {...register("image")} type="file" />
                        </label>

                        <label className={styles.item}>
                            TIPO DE ARTIGO
                            <select>
                                {categoryQuery &&
                                    categoryQuery.categories.length > 0 &&
                                    categoryQuery.categories.map((category) => (
                                        <option {...register("categoryId")}>
                                            {category.name}
                                        </option>
                                    ))}
                            </select>
                        </label>
                    </div>

                    <button className={styles.sendButton} type="submit">
                        Enviar formulario
                    </button>
                </form>
            </main>
        </DefaultLayout>
    );
}
