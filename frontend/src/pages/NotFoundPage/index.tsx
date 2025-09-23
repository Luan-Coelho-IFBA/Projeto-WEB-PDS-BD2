import { useEffect, useRef, useState } from "react";
import { DefaultLayout } from "../../layouts/DefaultLayout";
import { useNavigate } from "react-router";
import { PageRoutesName } from "../../constants/PageRoutesName";

import styles from "./styles.module.css";

export function NotFoundPage() {
    const [time, setTime] = useState(10);
    const timeout = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        if (time <= 0) {
            navigate(PageRoutesName.home);
        }

        return () => {
            clearTimeout(timeout.current);
        };
    }, [time]);

    return (
        <DefaultLayout className={styles.container}>
            <main className={styles.section}>
                <h2>Pagina não encontrada</h2>
                <p>Redirecionando em: {time}s</p>
            </main>
        </DefaultLayout>
    );
}
