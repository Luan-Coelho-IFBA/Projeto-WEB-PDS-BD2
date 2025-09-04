import { BrowserRouter, Routes, Route } from "react-router";
import { AuthRouter } from "../AuthRouter";
import { RoutesName } from "../../constants/RoutesName";
import { LandingPage } from "../../pages/LandingPage";
import { HomePage } from "../../pages/HomePage";


export function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Rota principal - Landing Page */}
				<Route path={RoutesName.landing} element={<LandingPage />} />

				{/* Rota protegida - Home após login */}
				<Route path={RoutesName.home} element={<HomePage />} />

				{/* Rotas de autenticação */}
				<Route path="/auth/*" element={<AuthRouter />} />
			</Routes>
		</BrowserRouter>
	);
}
