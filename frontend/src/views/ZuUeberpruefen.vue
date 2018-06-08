<template>
    <div class="container">
        <h2 class="mt-2">Hier sehen Sie unüberprüfte Zutaten und Rezepte und können sie bestätigen</h2>
        <form id="formND" action="select.html">
			<div class="row">
				<router-link to="/hauptseite">
					<span class="btn btn-outline-secondary">Zurück</span>
				</router-link>
			</div>
			<div class="row">
				<div class="col-6 mt-2">
					<div id="unueberpruefteRezepte" class="panel">
						<p v-show="Rezepte.length < 1">Keine Rezepte zu überprüfen!</p>
						<ul class="list-group">
							<li class="list-group-item" v-for="rezept in Rezepte" v-bind:key="rezept.id">
								<RezeptListElement v-bind:rezept="rezept"/>
							</li>
						</ul>
					</div>
				</div>
				<div class="col-6 mt-2">
					<div id="unueberpruefteZutaten" class="panel">
						<p v-show="Zutaten.length < 1">Keine Zutaten zu überprüfen!</p>
						<ul class="list-group">
							<li class="list-group-item" v-for="zutat in Zutaten" v-bind:key="zutat.name">
								<ZutatListElement v-bind:zutat="zutat"/>
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
import validator from 'validator';

import checkUserdata from '../lib/util/checkUserInput';
import getCommonHeaders from '../lib/util/getCommonHeaders';
import RezeptListElement from '../components/RezeptListElement.vue';
import ZutatListElement from '../components/ZutatListElement.vue';
import loadRecipesByIds from '../lib/util/loadRecipesByIds';
import loadZutatenByIds from '../lib/util/loadZutatenByIds';
import checkLoggedIn from '@/lib/util/checkLoggedIn';
import getHost from '@/lib/util/getHost';

@Component({ components: { ZutatListElement, RezeptListElement } })
export default class ZuUeberpruefen extends Vue {
	private Rezepte: any[] = [];
	private Zutaten: any[] = [];

	private mounted() {
		if (!checkLoggedIn()) {
			return this.$router.push('/anmeldung');
		}

		this.showRezepte();
		this.showZutaten();
	}

	private async showRezepte() {
		/*const unueberpruefteRezepte = document.getElementById('#unueberpruefteRezepte')!;
		if (unueberpruefteRezepte.style.display === 'block') {
			unueberpruefteRezepte.style.display = 'none';
			return;
		}

		unueberpruefteRezepte.style.display = 'block';*/

		const response = await fetch(`${getHost()}/recipes`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		if (!response.ok) {
			// TODO Handle error
			return;
		}

		const { recipes }: { recipes: string[] } = await response.json();

		// Load full recipe data by ids
		const unfilteredRezepte = await loadRecipesByIds(recipes);
		this.Rezepte = unfilteredRezepte.filter((rezept) => rezept.review === null);
		return;
	}

	private async showZutaten() {
		/*const unueberpruefteZutaten = document.getElementById('#unueberpruefteZutaten')!;
		if (unueberpruefteZutaten.style.display === 'block') {
			unueberpruefteZutaten.style.display = 'none';
			return;
		}

		unueberpruefteZutaten.style.display = 'block';*/

		const response = await fetch(`${getHost()}/ingredients?nofilter=true`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		if (!response.ok) {
			// TODO Handle error
			return;
		}

		const { zutaten }: { zutaten: string[] } = await response.json();

		const unfilteredIngredients = await loadZutatenByIds(zutaten);
		this.Zutaten = unfilteredIngredients.filter((zutat) => zutat.review === null);
		return;
	}
}
</script>
