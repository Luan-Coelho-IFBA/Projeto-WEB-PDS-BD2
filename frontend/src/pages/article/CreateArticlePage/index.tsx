import { useForm } from "react-hook-form";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

import styles from "./styles.module.css";

export function CreateArticlePage() {
    const {} = useForm();

    return (
        <DefaultLayout>
            <main className={styles.pageCointainer}>
                <form className={styles.formContainer}>
                    <label className={styles.formRow}>
                        TITULO
                        <input type="text" placeholder="Titulo do seu artigo" />
                    </label>
                    <label className={styles.formRow}>
                        SUBTITULO
                        <input
                            type="text"
                            placeholder="Informe a descrição do seu artigo"
                        />
                    </label>

                    <label className={styles.formRow}>
                        CONTEÚDO
                        <textarea
                            id={styles.textareaField}
                            placeholder="Informe o conteudo do seu artigo"
                        />
                    </label>

                    <div className={styles.formRow && styles.footerFields}>
                        <label className={styles.item}>
                            CAPA
                            <input type="file" />
                        </label>

                        <label className={styles.item}>
                            TIPO DE ARTIGO
                            <select>
                                <option>Entretenimento</option>
                            </select>
                        </label>
                    </div>
                </form>
            </main>
        </DefaultLayout>
    );
}
