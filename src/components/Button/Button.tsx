import React from "react";
import "./Button.css";

interface ButtonProps {
	children: React.ReactNode;
	url?: string;
}

export const Button = ({ children, url }: ButtonProps) => {
	return (
		<a
			href={url}
			target='_blank'
			rel='noopener noreferrer'
		>
			<button className='button'>{children}</button>
		</a>
	);
};
