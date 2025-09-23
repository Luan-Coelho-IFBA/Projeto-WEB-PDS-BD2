import { Routes, Route } from "react-router";
import { LoginPage } from "../../pages/auth/LoginPage";
import { RegisterPage } from "../../pages/auth/RegisterPage";
import { ConfigPage } from "../../pages/auth/ConfigPage";
import { NotFoundPage } from "../../pages/NotFoundPage";

export function AuthRouter() {
    return (
        <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="config" element={<ConfigPage />} />

            <Route path="/*" element={<NotFoundPage />} />
        </Routes>
    );
}
