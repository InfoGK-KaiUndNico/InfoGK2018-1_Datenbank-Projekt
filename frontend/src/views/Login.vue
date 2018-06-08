<!-- first page the user sould get to see with login options and link to registration form -->
<template>
    <div class="container">
                <h2 class="mt-2">Willkommen bei unserer Rezepte-Datenbank.</h2>
                <h3>Bitte melden Sie sich an, um die Seite zu nutzen.</h3>
                <form id="formIndex1" action="select.html">
                    <div class="row mt-3">
                        <div class="col-3">
                            <label id="labelNutzername">Nutzername</label>
                            <input @keypress.enter="moveFocus" id="inputUsername" class="form-control" v-model="userName" />
                        </div>
                        <div class="col-3">
                            <label id="labelPasswort">Passwort</label>
                            <input @keypress.enter="login" id="inputPassword" type="password" class="form-control" v-model="password" />
                        </div>
                    </div>
					<div class="row mt-3">
                        <div class="col-3">
                            <button @click="login" class="btn btn-primary mr-3">
                              Log In
                            </button>
							<router-link to="/registrieren">
								<span class="btn btn-outline-success">
									Registrieren
								</span>
							</router-link>
                        </div>
					</div>
                    <div class="row">
						<div class="col-12">
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
import getHost from '@/lib/util/getHost';
import checkLoggedIn from '@/lib/util/checkLoggedIn';

@Component
export default class Login extends Vue {
	private userName: string = '';
	private password: string = '';

	private mounted() {
		if (checkLoggedIn()) {
			return this.$router.push('/hauptseite');
		}
	}

	private moveFocus() {
		const inputPassword = document.getElementById('inputPassword')!;
		inputPassword.focus();
	}

	private async login(event: MouseEvent) {
		event.preventDefault();

		// Validate username input
		if (checkUserdata(this.userName, 30, { checkWhitespace: true, checkLength: true, checkAlphanumeric: true }) === false) {
			const inputUsername = document.getElementById('labelNutzername')!;
			inputUsername.innerHTML = 'Bitte Nutzername eingeben';
			inputUsername.style.color = 'red';
			return;
		}

		// Validate password input
		if (checkUserdata(this.password, 120, { checkWhitespace: true, checkLength: true, checkAlphanumeric: false }) === false) {
			const labelPasswort = document.getElementById('labelPasswort')!;
			labelPasswort.innerHTML = 'Bitte Passwort eingeben';
			labelPasswort.style.color = 'red';
			return;
		}

		const headers = new Headers();
		headers.append('Content-Type', 'application/json');

		// post login request (username, password) to backend
		const response = await fetch(`${getHost()}/auth`, {
			body: JSON.stringify({ name: this.userName, passwort: this.password }),
			headers,
			method: 'POST',
			mode: 'cors'
		});

		// Output error if login failed
		if (!response.ok) {
			const loginFail = document.querySelector('#loginFail')!;
			loginFail.innerHTML = 'Anmeldung fehlgeschlagen!';
			return;
		}

		const { token } = await response.json();
		const { rang } = jwt_decode(token);

		// Add authentification token and username to local Storage
		localStorage.setItem('token', token);
		localStorage.setItem('userName', this.userName);
		localStorage.setItem('userRang', rang);

		// Redirect to mainpage
		this.$router.push('/hauptseite');
	}
}
</script>

