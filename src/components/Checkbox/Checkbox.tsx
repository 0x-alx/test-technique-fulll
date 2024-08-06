import React from "react";
import "./Checkbox.css";

interface CheckboxProps extends React.HTMLAttributes<HTMLInputElement> {
	label?: string;
	isChecked: boolean;
	onChange?: () => void;
	className?: string;
	disabled?: boolean;
}

export const Checkbox = ({
	label,
	isChecked,
	onChange,
	className,
	disabled,
	...props
}: CheckboxProps) => {
	return (
		<div className='checkbox-container'>
			<input
				type='checkbox'
				checked={isChecked}
				onChange={onChange}
				disabled={disabled}
				className={`checkbox ${className}`}
				{...props}
			/>
			{label && <label>{label}</label>}
		</div>
	);
};
