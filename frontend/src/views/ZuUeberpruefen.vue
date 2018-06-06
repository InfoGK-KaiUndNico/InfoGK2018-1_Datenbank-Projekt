<template>
    <div class="container">
        <h2 class="mt-2">Hier sehen unüberprüfte Zutaten und Rezepte und können sie bestätigen</h2>
        <form id="formND" action="select.html">
			<div class="row">
				<div class="col-6 mt-2">
					<button class="accordion" @click="showRezepte">Unüberprüfte Rezepte</button>
					<div id="unueberpruefteRezepte" class="panel">
						<ul display="none">
							<li v-for="rezept in Rezepte" v-bind:key="rezept.name">
								<RezeptListElement v-bind:rezept="rezept"/>
							</li>
						</ul>
					</div>
				</div>
				<div class="col-6 mt-2">
					<button class="accordion" @click="showZutaten">Unüberprüfte Zutaten</button>
					<div id="unueberpruefteZutaten" class="panel">
						<ul display="none">
							<li v-for="rezept in Zutaten" v-bind:key="rezept.name">
								<ZutatListElement v-bind="rezept"/>
							</li>
						</ul>
					</div>
				</div>
			</div>
        </form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import checkUserdata from '../lib/util/checkUserInput';
import getCommonHeaders from '../lib/util/getCommonHeaders';
import RezeptListElement from '../components/RezeptListElement.vue';
import ZutatListElement from '../components/ZutatListElement.vue';
import loadRecipesByIds from '../lib/util/loadRecipesByIds';

import validator from 'validator';

@Component({})
export default class Nutzerdaten extends Vue {

	private Rezepte: any[] = [];
	private Zutaten: any[] = [];

	private async showRezepte() {
		const unueberpruefteRezepte = document.getElementById('#unueberpruefteRezepte')!;
		if (unueberpruefteRezepte.style.display === 'block') {
			unueberpruefteRezepte.style.display = 'none';
			return;
		}

		unueberpruefteRezepte.style.display = 'block';

		const response = await fetch(`http://localhost:4000/recipes`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		if (!response.ok) {
			this.Rezepte[0] = { message: 'Suche fehlgeschlagen', value: 'error' };
			return;
		}

		const { recipes }: { recipes: string[] } = await response.json();

		// Load full recipe data by ids
		this.Rezepte = await loadRecipesByIds(recipes);
		return;
	}

	private async showZutaten() {
		const unueberpruefteZutaten = document.getElementById('#unueberpruefteZutaten')!;
		if (unueberpruefteZutaten.style.display === 'block') {
			unueberpruefteZutaten.style.display = 'none';
			return;
		}

		unueberpruefteZutaten.style.display = 'block';

		const response = await fetch(`http://localhost:4000/recipes`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		if (!response.ok) {
			this.Zutaten[0] = { message: 'Suche fehlgeschlagen', value: 'error' };
			return;
		}

		const { recipes }: { recipes: string[] } = await response.json();

		// Load full recipe data by ids
		this.Zutaten = await loadRecipesByIds(recipes);
		return;
	}
}
</script>
