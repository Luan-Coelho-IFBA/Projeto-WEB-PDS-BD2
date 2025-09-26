import { Loader2Icon } from "lucide-react";
import styles from "./styles.module.css";

type LoaderProps = {
    direction: "row" | "column";
    textMessage?: string;
} & React.ComponentProps<"svg">;

export function Loader({
    textMessage,
    direction,
    color,
    ...rest
}: LoaderProps) {
    return (
        <div
            className={`${styles.loadingContainer} ${
                direction === "column" ? styles.column : styles.row
            }
            `}
        >
            {textMessage && (
                <span className={styles.textMessage}>{textMessage}</span>
            )}
            <Loader2Icon
                {...rest}
                className={styles.loadingIcon}
                style={{ color: color ?? "var(--main-color)" }}
            />
        </div>
    );
}
