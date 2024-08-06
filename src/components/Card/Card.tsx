import { Avatar, Button, Checkbox } from "../index";
import "./Card.css";

interface CardProps {
	avatar: string;
	id: number;
	login: string;
	isSelected: boolean;
	onSelect: () => void;
	editMode: boolean;
	url?: string;
}

export const Card = ({
	avatar,
	id,
	login,
	isSelected,
	onSelect,
	editMode,
	url,
}: CardProps) => {
	return (
		<div
			className='card'
			data-testid='user-card'
		>
			{editMode && (
				<Checkbox
					className='card__checkbox'
					isChecked={isSelected}
					onChange={onSelect}
					data-testid='card-checkbox'
				/>
			)}
			<Avatar avatar={avatar} />
			<p className='card__id'>{id}</p>
			<h1 className='card__login'>{login}</h1>

			<Button url={url}>View Profile</Button>
		</div>
	);
};
