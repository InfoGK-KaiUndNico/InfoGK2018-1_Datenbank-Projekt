<template>
    <div class="container">
        <h2 class="mt-1">Hier geben sie Rezepte ein, suchen sie und sehen ihre Infos.</h2>
        <form id="formHS" action="select.html">
            <div class="row mt-3">
                <div class="col-12">
                    <router-link to="/neues-rezept">
                        <span class="btn btn-primary mb-1 mr-1">
                            Neues Rezept
                        </span>
                    </router-link>
					<router-link to="/neue-zutat">
                        <span class="btn btn-primary mb-1 mr-1"> 
                            Neue Zutat 
                        </span> 
					</router-link>
					 <router-link to="/nutzerdaten">
                        <span class="btn btn-primary mb-1">
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
                        <option v-for="option in Zutaten" v-bind:key="option.name">
							{{ option.name }}
                        </option>
                    </select>
                </div>
                <div class="col-3">
                    <label>Suche nach Art</label>
                    <select v-model="selectedArt" class="form-control">
                        <option v-for="option in rezeptArten" v-bind:key="option.name">
							{{ option.name }}
                        </option>
                    </select>
                </div>
            </div>
			<div class="row">
				<div class="col-1 mt-3">
                        <span class="btn btn-primary">
                            Suchen
                        </span>
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
import loadZutaten from '../lib/util/loadZutaten';
import loadRecipesByIds from '../lib/util/loadRecipesByIds'

import RezeptListElement from '../components/RezeptListElement.vue';

@Component({components: { RezeptListElement }})
export default class Hauptseite extends Vue {
	private Rezeptsuche: string = '';

	private Zutaten: any[] = [];
	private rezeptArten: any[] = [
		{ name: 'Fleisch', value: 'Fleisch' },
		{ name: 'Obst und Nüsse', value: 'ObstUndNuesse' },
		{ name: 'Gemüse', value: 'Gemuese' },
		{ name: 'Gewürz', value: 'Gewuerz' },
		{ name: 'trocken', value: 'trocken' },
		{ name: 'Herzhaft', value: 'Herzhaft' },
		{ name: 'Süß', value: 'Suess' },
		{ name: 'andere', value: 'andere' }
	];

	private selectedArt: string = '';
	private selectedZutat: string = '';

	private gefundeneRezepte: any[] = [];

	private async mounted() {
		try {
			const zutaten = await loadZutaten();
			this.Zutaten = zutaten;
		} catch (err) {
			// Handle errors
			return;
		}
	}

	// suche (check input + ausgabe)
	private async OutputSearch(event: MouseEvent) {
		event.preventDefault();

		// search zutat if rezeptsuche and Art empty
		if (this.Rezeptsuche.length < 1 && typeof this.selectedArt === 'undefined') {
			
			const response = await fetch('url', {
				body: JSON.stringify({
					selectedZutat: this.selectedZutat,
				}),
				headers: getCommonHeaders(),
				method: 'POST',
				mode: 'cors'
			});

			if (!response.ok) {
				this.gefundeneRezepte[0] = { message: 'Suche fehlgeschlagen', value: 'error' };
				return;
			}
			// TODO output search
			return;
		}

		// search art if Rezeptsuche and Zutat empty
		if (this.Rezeptsuche.length < 1 && typeof this.selectedZutat === 'undefined') {
			// Load recipeIds
			const response = await fetch(`http://localhost:4000/recipes?art=${encodeURIComponent(this.selectedArt)}`, {
				headers: getCommonHeaders(),
				method: 'GET',
				mode: 'cors'
			});

			if (!response.ok) {
				this.gefundeneRezepte[0] = { message: 'Suche fehlgeschlagen', value: 'error' };
				return;
			}

			const { recipes }: { recipes: string[] } = await response.json();

			// Load full recipe data by ids
			this.gefundeneRezepte = await loadRecipesByIds(recipes);
			return;
		}

		// search rezept if Zutat and Art empty
		if (typeof this.selectedZutat === 'undefined' && typeof this.selectedArt === 'undefined') {

			// check input and search
			if (checkUserdata(this.Rezeptsuche, 100, { checkWhitespace: false, checkLength: true }) === true) {
				const response = await fetch(`http://localhost:4000/recipes?name=${encodeURIComponent(this.Rezeptsuche)}`, {
					headers: getCommonHeaders(),
					method: 'POST',
					mode: 'cors'
				});

				if (!response.ok) {
					this.gefundeneRezepte[0] = { message: 'Suche fehlgeschlagen', value: 'error' };
					return;
				}
				
				const { recipes }: { recipes: string[] } = await response.json();

				// Load full recipe data by ids
				this.gefundeneRezepte = await loadRecipesByIds(recipes);
				return;
			}
		}
		this.gefundeneRezepte[0] = { message: 'Suche fehlgeschlagen, bitte nur nach einem Wert suchen', value: 'ErrordoubleInput' };
	}
}
</script>
