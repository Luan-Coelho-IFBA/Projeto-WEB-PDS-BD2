import { useParams } from "react-router";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import { useEffect } from "react";

export default function ArticlesByCategory() {
    const parametros = useParams();

    useEffect(() => {
        console.log(parametros);
    },[]);

    return (
        <DefaultLayout>
            <main></main>
        </DefaultLayout>
    );
}
