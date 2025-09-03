import styles from './styles.module.css'

type ModalActionsProps = {
	children: React.ReactNode;
};

export function ModalActions({children}:ModalActionsProps) {
    return(
        <div className={styles.actionsContainer}>
            {children}
        </div>
    )
}
