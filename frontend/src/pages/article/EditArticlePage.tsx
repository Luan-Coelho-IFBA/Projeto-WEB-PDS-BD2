import { useParams } from "react-router";
import { getArticle } from "../../services/articles/getArticle";
import { useQuery } from "@tanstack/react-query";

export function EditArticlePage() {
    const { id } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["articleToUpdate", id],
        queryFn: () => getArticle(Number(id!)),
        enabled: !!id && !isNaN(Number(id)),
    });

    if (!id || isNaN(Number(id))) {
        return (
            <div>
                <h2>Erro: ID inválido</h2>
                <p>O ID do artigo deve ser um número válido.</p>
            </div>
        );
    }

    if (isLoading) return <div>Carregando artigo...</div>;

    if (isError) return <div>Erro ao carregar artigo: {error?.message}</div>;

    return <>{data?.article.title}</>;
}
