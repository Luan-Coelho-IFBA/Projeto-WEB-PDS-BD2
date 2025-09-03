import "./styles.module.css";

type ModalHeaderProps = {
	title: string;
};

export function ModalHeader({ title }: ModalHeaderProps) {
	return <h1 className="header">{title}</h1>;
}
