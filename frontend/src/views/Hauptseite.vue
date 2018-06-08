<!-- 1. row: links to other views (new recipe, new ingredient, user data)-->
<!-- 2. row: search options (search by: name, ingredient, type) and search output as a list of RezeptListElements -->
<template>
    <div class="container">
        <h2 class="mt-1">Hier sehen Sie eine Übersicht aller wichtigen Funktionen</h2>
        <form id="formHS" action="select.html">
            <div class="row mt-3">
              	<div class="col-12">
					<span class="mr-3">Shortcuts</span>
                    <router-link to="/neues-rezept">
                        <span class="btn btn-outline-success mr-1">
                            Neues Rezept
                        </span>
                    </router-link>
					<router-link to="/neue-zutat">
                        <span class="btn btn-outline-success ml-1 mr-1"> 
                            Neue Zutat 
                        </span> 
					</router-link>
					<router-link to="/nutzerdaten">
                        <span class="btn btn-outline-primary ml-1 mr-1">
                            Nutzerdaten
                        </span>
                    </router-link>
					<router-link to="/unbestaetigt">
						<span v-show="canReview" class="btn btn-outline-primary ml-1 mr-1">
							Überprüfen
						</span>
					</router-link>
					<button class="btn btn-outline-danger ml-1" @click="logout">
						Abmelden
					</button>
                </div>
            </div>
			<div class="row mt-3">
				<div class="col-12">
					<h3>Rezeptsuche</h3>
				</div>
			</div>
            <div class="row">
                <div class="col-3">
                    <label>Rezeptname</label>
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
					<h3>Suchergebnisse</h3>
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
import validator from 'validator';
import queryString from 'query-string';

import checkUserdata from '../lib/util/checkUserInput';
import getCommonHeaders from '../lib/util/getCommonHeaders';
import loadZutaten from '../lib/util/loadZutaten';
import loadRecipesByIds from '../lib/util/loadRecipesByIds';
import RezeptListElement from '../components/RezeptListElement.vue';
import getHost from '@/lib/util/getHost';
import checkLoggedIn from '@/lib/util/checkLoggedIn';

@Component({ components: { RezeptListElement } })
export default class Hauptseite extends Vue {
	private Zutaten: any[] = [];
	private rezeptArten: any[] = ['Salat', 'Vorspeise', 'Hauptspeise', 'Nachtisch', 'Aufstrich', 'süß', 'herzhaft', 'andere'].map((zutat) => ({ name: zutat, value: zutat }));

	private selectedArten: string[] = [];
	private selectedZutaten: string[] = [];
	private selectedName: string = '';

	private gefundeneRezepte: any[] = [];

	private canReview: boolean = false;

	private async mounted() {
		if (!checkLoggedIn()) {
			return this.$router.push('/anmeldung');
		}

		// load all ingredients
		try {
			const zutaten = await loadZutaten();
			this.Zutaten = zutaten;
		} catch (err) {
			// Handle errors
			return;
		}

		// determine if user is allowed to review and see review options
		this.canReview = localStorage.getItem('userRang') === 'Admin';
	}

	private logout(event: MouseEvent) {
		event.preventDefault();

		// Clear localStorage
		localStorage.removeItem('token');
		localStorage.removeItem('userName');
		localStorage.removeItem('userRang');

		// Redirect to login page
		this.$router.push('/anmeldung');
	}

	private clearInputs(event: MouseEvent) {
		event.preventDefault();

		// clear inputs after search
		this.selectedArten = [];
		this.selectedZutaten = [];
		this.selectedName = '';
	}

	private async OutputSearch(event: MouseEvent) {
		event.preventDefault();

		const name = this.selectedName;
		const arten = this.selectedArten;
		const zutaten = this.selectedZutaten;

		const rawQuery: any = {};

		if (validator.isLength(name, { min: 1, max: 100 })) {
			rawQuery.name = name;
		}

		if (this.selectedArten.length > 0) {
			rawQuery.art = arten.join(',');
		}

		if (this.selectedZutaten.length > 0) {
			rawQuery.zutaten = zutaten.join(',');
		}

		const query = queryString.stringify(rawQuery);

		const response = await fetch(`${getHost()}/recipes?${query}`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		if (!response.ok) {
			// TODO Show/handle error
			return;
		}

		const { recipes }: { recipes: number[] } = await response.json();

		this.gefundeneRezepte = await loadRecipesByIds(recipes);
	}
}
</script>
