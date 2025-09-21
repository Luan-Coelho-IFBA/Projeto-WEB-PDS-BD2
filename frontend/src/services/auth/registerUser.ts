import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";

type bodyPostRegister = {
    name: string;
    email: string;
    password: string;
};

export async function registerUsers(data: bodyPostRegister) {
    const response = await api.post(apiRoutes.auth.register, {
        name: data.name,
        email: data.email,
        password: data.password,
    });
    return response;
}
