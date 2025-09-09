import { RouterLink } from "../../../components/RouterLink";
import { PageRoutesName } from "../../../constants/PageRoutesName";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

export function ForgotPassword() {
	return (
		<DefaultLayout>
			<h3>Esqueci a senha</h3>
			<RouterLink href={PageRoutesName.login}>Ir para login</RouterLink>
		</DefaultLayout>
	);
}
