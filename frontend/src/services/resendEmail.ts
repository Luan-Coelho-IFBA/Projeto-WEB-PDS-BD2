import api from "../server/api";
import { apiRoutes } from "../server/apiRoutes";

type resendEmailBody = {
	email: string;
};

export async function resendEmail({ email }: resendEmailBody) {
	const response = await api.get(apiRoutes.auth.resendEmail, {
		data: {
			email: email,
		},
	});
	return response;
}
