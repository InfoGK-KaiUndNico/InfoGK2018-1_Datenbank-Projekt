import getCommonHeaders from './getCommonHeaders';
import getHost from './getHost';

export default async function loadZutatenByIds(zutaten: string[]) {
	const fullZutaten: any[] = [];
	// get zutaten data for all zutaten found in search
	for (const zutatName of zutaten) {
		const response = await fetch(`${getHost()}/ingredients/${zutatName}`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		if (!response.ok) {
			continue;
		}

		const zutat = await response.json();

		// Add to found ingredients
		fullZutaten.push(zutat);
	}

	return fullZutaten;
}
