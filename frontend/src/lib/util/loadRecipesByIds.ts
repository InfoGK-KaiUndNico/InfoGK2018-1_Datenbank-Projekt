import getCommonHeaders from './getCommonHeaders';

export default async function loadRecipesByIds(recipes: string[]) {
	const fullRecipes: any[] = [];
	for (const recipeId of recipes) {
		const response = await fetch(`http://localhost:4000/recipes/${recipeId}`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		if (!response.ok) {
			continue;
		}

		const recipe = await response.json();

		// Add to found recipes
		fullRecipes.push(recipe);

	}

	return fullRecipes;
}
