import React from "react";
import styles from "./styles.module.css";

type FormButtonProps = {
    nameButton?: string | React.ReactNode;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    type: "button" | "submit" | "reset";
} & React.ComponentProps<"button">;

export function FormButton({
    children,
    nameButton = "Confirmar",
    onClick,
    className,
    type,
    ...rest
}: FormButtonProps) {
    if (children) {
        return (
            <div className={`${styles.formRow} ${className || ""}`}>
                {children}
            </div>
        );
    }

    /* if (!nameButton || !onClick) {
		console.warn(
			"FormButton: nameButton e onClick são obrigatórios quando children não é fornecido"
		);
		return;
	} */

    return (
        <div className={`${styles.formRow} ${className || ""}`}>
            <button
                type={type}
                onClick={onClick}
                className={styles.button}
                {...rest}
            >
                {nameButton}
            </button>
        </div>
    );
}
