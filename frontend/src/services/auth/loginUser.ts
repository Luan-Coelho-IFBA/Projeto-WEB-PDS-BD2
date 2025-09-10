import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";

type LoginUserProps = {
	email: string;
	password: string;
};

export async function loginUser({ email, password }: LoginUserProps) {
	const response = await api.post(
		apiRoutes.auth.login,
		{
			email,
			password,
		},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	return response;
}
