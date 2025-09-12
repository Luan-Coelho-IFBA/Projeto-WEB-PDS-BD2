import { loadingContentText } from "../../constants/textContent";
import styles from "./styles.module.css";

type QuerySectionProps<T> = {
	isLoading: boolean;
	isError: boolean;
	error: Error | null;
	data: T | undefined;
	renderData: (data: T) => React.ReactNode;
	loadingComponent?: React.ReactNode;
	errorComponent?: React.ReactNode;
};

export function QuerySection<T>({
	isLoading,
	isError,
	error,
	data,
	renderData,
	loadingComponent = (
		<div className={styles.loading}>{loadingContentText}</div>
	),
	errorComponent,
}: QuerySectionProps<T>) {
	if (isLoading) {
		return <>{loadingComponent}</>;
	}

	if (isError) {
		return (
			<div className={styles.error}>
				{errorComponent || (
					<p>
						{error?.message ||
							"Ocorreu um erro ao carregar os dados. Tente novamente."}
					</p>
				)}
			</div>
		);
	}

	if (!data) {
		return <div className={styles.error}>Nenhum dado disponível.</div>;
	} else return <>{renderData(data)}</>;
}
