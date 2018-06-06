<!-- first page the user sould get to see with login options and link to registration form -->
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
                        </div>
						<div class="col-1 mt-5 mr-5">
							<router-link to="/registrieren">
								<span class="btn btn-primary">
									Registrieren
								</span>
							</router-link>
                		</div>
                        <p id="loginFail"></p>
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

	// redirect to registration form
	private neuerAccout() {
		this.$router.push('/registrieren');
	}

	private async login(event: MouseEvent) {

		event.preventDefault();

		// Validate username input
		if (checkUserdata(this.userName, 30, { checkWhitespace: true, checkLength: true }) === false) {
			const inputUsername = document.querySelector('#labelNutzername')!;
			inputUsername.innerHTML = 'Bitte Nutzername eingeben';
			// this.inputUsername.style.color = 'red';
			return;
		}

		// Validate password input
		if (checkUserdata(this.password, 40, { checkWhitespace: true, checkLength: true }) === false) {
			const labelPasswort = document.querySelector('#labelPasswort')!;
			labelPasswort.innerHTML = 'Bitte Passwort eingeben';
			// this.inputPassword.style.color = 'red';
			return;
		}

		const headers = new Headers();
		headers.append('Content-Type', 'application/json');

		// post login request (username, password) to backend
		const response = await fetch(`http://localhost:4000/auth`, {
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

