import getCommonHeaders from './getCommonHeaders';

export default async function loadZutaten() {
	let Zutaten: any[] = [];

	// get all ingredients
	const response = await fetch('http://localhost:4000/ingredients', {
		headers: getCommonHeaders(),
		method: 'GET',
		mode: 'cors'
	});

	if (!response.ok) {
		throw new Error('Fehler beim Laden der Daten');
	}

	// transform and handle response data
	const { zutaten }: { zutaten: string[] } = await response.json();
	return Zutaten = zutaten.map((zutat: string) => ({ name: zutat, value: zutat}));
}
