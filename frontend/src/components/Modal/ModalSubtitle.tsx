type ModalSubtitleProps = {
	subtitle: string;
} & React.ComponentProps<"p">;

import styles from './styles.module.css'

export function ModalSubtitle({ subtitle, ...rest }: ModalSubtitleProps) {
	return <p className={styles.subtitle} {...rest}>{subtitle}</p>;
}
