import { useQuery } from "@tanstack/react-query";
import { Header } from "../../components/Header";

import styles from "./styles.module.css";
import { getMe } from "../../services/auth/getMe";
import { useEffect } from "react";
import { useNavigate } from "react-router";

type DefaultLayoutProps = {
    children: React.ReactNode;
    className?: string;
    authenticated?: boolean;
};

export function DefaultLayout({
    children,
    className,
    authenticated = false,
}: DefaultLayoutProps) {
    const navigation = useNavigate();
    const getMeQuery = useQuery({
        queryKey: ["getAuthenticated"],
        queryFn: () => getMe(navigation),
        enabled: authenticated,
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    return (
        <div className={`${styles.container} ${className ? className : ""}`}>
            <Header />
            {children}
        </div>
    );
}
