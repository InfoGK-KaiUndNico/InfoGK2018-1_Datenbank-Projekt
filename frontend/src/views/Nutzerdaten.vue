<template>
    <div class="container">
        <h2 class="mt-1">Hier sehen sie ihre Nutzerdaten</h2>
        <form id="formND" action="select.html">
            <div class="row">
                <div class="col-3 mt-3">
                    <label>Nutzername</label>
                    <input id="inputChangeUsername" class="form-control" v-model="changeUsername"/>
                </div>
                <div class="col-3 mt-3">
                    <label>Passwort</label>
                    <input id="inputChangePassword" class="form-control" v-model="changePassword"/>
                </div>
                <div class="col-2 mt-5">
                    <span class="btn btn-primary " @click="zurueck">
                        zurück
                    </span>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import checkUserdata from '../lib/util/checkUserInput';
import getCommonHeaders from '../lib/util/getCommonHeaders';

@Component
export default class Nutzerdaten extends Vue {
	private inputChangeUsername: string = '';
	private inputChangePassword: string = '';
	private inputUsername = document.querySelector('#inputChangeUsername')!;
	private inputPassword = document.querySelector('#inputChangePassword')!;
	private updateFail = document.querySelector('#updateFail')!;
	// showUserData
	private async showUserData() {

		// send token and username to backend to veryfy identity and get data
		const response = await fetch('url', {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});
		if (!response.ok) {
			this.inputUsername.innerHTML = 'Fehler beim Laden der Daten';
			this.inputPassword.innerHTML = 'Fehler beim Laden der Daten';
			return;
		}
		// output data
		const { responseUsername, responsePassword } = await response.json();
		this.inputUsername.innerHTML = responseUsername;
		this.inputPassword.innerHTML = responsePassword;
	}
	private zurueck() {
		this.$router.push('/hauptseite');
	}

	private async updateUser(event: MouseEvent) {
		event.preventDefault();
		if (checkUserdata(this.inputChangeUsername, 30, { checkWhitespace: true, checkLength: true }) === false) {
			this.inputUsername.innerHTML = 'Nutzername muss min. 1 Zeichen enthalten und darf keine Leer- und Sonderzeichen enthalten';
			// this.inputUsername.style.color = 'red';
			this.showUserData();
			return;
		}
		if (checkUserdata(this.inputChangePassword, 40, { checkWhitespace: true, checkLength: true }) === false) {
			this.inputPassword.innerHTML = 'Passwort muss min. 1 Zeichen enthalten keine Leer- und Sonderzeichen enthalten';
			// this.inputPassword.style.color = 'red';
			this.showUserData();
			return;
		}

		// send token and username to backend
		const response = await fetch('url', {
			body: JSON.stringify({
				currentPassword: this.inputChangePassword,
				currentUsername: this.inputChangeUsername
			}),
			headers: getCommonHeaders(),
			method: 'POST',
			mode: 'cors'
		});
		// Handle Errors
		if (!response.ok) {
			this.updateFail.innerHTML = 'Fehler beim Hochladen';
		} else {
			this.updateFail.innerHTML = 'Daten erfolgreich hochgeladen!';
		}
	}
}
</script>
