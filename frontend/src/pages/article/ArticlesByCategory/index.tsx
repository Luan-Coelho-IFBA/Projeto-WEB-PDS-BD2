import { useParams } from "react-router";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

export default function ArticlesByCategory() {
    const { id } = useParams();

    return (
        <DefaultLayout>
            <main></main>
        </DefaultLayout>
    );
}
