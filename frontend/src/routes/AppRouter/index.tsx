import { BrowserRouter, Routes, Route } from "react-router";
import { AuthRouter } from "../AuthRouter";
import { PageRoutesName } from "../../constants/PageRoutesName";
import { HomePage } from "../../pages/HomePage";
import { ArticleRouter } from "../ArticleRouter";
import { CreateArticlePage } from "../../pages/article/CreateArticlePage";
import { AdminRouter } from "../AdminRouter";

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home*/}
                <Route path={PageRoutesName.home} element={<HomePage />} />

                {/*Criação de artigos*/}
                <Route
                    path={PageRoutesName.articles.createArticle}
                    element={<CreateArticlePage />}
                ></Route>

                {/* Rotas de autenticação */}
                <Route path="/auth/*" element={<AuthRouter />} />

                {/* Rotas de artigos */}
                <Route path="/articles/*" element={<ArticleRouter />} />

                {/* Rotas de admin */}
                <Route path="/admin/*" element={<AdminRouter />} />
            </Routes>
        </BrowserRouter>
    );
}
