import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	type: string;
	placeholder: string;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	className: string;
}

export const Input = ({
	type,
	placeholder,
	value,
	onChange,
	className,
	...props
}: InputProps) => {
	return (
		<input
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			className={`input ${className}`}
			{...props}
		/>
	);
};
