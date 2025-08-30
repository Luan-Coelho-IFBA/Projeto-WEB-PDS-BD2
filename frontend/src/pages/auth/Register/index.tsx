import { RouterLink } from "../../../components/RouterLink";
import { RoutesName } from "../../../components/routes/RoutesName";

export function Register() {
	return (
		<>
			<h3>Registro</h3>
			<RouterLink children="Ir para login" href={RoutesName.login} />
		</>
	);
}
