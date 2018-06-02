<template>
    <div class="container">
                <h2 class="mt-2">Hallo, willkommen bei unserer Rezepte Datenbank.</h2>
                <h3>Bitte melden sie sich an, um sie zu nutzen.</h3>
                <form id="formIndex1" action="select.html">
                    <div class="row">
                        <div class="col-3 mt-3">
                            <label id="labelNutzername">Nutzername</label>
                            <input @keypress.enter="moveFocus" id="inputUsername" class="form-control" v-model="userName" />
                        </div>
                        <div class="col-3 mt-3">
                            <label id="labelPasswort">Passwort</label>
                            <input @keypress.enter="login" id="inputPassword" type="password" class="form-control" v-model="password" />
                        </div>
                        <div class="col-3 mt-5">
                            <button @click="login" class="btn btn-primary">
                              Log In
                            </button>
                            <p id="loginFail"></p>
                        </div>
                    </div>
                </form>
            </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import checkUserdata from '../lib/util/checkUserInput';
import jwt_decode from 'jwt-decode';

@Component
export default class Login extends Vue {
	private userName: string = '';
	private password: string = '';

	/* private moveFocus() {
		const inputPassword = document.querySelector('#inputPassword')!;
		inputPassword.focus();
	} */

	// Request from Kai button "Registrieren" @click="neuerAccount" Request from Kai Registrierseite
	private neuerAccout() {
		this.$router.push('/registrieren');
	}

	private async login(event: MouseEvent) {

		event.preventDefault();

		// Validate username
		if (checkUserdata(this.userName, 30, { checkWhitespace: true, checkLength: true }) === false) {
			const inputUsername = document.querySelector('#labelNutzername')!;
			inputUsername.innerHTML = 'Bitte Nutzername eingeben';
			// this.inputUsername.style.color = 'red';
			return;
		}

		// Validate password
		if (checkUserdata(this.password, 40, { checkWhitespace: true, checkLength: true }) === false) {
			const labelPasswort = document.querySelector('#labelPasswort')!;
			labelPasswort.innerHTML = 'Bitte Passwort eingeben';
			// this.inputPassword.style.color = 'red';
			return;
		}

		const headers = new Headers();
		headers.append('Content-Type', 'application/json');

		// Send login request to backend
		const response = await fetch(`${process.env.API_BASE_URL}/auth`, {
			body: JSON.stringify({ name: this.userName, passwort: this.password }),
			headers,
			method: 'POST',
			mode: 'cors'
		});

		// Handle errors
		if (!response.ok) {
			const loginFail = document.querySelector('#loginFail')!;
			loginFail.innerHTML = 'Anmeldung fehlgeschlagen!';
			return;
		}

		const { token } = await response.json();
		const { rang } = jwt_decode(token);

		// Add auth token and userName to localStorage
		localStorage.setItem('token', token);
		localStorage.setItem('userName', this.userName);
		localStorage.setItem('userRang', rang);

		// Redirect
		this.$router.push('/hauptseite');
	}
}
</script>

