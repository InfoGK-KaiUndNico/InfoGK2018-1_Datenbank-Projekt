<template>
    <div class="container">
        <h2 class="mt-1">Hier geben sie Rezepte ein, suchen sie und sehen ihre Infos.</h2>
        <form id="formHS" action="select.html">
            <div class="row mt-3">
              	<div class="col-12">
					<span class="mr-3">Shortcuts</span>
                    <router-link to="/neues-rezept">
                        <span class="btn btn-primary mr-1">
                            Neues Rezept
                        </span>
                    </router-link>
					<router-link to="/neue-zutat">
                        <span class="btn btn-primary ml-1 mr-1"> 
                            Neue Zutat 
                        </span> 
					</router-link>
					<router-link to="/nutzerdaten">
                        <span class="btn btn-primary ml-1 mr-1">
                            Nutzerdaten
                        </span>
                    </router-link>
					<router-link to="/unbestaetigt">
						<span v-show="canReview" class="btn btn-primary ml-1">
							Überprüfen
						</span>
					</router-link>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-3">
                    <label>Rezeptsuche</label>
                    <input class="form-control" placeholder="Suche" v-model="selectedName"/>
                </div>
                <div class="col-3">
                    <label>Zutatensuche</label>
                    <select v-model="selectedZutaten" class="form-control" multiple>
                        <option v-for="option in Zutaten" v-bind:key="option.name">
							{{ option.name }}
                        </option>
                    </select>
                </div>
                <div class="col-3">
                    <label>Suche nach Art</label>
                    <select v-model="selectedArten" class="form-control" multiple>
                        <option v-for="option in rezeptArten" v-bind:key="option.name">
							{{ option.name }}
                        </option>
                    </select>
                </div>
            </div>
			<div class="row mt-3">
				<div class="col-12">
					<button class="btn btn-primary mr-3" @click="OutputSearch">
						Suchen
					</button>
					<button class="btn btn-outline-secondary" @click="clearInputs">
						Clear
					</button>
				</div>
			</div>
            <div class="row mt-3">
                <div class="col-12">
					<p>Suchergebnisse</p>
					<p v-show="this.gefundeneRezepte.length < 1">Keine Suchergebnisse gefunden.</p>
                    <p id="paragraphHS1">
                        <span>
                            <ul class="list-group">
  								<li class="list-group-item" v-for="rezept in gefundeneRezepte" v-bind:key="rezept.id">
									<RezeptListElement v-bind:rezept="rezept"/>
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
import loadRecipesByIds from '../lib/util/loadRecipesByIds';
import RezeptListElement from '../components/RezeptListElement.vue';

@Component({components: { RezeptListElement }})
export default class Hauptseite extends Vue {
	private Zutaten: any[] = [];
	private rezeptArten: any[] = ['Salat', 'Vorspeise', 'Hauptspeise', 'Nachtisch', 'Aufstrich', 'süß', 'herzhaft', 'andere'].map((zutat) => ({ name: zutat, value: zutat }));

	private selectedArten: string[] = [];
	private selectedZutaten: string[] = [];
	private selectedName: string = '';

	private gefundeneRezepte: any[] = [];

	private canReview: boolean = false;

	private async mounted() {
		try {
			const zutaten = await loadZutaten();
			this.Zutaten = zutaten;
		} catch (err) {
			// Handle errors
			return;
		}

		this.canReview = localStorage.getItem('userRang') === 'Admin';
	}

	private clearInputs(event: MouseEvent) {
		event.preventDefault();

		this.selectedArten = [];
		this.selectedZutaten = [];
		this.selectedName = '';
	}

	// suche (check input + ausgabe)
	private async OutputSearch(event: MouseEvent) {
		event.preventDefault();

		// search zutat if rezeptsuche and Art empty
		if (this.selectedName.length < 1 && this.selectedArten.length < 1) {

			const response = await fetch(`http://localhost:4000/recipes?zutaten=${encodeURIComponent(this.selectedZutaten.join(','))}`, {
				headers: getCommonHeaders(),
				method: 'GET',
				mode: 'cors'
			});

			if (!response.ok) {
				// TODO show error
				return;
			}

			// TODO output search
			const { recipes }: { recipes: string[] } = await response.json();

			// Load full recipe data by ids
			this.gefundeneRezepte = await loadRecipesByIds(recipes);
			return;
		}

		// search art if Rezeptsuche and Zutat empty
		if (this.selectedName.length < 1 && this.selectedZutaten.length < 1) {
			// Load recipeIds
			const response = await fetch(`http://localhost:4000/recipes?art=${encodeURIComponent(this.selectedArten.join(','))}`, {
				headers: getCommonHeaders(),
				method: 'GET',
				mode: 'cors'
			});

			if (!response.ok) {
				// TODO show error
				return;
			}

			const { recipes }: { recipes: string[] } = await response.json();

			// Load full recipe data by ids
			this.gefundeneRezepte = await loadRecipesByIds(recipes);
			return;
		}

		// search rezept if Zutat and Art empty
		if (this.selectedZutaten.length < 1 && this.selectedArten.length < 1) {

			// check input and search
			if (checkUserdata(this.selectedName, 100, { checkWhitespace: false, checkLength: true }) === true) {
				const response = await fetch(`http://localhost:4000/recipes?name=${encodeURIComponent(this.selectedName)}`, {
					headers: getCommonHeaders(),
					method: 'GET',
					mode: 'cors'
				});

				if (!response.ok) {
					// TODO show error
					return;
				}

				const { recipes }: { recipes: string[] } = await response.json();

				// Load full recipe data by ids
				this.gefundeneRezepte = await loadRecipesByIds(recipes);
				return;
			}
		}

		// TODO show errors
	}
}
</script>
