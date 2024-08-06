import "./App.css";
import { useState } from "react";
import { Navbar, Input, Card, Checkbox, Switch } from "./components";
import { Trash2, Copy } from "lucide-react";
import { User } from "./types";

function App() {
	const [inputValue, setInputValue] = useState<string>("");
	const [userList, setUserList] = useState<User[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [editMode, setEditMode] = useState<boolean>(false);

	// Fetch Github user and set user list
	const fetchGithubUser = async (username: string) => {
		setError(null);
		const response = await fetch(
			`https://api.github.com/search/users?q=${username}`
		);

		if (response.status === 403) {
			//If the rate limit is exceeded, set error
			setError("Rate limit exceeded");
		} else if (response.status === 422) {
			//If the user is not found, set error
			setError("Validation failed, or the endpoint has been spammed.");
		} else if (response.status === 503) {
			//If the service is unavailable, set error
			setError("Service unavailable");
		} else {
			//If no error, set user list
			const data = await response.json();
			if (data.items.length === 0) {
				setError("No user found");
			} else {
				setUserList(data.items);
			}
		}
	};

	// Handle input change function
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedUsers([]);
		setInputValue(e.target.value);
		fetchGithubUser(e.target.value);
	};

	// Handle delete function
	const handleDelete = (usersToDelete: string[]) => {
		//Remove user from user list Array
		const updatedUserList = userList.filter(
			(user: User) => !usersToDelete.includes(user.node_id)
		);

		//Remove user from selected users Array
		const updatedSelectedUsers = selectedUsers.filter(
			(user: string) => !usersToDelete.includes(user)
		);

		setSelectedUsers(updatedSelectedUsers);
		setUserList(updatedUserList);
	};

	// Handle duplicate function
	const handleDuplicate = (usersToDuplicate: string[]) => {
		const updatedUserList = userList
			.filter((user: User) => usersToDuplicate.includes(user.node_id))
			.map((user: User) => ({
				...user,
				node_id: (Date.now() + Math.random()).toString(), // Génère un nouvel ID unique
			}));

		//Add the duplicated users to the user list
		setUserList([...userList, ...updatedUserList]);

		//Add the new IDs to the selected users list
		setSelectedUsers([]);
	};

	return (
		<div className='App'>
			<Navbar />
			<div className='input-container'>
				<img
					className='github-logo'
					src='https://cdn-icons-png.flaticon.com/512/25/25231.png'
					alt='GitHub Logo'
					height={200}
					width={200}
				/>
				<div className='input-container__content'>
					<h1>Find Github users easily</h1>
					<Input
						type='search'
						placeholder='Search for a Github user...'
						value={inputValue}
						onChange={handleInputChange}
						className='input'
						data-testid='search-input'
					/>
				</div>
			</div>
			<div>
				<Switch
					checked={editMode}
					onChange={() => {
						setEditMode(!editMode);
					}}
					label={editMode ? "Edit mode ON" : "Edit mode OFF"}
					data-testid='edit-mode-switch'
				/>
			</div>

			<div className='options-container'>
				{editMode && (
					<>
						<Checkbox
							label={
								selectedUsers.length > 0
									? `${selectedUsers.length} elements selected`
									: "Select all"
							}
							isChecked={selectedUsers.length > 0}
							onChange={() => {
								//If the user is already selected, remove him from the list
								if (selectedUsers.length > 0) {
									setSelectedUsers([]);
								} else {
									//If the user is not selected, add him to the list
									setSelectedUsers(
										userList.map(
											(user: User) => user.node_id
										)
									);
								}
							}}
							disabled={userList?.length === 0}
							data-testid='select-all-button'
						/>

						<div>
							<Copy
								className='icon'
								onClick={() => handleDuplicate(selectedUsers)}
								data-testid='duplicate-button'
							/>
							<Trash2
								className='icon'
								color='red'
								onClick={() => {
									handleDelete(selectedUsers);
								}}
								data-testid='delete-button'
							/>
						</div>
					</>
				)}
			</div>
			<div className='card-container'>
				{userList?.length > 0 &&
					userList.map((user: User) => (
						<Card
							key={user.node_id}
							url={user.html_url}
							editMode={editMode}
							avatar={user.avatar_url}
							id={user.id}
							login={user.login}
							isSelected={selectedUsers.includes(user.node_id)}
							onSelect={() => {
								//If the user is already selected, remove him from the list
								if (selectedUsers.includes(user.node_id)) {
									setSelectedUsers((prev: string[]) =>
										prev.filter(
											(id: string) => id !== user.node_id
										)
									);
								} else {
									//If the user is not selected, add him to the list
									setSelectedUsers((prev: string[]) => [
										...prev,
										user.node_id,
									]);
								}
							}}
						/>
					))}
			</div>
			{error && (
				<div className='error-container'>
					<strong
						className='error'
						data-testid='error-message'
					>
						{error}
					</strong>
				</div>
			)}
		</div>
	);
}

export default App;
