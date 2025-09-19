import { Routes, Route } from "react-router";
import SeeArticlePage from "../../pages/article/SeeArticle";
import ArticlesByCategory from "../../pages/article/ArticlesByCategory";
export function ArticleRouter() {
    return (
        <Routes>
            <Route path=":id" element={<SeeArticlePage />} />
            <Route path="category/:id" element={<ArticlesByCategory />} />
        </Routes>
    );
}
