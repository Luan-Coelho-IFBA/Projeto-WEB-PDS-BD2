import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";

type resendEmailBody = {
    email: string;
};

export async function resendEmail({ email }: resendEmailBody) {
    const response = await api.post(
        apiRoutes.auth.resendEmail,
        {
            email: email,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response;
}
