import { Routes, Route } from "react-router";
import SeeArticlePage from "../../pages/article/SeeArticle";
import ArticlesByCategory from "../../pages/article/ArticlesByCategory";
import LatestArticles from "../../pages/article/Latest";
import MostViewedArticles from "../../pages/article/MostViewed";
import MyArticles from "../../pages/article/MyArticles";
import Search from "../../pages/article/Search";
export function ArticleRouter() {
    return (
        <Routes>
            <Route path=":id" element={<SeeArticlePage />} />
            <Route path="/latest" element={<LatestArticles />} />
            <Route path="/most-viewed" element={<MostViewedArticles />} />
            <Route path="/category/:id" element={<ArticlesByCategory />} />
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/search" element={<Search />} />
        </Routes>
    );
}
