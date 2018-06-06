import getCommonHeaders from './getCommonHeaders';

// get full recipe data for each recipe in a list of recipes
export default async function loadRecipesByIds(recipes: string[]) {
	const fullRecipes: any[] = [];
	// for each recipe in the list
	for (const recipeId of recipes) {
		// get corresponding data
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
