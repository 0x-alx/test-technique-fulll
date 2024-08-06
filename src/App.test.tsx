import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

test("Rechercher un user", () => {
	render(<App />);
	const input = screen.getByTestId("search-input");
	fireEvent.change(input, {
		target: { value: "0x-alx" },
	});
	expect(input).toHaveValue("0x-alx");
});

test("fetchGithubUser - différents cas de figure", async () => {
	render(<App />);

	const input = screen.getByTestId("search-input");

	// Cas où la limite de taux est dépassée
	global.fetch = jest.fn(() =>
		Promise.resolve({
			status: 403,
			json: () => Promise.resolve({}),
		})
	) as jest.Mock;
	fireEvent.change(input, { target: { value: "rate-limit-exceeded" } });
	await waitFor(() => {
		const errorMessage = screen.queryByTestId("error-message");
		expect(errorMessage).toHaveTextContent("Rate limit exceeded");
	});

	// Cas où l'utilisateur n'est pas trouvé
	global.fetch = jest.fn(() =>
		Promise.resolve({
			status: 422,
			json: () => Promise.resolve({}),
		})
	) as jest.Mock;
	fireEvent.change(input, { target: { value: "user-not-found" } });
	await waitFor(() => {
		const errorMessage = screen.queryByTestId("error-message");
		expect(errorMessage).toHaveTextContent(
			"Validation failed, or the endpoint has been spammed."
		);
	});

	// Cas où le service est indisponible
	global.fetch = jest.fn(() =>
		Promise.resolve({
			status: 503,
			json: () => Promise.resolve({}),
		})
	) as jest.Mock;
	fireEvent.change(input, { target: { value: "service-unavailable" } });
	await waitFor(() => {
		const errorMessage = screen.queryByTestId("error-message");
		expect(errorMessage).toHaveTextContent("Service unavailable");
	});

	// Cas où aucun utilisateur n'est trouvé
	global.fetch = jest.fn(() =>
		Promise.resolve({
			status: 200,
			json: () => Promise.resolve({ items: [] }),
		})
	) as jest.Mock;
	fireEvent.change(input, { target: { value: "no-user-found" } });
	await waitFor(() => {
		const errorMessage = screen.queryByTestId("error-message");
		expect(errorMessage).toHaveTextContent("No user found");
	});

	// Cas où des utilisateurs sont trouvés
	global.fetch = jest.fn(() =>
		Promise.resolve({
			status: 200,
			json: () =>
				Promise.resolve({
					items: [
						{
							node_id: "1",
							html_url: "https://github.com/user1",
							avatar_url:
								"https://avatars.githubusercontent.com/u/1?v=4",
							id: 1,
							login: "user1",
						},
						{
							node_id: "2",
							html_url: "https://github.com/user2",
							avatar_url:
								"https://avatars.githubusercontent.com/u/2?v=4",
							id: 2,
							login: "user2",
						},
					],
				}),
		})
	) as jest.Mock;
	fireEvent.change(input, { target: { value: "users-found" } });
	await waitFor(() => {
		const user1 = screen.queryByText("user1");

		expect(user1).toBeInTheDocument();
	});
});

test("Suppression d'un item", async () => {
	render(<App />);

	// Ajouter un utilisateur pour le test
	const input = screen.getByTestId("search-input");
	fireEvent.change(input, {
		target: { value: "0x-alx" },
	});
	const card = screen.getAllByTestId("user-card");
	expect(card).toBeInTheDocument();

	// Attendre que les utilisateurs soient chargés
	const user = await screen.findByText("0x-alx");
	expect(card).toHaveTextContent("0x-alx");

	// Mettre en mode édition
	const editMode = screen.getByTestId("edit-mode-switch");
	fireEvent.click(editMode);
	expect(editMode).toBeChecked();

	// Sélectionner l'utilisateur à supprimer
	const checkbox = screen.getByTestId("card-checkbox");
	fireEvent.click(checkbox);

	// Cliquer sur le bouton de suppression
	const deleteButton = screen.getByTestId("delete-button");
	fireEvent.click(deleteButton);

	// Vérifier que l'utilisateur a été supprimé
	await waitFor(() => expect(user).not.toBeInTheDocument());
});

test("Duplication d'un item", async () => {
	render(<App />);
});

test("Suppression de tous les items", async () => {
	render(<App />);
});

test("Duplication de tous les items", async () => {
	render(<App />);
});
