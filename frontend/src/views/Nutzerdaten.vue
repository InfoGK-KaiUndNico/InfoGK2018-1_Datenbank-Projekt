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
					<label>Lieblingsrezepte</label>
					<textarea class="form-control"></textarea>
				</div>
				<div class="col-6 mt-2">
					<label>gemerkte Rezepte</label>
					<textarea class="form-control"></textarea>
				</div>
			</div>
        </form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import checkUserdata from '../lib/util/checkUserInput';

import getCommonHeaders from '../lib/util/getCommonHeaders';
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
}
</script>
