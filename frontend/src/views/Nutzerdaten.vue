<template>
    <div class="container">
        <h2 class="mt-2">Hier sehen sie ihre Nutzerdaten und können sie ändern</h2>
        <form id="formND" action="select.html">
            <div class="row">
                <div class="col-3 mt-3">
                    <label>Nutzername</label>
                    <p id="AnzeigeUsername" class="form-control"></p>
                </div>
                <div class="col-3 mt-3">
                    <label>Passwort ändern</label>
                    <input id="inputChangePassword" class="form-control" v-model="changePassword"/>
                </div>
				<div class="col-3 mt-3">
                    <label>EMail ändern</label>
                    <input class="form-control" id="inputChangeEmail" v-model="changeEmail"/>
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
					<div class="col-6 mt-2">
						<label>Lieblingsrezepte</label>
						<textarea class="form-control"></textarea>
					</div>
					<div class="col-6 mt-2">
						<label>gemerkte Rezepte</label>
						<textarea class="form-control"></textarea>
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
import validator from 'validator';

@Component({})
export default class Nutzerdaten extends Vue {

	private inputChangePassword: string = '';
	private inputChangeEmail: string = '';
	private anzeigeUsername = document.querySelector('#AnzeigeUsername')!;
	private inputPassword = document.querySelector('#inputChangePassword')!;
	private inputEmail = document.querySelector('#inputChangeEmail')!;
	private updateFail = document.querySelector('#updateFail')!;

	private mounted() {
		this.showUserData();
	}

	private async showUserData() {

		// send token and username to backend to veryfy identity and get data
		const response = await fetch('url', {
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
		this.anzeigeUsername.innerHTML = name;
		this.inputPassword.innerHTML = '';
		this.inputEmail.innerHTML = email;
	}

	private async updateUser(event: MouseEvent) {
		event.preventDefault();

		if (checkUserdata(this.inputChangePassword, 40, { checkWhitespace: true, checkLength: true }) === false) {
			this.inputPassword.innerHTML = 'Passwort muss min. 1 Zeichen enthalten keine Leer- und Sonderzeichen enthalten';
			// this.inputPassword.style.color = 'red';
			this.showUserData();
			return;
		}
		if (checkUserdata(this.inputChangeEmail, 40, { checkWhitespace: true, checkLength: true }) === false || validator.isEmail(this.inputChangeEmail) === false) {
			this.inputPassword.innerHTML = 'keine gültige Email-Adresse';
			// this.inputPassword.style.color = 'red';
			this.showUserData();
			return;
		}

		// send token and username to backend
		const response = await fetch('url', {
			body: JSON.stringify({
				currentPassword: this.inputChangePassword,
				currentEmail: this.inputChangeEmail
			}),
			headers: getCommonHeaders(),
			method: 'POST',
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
