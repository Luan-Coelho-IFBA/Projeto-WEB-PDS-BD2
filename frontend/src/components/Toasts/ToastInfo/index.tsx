import { CheckIcon, CircleXIcon, InfoIcon, XIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./styles.module.css";

type ToastInfoProps = {
    message: string;
    type?: "info" | "warning" | "error" | "sucess";
    dismissible?: boolean;
};

export function ToastInfo({
    message,
    type = "info",
    dismissible = true,
}: ToastInfoProps) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            toast.dismiss("custom-info-toast");
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case "warning": {
                return <InfoIcon className={styles.iconWarning} />;
            }

            case "sucess": {
                return <CheckIcon className={styles.iconSucess} />;
            }
            case "error": {
                return <CircleXIcon className={styles.iconError} />;
            }
            default:
                return;
        }
    };

    return (
        <div
            className={`${styles.toast} ${styles[type]} ${
                isVisible ? styles.visible : styles.hidden
            }`}
        >
            <div className={styles.content}>
                <div className={styles.iconWrapper}>{getIcon()}</div>
                <div className={styles.messageContainer}>
                    <p className={styles.message}>{message}</p>
                </div>
            </div>
            {dismissible && (
                <button
                    onClick={handleClose}
                    className={styles.closeButton}
                    aria-label="Fechar notificação"
                >
                    <XIcon className={styles.closeIcon} />
                </button>
            )}
        </div>
    );
}
