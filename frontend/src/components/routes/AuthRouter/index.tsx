import { BrowserRouter, Route, Routes } from "react-router";
import { LoginPage } from "../../../pages/auth/LoginPage";
import { ForgotPassword } from "../../../pages/auth/ForgotPassword";
import { Register } from "../../../pages/auth/Register";
import { RoutesName } from "../RoutesName";

export function AuthRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={RoutesName.login} element={<LoginPage />}></Route>
				<Route
					path={RoutesName.register}
					element={<Register />}
				></Route>
				<Route
					path={RoutesName.forgotPassord}
					element={<ForgotPassword />}
				></Route>
			</Routes>
		</BrowserRouter>
	);
}
