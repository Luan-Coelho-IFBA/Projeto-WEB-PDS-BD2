import { RouterLink } from "../../../components/RouterLink";
import { RoutesName } from "../../../components/routes/RoutesName";

export function ForgotPassword() {
	return (
		<>
			<h3>Esqueci a senha</h3>
			<RouterLink href={RoutesName.login}>Ir para login</RouterLink>
		</>
	);
}
