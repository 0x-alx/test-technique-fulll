import "./Avatar.css";

interface AvatarProps {
	avatar: string;
}

export const Avatar = ({ avatar }: AvatarProps) => {
	return (
		<img
			className='avatar'
			src={avatar}
			alt='avatar'
			width={80}
			height={80}
		/>
	);
};
