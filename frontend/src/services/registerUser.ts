import { RoutesName } from "../constants/RoutesName";
import api from "../server/api";

type bodyPostRegister = {
	name: string;
	email: string;
	password: string;
};

export async function registerUsers(data: bodyPostRegister) {
	const response = await api.post(RoutesName.register, {
		name: data.name,
		email: data.email,
		password: data.password,
	});
	return response;
}
