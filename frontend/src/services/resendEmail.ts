import api from "../server/api";
import { apiRoutes } from "../server/apiRoutes";

export async function resendEmail() {
	const response = await api.get(apiRoutes.auth.resendEmail);
	return response;
}
