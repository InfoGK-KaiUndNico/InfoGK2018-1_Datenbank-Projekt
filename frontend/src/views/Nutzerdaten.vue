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
                    <input id="inputChangeEmail" class="form-control"  v-model="changeEmail"/>
                </div>
			</div>
			<div class="row">  
				<div class="col-1 mt-2">
					<router-link to="/hauptseite">
						<span class="btn btn-primary">
							zurück
						</span>
					</router-link>
				</div>
				<div class="col-1 mt-2">
					<span class="btn btn-primary" @click="updateUser">
						ändern
					</span>
				</div>
			</div>
			<div class="row">
				<div class="col-12">
					<p id="updateFail"></p>
				</div>
			</div>
			<div class="row">
				<div class="col-6 mt-2">
					<button class="accordion" @click="showLieblingsrezepte">Lieblingsrezepte</button>
					<div id="listLieblingsrezepte" class="panel">
						<ul display: none;>
						<li v-for="rezept in Lieblingsrezepte" v-bind:key="rezept.name">
							<RezeptListElement v-bind="rezept"/>
						</li>
					</ul>
					</div>
				</div>
				<div class="col-6 mt-2">
					<button class="accordion" @click="showGemerkteRezepte">Gemerkte Rezepte</button>
					<div id="listGemerkteRezepte" class="panel">
						<ul display: none;>
							<li v-for="rezept in gefundeneRezepte" v-bind:key="rezept.name">
								<RezeptListElement v-bind="rezept"/>
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

@Component({})
export default class Nutzerdaten extends Vue {

	private showUserName: string = '';
	private changePassword: string = '';
	private changeEmail: string = '';

	private anzeigeUsername: Element;
	private inputPassword: Element;
	private inputEmail: Element;
	private updateFail: Element;

	private Lieblingsrezepte: any[] = [];
	private GemerkteRezepte: any[] = [];

	private mounted() {
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
		const { name, email } = await response.json();
		this.showUserName = name;
		this.inputPassword.innerHTML = '';
		this.inputEmail.innerHTML = email;
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
		const emailChanges = this.changeEmail.length > 0 ? { email: this.changeEmail} : {};

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

	private async showLieblingsrezepte() {
		const panelLieblingsrezepte = document.getElementById('#listLieblingsrezepte')!;
		if (panelLieblingsrezepte.style.display === 'block') {
			panelLieblingsrezepte.style.display = 'none';
			return;
		}

		panelLieblingsrezepte.style.display = 'block';

		const response = await fetch(`http://localhost:4000/recipes`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		if (!response.ok) {
			this.Lieblingsrezepte[0] = { message: 'Suche fehlgeschlagen', value: 'error' };
			return;
		}

		const { recipes }: { recipes: string[] } = await response.json();

		// Load full recipe data by ids
		this.Lieblingsrezepte = await loadRecipesByIds(recipes);
		return;
	}

	private async showGemerkteRezepte() {
		const panelGemerkteRezepte = document.getElementById('#listGemerkteRezepte')!;
		if (panelGemerkteRezepte.style.display === 'block') {
			panelGemerkteRezepte.style.display = 'none';
			return;
		}

		panelGemerkteRezepte.style.display = 'block';

		const response = await fetch(`http://localhost:4000/recipes`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		if (!response.ok) {
			this.GemerkteRezepte[0] = { message: 'Suche fehlgeschlagen', value: 'error' };
			return;
		}

		const { recipes }: { recipes: string[] } = await response.json();

		// Load full recipe data by ids
		this.GemerkteRezepte = await loadRecipesByIds(recipes);
		return;
	}
}
</script>
