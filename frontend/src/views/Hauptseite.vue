<template>
    <div class="container">
        <h2 class="mt-1">Hier geben sie Rezepte ein, suchen sie und sehen ihre Infos.</h2>
        <form id="formHS" action="select.html">
            <div class="row">
                <div class="col-1">
                    <router-link to="/neues-rezept">
                        <span class="btn btn-primary mt-3 mb-1 mr-5">
                            Neues Rezept
                        </span>
                    </router-link>
                </div>
                <div class="col-1">
                    <router-link to="/nutzerdaten">
                        <span class="btn btn-primary mt-3 mb-1 ml-5 mr-5">
                            Nutzerdaten
                        </span>
                    </router-link>
                </div>
            </div>
            <div class="row">
                <div class="col-3">
                    <label>Rezeptsuche</label>
                    <input class="form-control" placeholder="Suche" v-model="Rezeptsuche"/>
                </div>
                <div class="col-3">
                    <label>Zutatensuche</label>
                    <select v-model="selectedZutat" class="form-control">
                        <option v-for="option in Zutaten" v-bind:key="option.name" v-bind:value="option.value">
                                {{ option.name }}
                        </option>
                    </select>
                </div>
                <div class="col-3">
                    <label>Suche nach Art</label>
                    <select v-model="selectedArt" class="form-control">
                        <option v-for="option in rezeptArten" v-bind:key="option.name" v-bind:value="option.value">
                                {{ option.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p id="paragraphHS1">
                        <span>
                            <ul>
  								<li v-for="rezept in gefundeneRezepte" v-bind:key="rezept.name">
									<RezeptListElement v-bind="rezept"/>
  								</li>
							</ul>
                        </span>
                    </p>
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

@Component({components: { RezeptListElement }})
export default class Hauptseite extends Vue {
	private Rezeptsuche: string = '';

	private rezeptArten: any[] = [
		{ name: '---', value: 'none' },
		{ name: 'Fleisch', value: 'Fleisch' },
		{ name: 'Obst und Nüsse', value: 'ObstUndNuesse' },
		{ name: 'Gemüse', value: 'Gemuese' },
		{ name: 'Gewürz', value: 'Gewuerz' },
		{ name: 'trocken', value: 'trocken' },
		{ name: 'Herzhaft', value: 'Herzhaft' },
		{ name: 'Süß', value: 'Suess' },
		{ name: 'andere', value: 'andere' }
	];

	private selectedArt: any = this.rezeptArten[0];
	private selectedZutat: any = this.rezeptArten[0];

	private Zutaten: any[] = [];
	private gefundeneRezepte: any[] = [];

	private async loadZutaten() {

		// get all ingredients
		const response = await fetch('url', {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		if (!response.ok) {
			this.Zutaten[0] = { name: 'Fehler beim Laden der Daten', value: 'error' };
			return;
		}

		// output data
		const { zutaten }: { zutaten: string[] } = await response.json();
		const normalizedZutaten = zutaten.map((zutat: string) => ({ name: zutat, value: zutat}));
		this.Zutaten = [{ name: '---', value: 'none'}, ...normalizedZutaten];
	}

	// suche (check input + ausgabe)
	private async OutputSearch(event: MouseEvent) {
		event.preventDefault();

		// search zutat
		if (checkUserdata(this.Rezeptsuche, 100, { checkWhitespace: false, checkLength: true }) === false && this.selectedArt.value === 'none') {
			const response = await fetch('url', {
				body: JSON.stringify({
					selectedZutat: this.selectedZutat.value,
				}),
				headers: getCommonHeaders(),
				method: 'POST',
				mode: 'cors'
			});

			if (!response.ok) {
				this.gefundeneRezepte[0] = { message: 'Suche fehlgeschlagen', value: 'error' };
			}

			return;
		}

		// search art
		if (checkUserdata(this.Rezeptsuche, 100, { checkWhitespace: false, checkLength: true }) === false && this.selectedZutat.value === 'none') {
			const response = await fetch('url', {
				body: JSON.stringify({
					selectedArt: this.selectedArt.value,
				}),
				headers: getCommonHeaders(),
				method: 'POST',
				mode: 'cors'
			});

			if (!response.ok) {
				this.gefundeneRezepte[0] = {message: 'Suche fehlgeschlagen', value: 'error'};
			}
			return;
		}

		// search rezept
		if (this.selectedZutat.value === 'none' && this.selectedArt.value === 'none') {
			const response = await fetch('url', {
				body: JSON.stringify({
					Rezeptsuche: this.Rezeptsuche,
				}),
				headers: getCommonHeaders(),
				method: 'POST',
				mode: 'cors'
			});

			if (!response.ok) {
				this.gefundeneRezepte[0] = {message: 'Suche fehlgeschlagen', value: 'error'};
			}

			return;
		}

		this.gefundeneRezepte[0] = { message: 'Suche fehlgeschlagen, bitte nur nach einem Wert suchen', value: 'ErrordoubleInput' };
	}
}
</script>
