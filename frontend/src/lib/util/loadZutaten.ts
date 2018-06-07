import getCommonHeaders from './getCommonHeaders';
import getHost from './getHost';

export default async function loadZutaten() {
	// get all ingredients
	const response = await fetch(`${getHost()}/ingredients`, {
		headers: getCommonHeaders(),
		method: 'GET',
		mode: 'cors'
	});

	if (!response.ok) {
		throw new Error('Fehler beim Laden der Daten');
	}

	// transform and handle response data
	const { zutaten }: { zutaten: string[] } = await response.json();
	return zutaten.map((zutat: string) => ({ name: zutat, value: zutat }));
}
