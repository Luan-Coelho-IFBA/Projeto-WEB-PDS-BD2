import { Loader2Icon } from "lucide-react";
import styles from "./styles.module.css";
import React from "react";

type LoaderProps = {
    direction: "row" | "column";
    children: React.ReactNode;
} & React.ComponentProps<"div">;

Loader.Icon = IconLoader;
Loader.TextMessage = TextMessageLoader;

export function Loader({
    children,
    direction,
    className: addClassName,
    ...rest
}: LoaderProps) {
    return (
        <div
            className={`${styles.loadingContainer} ${
                direction === "column" ? styles.column : styles.row
            }
            ${addClassName ?? ""}`}
            {...rest}
        >
            {children}
        </div>
    );
}

type textMessageLoaderProps = {
    color: string;
    feedbackMessage: string;
    className?: string;
} & React.ComponentProps<"span">;

function TextMessageLoader({
    feedbackMessage,
    color,
    className,
    ...rest
}: textMessageLoaderProps) {
    return (
        <span style={{ color: color }} className={className ?? ""} {...rest}>
            {feedbackMessage}
        </span>
    );
}

type IconLoaderProps = {
    color?: string;
} & React.ComponentProps<"svg">;

function IconLoader({ color, ...rest }: IconLoaderProps) {
    return (
        <Loader2Icon
            {...rest}
            className={styles.loadingIcon}
            style={{ color: color ?? "var(--main-color)" }}
        />
    );
}
