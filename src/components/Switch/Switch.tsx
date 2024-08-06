import React from "react";
import "./Switch.css";

interface SwitchProps extends React.HTMLAttributes<HTMLInputElement> {
	checked: boolean;
	onChange?: () => void;
	label?: string;
}

export const Switch = ({ checked, onChange, label, ...props }: SwitchProps) => {
	return (
		<label className='switch'>
			<input
				type='checkbox'
				checked={checked}
				onChange={onChange}
				{...props}
			/>
			<span className='slider'></span>
			{label && <label>{label}</label>}
		</label>
	);
};
