import { BookOpenIcon, PenToolIcon, ShieldIcon, UserIcon } from "lucide-react";

import styles from "./styles.module.css";

export function getRoleIcon(role: string) {
    switch (role) {
        case "ADMIN":
            return <ShieldIcon className={styles.roleIcon} />;
        case "JORNALISTA":
            return <PenToolIcon className={styles.roleIcon} />;
        case "LEITOR":
            return <BookOpenIcon className={styles.roleIcon} />;
        default:
            return <UserIcon className={styles.roleIcon} />;
    }
}

export function getTextFromRoleName(role: string) {
    switch (role) {
        case "ADMIN":
            return "Administrador";
        case "JORNALISTA":
            return "Jornalista";
        case "LEITOR":
            return "Leitor";
        default:
            return "Usuário";
    }
}
