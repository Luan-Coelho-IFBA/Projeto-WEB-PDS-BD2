import { useQuery } from "@tanstack/react-query";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import { getWriters } from "../../../services/auth/getWriters";
import styles from "./styles.module.css";
import { TrashIcon } from "lucide-react";

export function ManageWritersPage() {
    const getWritersQuery = useQuery({
        queryKey: ["getWriters"],
        queryFn: () => getWriters(),
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    return (
        <DefaultLayout className={styles.generalContainer} authenticated>
            <main className={styles.sectionContainer}>
                <h2 className={styles.title}>Gerenciamento de jornalistas</h2>
                <table className={styles.tableList}>
                    <thead>
                        <tr>
                            <th>Nome do Jornalista</th>
                            <th>ID do Jornalista</th>
                            <th>Remover</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getWritersQuery.isSuccess &&
                            getWritersQuery.data.length > 0 &&
                            getWritersQuery.data.map((writer) => (
                                <tr
                                    key={writer.id}
                                    className={styles.tableLineData}
                                >
                                    <td>
                                        <span>{writer.name}</span>
                                    </td>
                                    <td>
                                        <span>{writer.id}</span>
                                    </td>
                                    {/* REMOVER CATEGORIA */}
                                    <td
                                        className={styles.iconAction}
                                        // onClick={() => {
                                        //     setSelectedCategoryEdit(
                                        //         category
                                        //     );
                                        //     setModalRemoveCategory(
                                        //         (prev) => !prev
                                        //     );
                                        // }}
                                    >
                                        <TrashIcon color="red" />
                                        <span>Remover jornalista</span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </main>
        </DefaultLayout>
    );
}
