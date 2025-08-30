import { RouterLink } from "../../components/RouterLink";
import { RoutesName } from "../../components/routes/RoutesName";

export function HomePage() {
    return (
        <div>
            <h1>Home Page</h1>
            <p>Bem-vindo! Você está logado.</p>
            <RouterLink href={RoutesName.landing}>Voltar para Landing</RouterLink>
        </div>
    );
}