import { RouterLink } from "../../../components/RouterLink";
import { RoutesName } from "../../../constants/RoutesName";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

export function ForgotPassword() {
	return (
		<DefaultLayout>
			<h3>Esqueci a senha</h3>
			<RouterLink href={RoutesName.login}>Ir para login</RouterLink>
		</DefaultLayout>
	);
}
