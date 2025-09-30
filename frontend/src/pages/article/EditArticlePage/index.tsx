import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getArticle } from "../../../services/articles/getArticle";
import { Loader } from "../../../components/Loader";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import { updateArticle } from "../../../services/articles/updateArticle";
import { SubmitHandler, useForm } from "react-hook-form";
import { notify } from "../../../adapters/toastHotAdapter";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../../server/types";
import { PageRoutesName } from "../../../constants/PageRoutesName";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllCategories } from "../../../services/categories/getAllCategories";
import { getLocalStorageRole } from "../../../utils/getLocalStorageRole";
import { useEffect, useState } from "react";
import { MultiSelectDropdown } from "../../../components/MultiSelectDropdown";
import { MousePointerClickIcon } from "lucide-react";
import z from "zod";

import styles from "./styles.module.css";

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
    image: z.custom<FileList>().refine(
        (fileList) => {
            if (fileList.length <= 0) return true;
            return ["image/jpeg", "image/png", "image/webp"].includes(
                fileList[0].type
            );
        },
        {
            message: "A imagem precisa ser do tipo JPG, PNG ou WEBP.",
        }
    ),
});

type CreateArticleForm = z.infer<typeof CreateArticleSchema>;

export function CreateArticlePage() {}

export function EditArticlePage() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [imagePreview, setImagePreview] = useState<string>();

    const {
        data: articleToUpdate,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["articleToUpdate", id],
        queryFn: () => getArticle(Number(id!)),
        enabled: !!id && !isNaN(Number(id)),
    });

    useEffect(() => {
        if (
            getLocalStorageRole() === null ||
            getLocalStorageRole() === "LEITOR"
        )
            navigate(PageRoutesName.home);
    }, []);

    const { data: categoryQuery } = useQuery({
        queryKey: ["categoriesUpdateArticle"],
        queryFn: getAllCategories,
        retry: 2,
        gcTime: 0,
    });

    const {
        setError,
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitSuccessful, isSubmitting },
    } = useForm({
        resolver: zodResolver(CreateArticleSchema),
        defaultValues: {
            title: articleToUpdate?.article.title,
            subtitle: articleToUpdate?.article.subtitle,
            text: articleToUpdate?.article.text,
            categoryId: articleToUpdate?.article.categories.map((c) => c.id),
        },
    });

    const onSubmitForm: SubmitHandler<CreateArticleForm> = async (
        data: CreateArticleForm
    ) => {
        console.log(data);
        try {
            await updateArticle({ ...data, id: Number(id) });
            notify.sucess("Artigo atualizado com sucesso");
            navigate(PageRoutesName.home);
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            setError("root", {
                message: axiosError.response?.data.message,
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                setImagePreview(reader.result as string);
            });
        }
    };

    if (!id || isNaN(Number(id))) {
        return (
            <DefaultLayout>
                <h2>Erro: ID inválido</h2>
                <p>O ID do artigo a ser editado deve ser um número válido.</p>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout authenticated>
            {isLoading && (
                <Loader direction="column">
                    <Loader.TextMessage
                        color="black"
                        feedbackMessage="Carregando artigo..."
                    />
                    <Loader.Icon />
                </Loader>
            )}
            {isError && <div>Erro ao carregar artigo: {error?.message}</div>}
            {articleToUpdate && (
                <main className={styles.pageCointainer}>
                    <form
                        onSubmit={handleSubmit(onSubmitForm)}
                        className={styles.formContainer}
                    >
                        <h2 className={styles.formTitle}>
                            Criação de novo artigo
                        </h2>

                        <div className={styles.formRow}>
                            <label className={styles.inputArea}>
                                TITULO
                                <input
                                    defaultValue={articleToUpdate.article.title}
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
                                    defaultValue={
                                        articleToUpdate.article.subtitle
                                    }
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

                        <div className={styles.formRow}>
                            <label
                                tabIndex={0}
                                className={styles.imageFieldContainer}
                            >
                                {!isSubmitSuccessful && !isSubmitting && (
                                    <div className={styles.tipForImageField}>
                                        <MousePointerClickIcon />
                                        <span>
                                            Coloque uma imagem na sua noticia
                                        </span>
                                    </div>
                                )}
                                {!imagePreview && (
                                    <img
                                        className={styles.imagePreview}
                                        src={`data:${articleToUpdate.article.imageMimeType};base64,${articleToUpdate.article.image}`}
                                    ></img>
                                )}
                                {imagePreview && (
                                    <img
                                        className={styles.imagePreview}
                                        src={imagePreview}
                                    ></img>
                                )}
                                <input
                                    {...register("image", {
                                        onChange: handleImageChange,
                                    })}
                                    type="file"
                                    accept="image/*"
                                    className={styles.imageInput}
                                />
                                {errors?.image?.message && (
                                    <p className={styles.error}>
                                        {errors.image.message}
                                    </p>
                                )}
                            </label>
                        </div>

                        <div className={styles.formRow}>
                            <label className={styles.inputArea}>
                                CONTEÚDO
                                <textarea
                                    defaultValue={articleToUpdate.article.text}
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
                            {/*  */}
                            <label className={styles.item}>
                                CATEGORIAS DO ARTIGO
                                <MultiSelectDropdown
                                    name="categoryId"
                                    // @ts-expect-error
                                    control={control}
                                    initialValue={articleToUpdate.article.categories.map(
                                        (c) => c.id
                                    )}
                                    options={categoryQuery?.map((c) => ({
                                        label: c.name,
                                        value: c.id,
                                    }))}
                                />
                                {errors?.categoryId?.message && (
                                    <p className={styles.error}>
                                        {errors.categoryId.message}
                                    </p>
                                )}
                            </label>
                        </div>
                        {isSubmitSuccessful && (
                            <p className={styles.sucess}>Artigo criado</p>
                        )}
                        <button
                            disabled={isSubmitSuccessful || isSubmitting}
                            className={`${styles.sendButton} ${
                                isSubmitting ? styles.loading : ""
                            }`}
                            type="submit"
                        >
                            {isSubmitting ? (
                                <Loader direction="row">
                                    <Loader.TextMessage
                                        color="white"
                                        feedbackMessage="Alterar artigo..."
                                    />
                                    <Loader.Icon color="white" />
                                </Loader>
                            ) : isSubmitSuccessful ? (
                                "Alterado"
                            ) : (
                                "Alterar artigo"
                            )}
                        </button>
                    </form>
                </main>
            )}
        </DefaultLayout>
    );
}
