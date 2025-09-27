import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./routes/AppRouter";
import "./css/global.css";
import "./css/theme.css";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export function App() {
    return (
        <>
            <Toaster />
            <QueryClientProvider client={queryClient}>
                <AppRouter />
            </QueryClientProvider>
        </>
    );
}
