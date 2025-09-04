import { Routes, Route } from "react-router";
import { LoginPage } from "../../pages/auth/LoginPage";
import { Register } from "../../pages/auth/Register";
import { ForgotPassword } from "../../pages/auth/ForgotPassword";

export function AuthRouter() {
	return (
		<Routes>
			<Route path="login" element={<LoginPage />} />
			<Route path="register" element={<Register />} />
			<Route path="forgot-password" element={<ForgotPassword />} />
		</Routes>
	);
}
