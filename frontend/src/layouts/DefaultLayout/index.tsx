import { Header } from "../../components/Header";

import styles from "./styles.module.css";

type DefaultLayoutProps = {
    children: React.ReactNode;
    className?: string;
};

export function DefaultLayout({ children, className }: DefaultLayoutProps) {
    return (
        <div className={`${styles.container} ${className ? className : ""}`}>
            <Header />
            {children}
        </div>
    );
}
