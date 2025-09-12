import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./routes/AppRouter";
import "./css/global.css";
import "./css/theme.css";

const queryClient = new QueryClient();

export function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<AppRouter />
			</QueryClientProvider>
		</>
	);
}
