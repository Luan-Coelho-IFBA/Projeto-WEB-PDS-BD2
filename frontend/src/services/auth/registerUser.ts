import { PageRoutesName } from "../../constants/PageRoutesName";
import api from "../../server/api";

type bodyPostRegister = {
	name: string;
	email: string;
	password: string;
};

export async function registerUsers(data: bodyPostRegister) {
	const response = await api.post(PageRoutesName.register, {
		name: data.name,
		email: data.email,
		password: data.password,
	});
	return response;
}
