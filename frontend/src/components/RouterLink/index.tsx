import { Link } from "react-router";

import styles from "./styles.module.css";

type RouterLinkProps = {
    children: React.ReactNode;
    href: string;
} & React.ComponentProps<"a">;

export function RouterLink({ href, children, ...props }: RouterLinkProps) {
    return (
        <Link className={styles.link} to={href} {...props}>
            {children}
        </Link>
    );
}
