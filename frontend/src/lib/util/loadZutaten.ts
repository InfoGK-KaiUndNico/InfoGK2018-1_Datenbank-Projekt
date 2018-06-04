import getCommonHeaders from './getCommonHeaders';

export default async function loadZutaten() {
	let Zutaten: any[] = [];

	// get all ingredients
	const response = await fetch('url', {
		headers: getCommonHeaders(),
		method: 'GET',
		mode: 'cors'
	});

	if (!response.ok) {
		Zutaten[0] = { name: 'Fehler beim Laden der Daten', value: 'error' };
		return Zutaten;
	}

	// transform and handle response data
	const { zutaten }: { zutaten: string[] } = await response.json();
	return Zutaten = zutaten.map((zutat: string) => ({ name: zutat, value: zutat}));
}
