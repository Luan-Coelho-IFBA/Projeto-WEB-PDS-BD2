import { BrowserRouter, Routes, Route } from "react-router";
import { AuthRouter } from "../AuthRouter";
import { PageRoutesName } from "../../constants/PageRoutesName";
import { LandingPage } from "../../pages/LandingPage";
import { HomePage } from "../../pages/HomePage";
import { ArticleRouter } from "../ArticleRouter";

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota principal - Landing Page */}
                <Route
                    path={PageRoutesName.landing}
                    element={<LandingPage />}
                />

                {/* Rota protegida - Home após login */}
                <Route path={PageRoutesName.home} element={<HomePage />} />

                {/* Rotas de autenticação */}
                <Route path="/auth/*" element={<AuthRouter />} />

                {/* Rotas de artigos */}
                <Route path="/articles/*" element={<ArticleRouter />} />
            </Routes>
        </BrowserRouter>
    );
}
