<!-- 1. row: the user can see and alter his personal data -->
<!-- 2. row: the user can see his own, his favourite and his bookmarked recipes -->
<template>
    <div class="container">
        <h2 class="mt-2">Hier sehen sie ihre Nutzerdaten und können sie ändern</h2>
        <form id="formND" action="select.html">
            <div class="row">
                <div class="col-3 mt-3">
                    <label>Nutzername</label>
                    <input id="AnzeigeUsername" class="form-control" v-model="showUserName" readonly/>
                </div>
                <div class="col-3 mt-3">
                    <label>Passwort ändern</label>
                    <input id="inputChangePassword" class="form-control" type="password" v-model="changePassword"/>
                </div>
				<div class="col-3 mt-3">
                    <label>EMail ändern</label>
                    <input id="inputChangeEmail" class="form-control" v-model="changeEmail"/>
                </div>
			</div>
			<div class="row mt-3">  
				<div class="col-12">
					<span class="btn btn-primary mr-3" @click="updateUser">
						Ändern
					</span>
					<router-link to="/hauptseite">
						<span class="btn btn-outline-secondary">
							Zurück
						</span>
					</router-link>
				</div>
			</div>
			<div class="row">
				<div class="col-12">
					<p id="updateFail"></p>
				</div>
			</div>
			<div class="row">
				<div class="col-12 mt-2">
					<p>Meine eigenen Rezepte</p>
					<!--<button class="btn btn-primary" @click="showRezepte('eigene')">EigeneRezepte</button>-->
					<div id="listEigeneRezepte" class="panel">
						<p v-show="EigeneRezepte.length < 1">Noch keine eigenen Rezepte. <router-link to="/neues-rezept"><span>Füge doch eines hinzu!</span></router-link></p>						
						<ul class="list-group">
							<li class="list-group-item" v-for="rezept in EigeneRezepte" v-bind:key="rezept.id">
								<RezeptListElement v-bind:rezept="rezept"/>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-12 mt-2">
					<p>Meine Lieblingsrezepte</p>
					<!--<button class="btn btn-primary" @click="showRezepte('favoriten')">Lieblingsrezepte</button>-->
					<div id="listLieblingsrezepte" class="panel">
						<p v-show="Lieblingsrezepte.length < 1">Noch keine Lieblingsrezepte!</p>						
						<ul class="list-group">
							<li class="list-group-item" v-for="rezept in Lieblingsrezepte" v-bind:key="rezept.id">
								<RezeptListElement v-bind:rezept="rezept"/>
							</li>
						</ul>
					</div>
				</div>
				<div class="col-12 mt-2">
					<p>Meine gemerkten Rezepte</p>
					<!--<button class="btn btn-primary" @click="showRezepte('gemerkt')">Gemerkte Rezepte</button>-->
					<div id="listGemerkteRezepte" class="panel">
						<p v-show="GemerkteRezepte.length < 1">Noch keine Rezepte gemerkt!</p>
						<ul class="list-group">
							<li class="list-group-item" v-for="rezept in GemerkteRezepte" v-bind:key="rezept.id">
								<RezeptListElement v-bind:rezept="rezept"/>
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
import loadRecipesByIds from '../lib/util/loadRecipesByIds';

import validator from 'validator';

@Component({ components: { RezeptListElement } })
export default class Nutzerdaten extends Vue {
	private showUserName: string = '';
	private changePassword: string = '';
	private changeEmail: string = '';

	private anzeigeUsername: Element;
	private inputPassword: Element;
	private inputEmail: Element;
	private updateFail: Element;

	private LieblingsrezeptIds: number[] = [];
	private GemerkteRezeptIds: number[] = [];
	private EigeneRezeptIds: number[] = [];

	private Lieblingsrezepte: any[] = [];
	private GemerkteRezepte: any[] = [];
	private EigeneRezepte: any[] = [];

	private mounted() {
		// define elements
		const anzeigeUsername = document.querySelector('#AnzeigeUsername');
		if (!anzeigeUsername) {
			return;
		}
		this.anzeigeUsername = anzeigeUsername;

		const inputPassword = document.querySelector('#inputChangePassword');
		if (!inputPassword) {
			return;
		}
		this.inputPassword = inputPassword;

		const inputEmail = document.querySelector('#inputChangeEmail');
		if (!inputEmail) {
			return;
		}
		this.inputEmail = inputEmail;

		const updateFail = document.querySelector('#updateFail');
		if (!updateFail) {
			return;
		}
		this.updateFail = updateFail;

		this.showUserData();
	}

	private async showUserData() {
		// show username
		const userName = localStorage.getItem('userName');
		if (!userName) {
			return;
		}

		// send token and username to backend to veryfy identity and get data
		const response = await fetch(`http://localhost:4000/users/${userName}`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		if (!response.ok) {
			this.anzeigeUsername.innerHTML = 'Fehler beim Laden der Daten';
			this.inputPassword.innerHTML = 'Fehler beim Laden der Daten';
			this.inputEmail.innerHTML = 'Fehler beim Laden der Daten';
			return;
		}

		// output data
		const { name, email, fuerSpaeterGemerkt, rezepte, favoriten } = await response.json();

		this.showUserName = name;
		this.inputPassword.innerHTML = '';
		this.changeEmail = email;

		this.LieblingsrezeptIds = favoriten;
		this.EigeneRezeptIds = rezepte;
		this.GemerkteRezeptIds = fuerSpaeterGemerkt;

		// Load recipes
		await Promise.all([
			this.showRezepte(this.EigeneRezeptIds, 'eigene'),
			this.showRezepte(this.LieblingsrezeptIds, 'favoriten'),
			this.showRezepte(this.GemerkteRezeptIds, 'gemerkt')
		]);
	}

	private async showRezepte(rezeptIds: number[], type: string) {
		for (const rezeptId of rezeptIds) {
			const response = await fetch(`http://localhost:4000/recipes/${rezeptId}`, {
				headers: getCommonHeaders(),
				method: 'GET',
				mode: 'cors'
			});

			if (!response.ok) {
				continue;
			}

			// output data
			const rezept = await response.json();

			switch (type) {
				case 'favoriten':
					this.Lieblingsrezepte.push(rezept);
					break;
				case 'eigene':
					this.EigeneRezepte.push(rezept);
					break;
				case 'gemerkt':
					this.GemerkteRezepte.push(rezept);
					break;
			}
		}
	}

	private async updateUser(event: MouseEvent) {
		event.preventDefault();

		const userName = localStorage.getItem('userName');
		if (!userName) {
			return;
		}

		if (this.changePassword.length > 0) {
			if (checkUserdata(this.changePassword, 40, { checkWhitespace: true, checkLength: true }) === false) {
				this.inputPassword.innerHTML = 'Passwort muss min. 1 Zeichen und keine Leer- und Sonderzeichen enthalten';
				this.showUserData();
				return;
			}
		}

		if (this.changeEmail.length > 0) {
			if (validator.isEmail(this.changeEmail) === false) {
				this.inputPassword.innerHTML = 'keine gültige Email-Adresse';
				this.showUserData();
				return;
			}
		}

		// Check for changes
		if (this.changePassword.length < 1 && this.changeEmail.length < 1) {
			return;
		}

		const passwordChanges = this.changePassword.length > 0 ? { passwort: this.changePassword } : {};
		const emailChanges = this.changeEmail.length > 0 ? { email: this.changeEmail } : {};

		// send changes to backend
		const response = await fetch(`http://localhost:4000/users/${userName}`, {
			body: JSON.stringify({ ...passwordChanges, ...emailChanges }),
			headers: getCommonHeaders(),
			method: 'PATCH',
			mode: 'cors'
		});

		// Handle Errors
		if (!response.ok) {
			this.updateFail.innerHTML = 'Fehler beim Hochladen';
			return;
		}

		this.updateFail.innerHTML = 'Daten erfolgreich hochgeladen!';
	}
}
</script>
