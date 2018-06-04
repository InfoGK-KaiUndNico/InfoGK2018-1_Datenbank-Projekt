<template>
	<div>
		<div class="container">
			<h2 class="mt-2">Hier können sie sich einen Nutzeraccount erstellen.</h2>
		</div>
		<form id="formReg" action="select.html">
			<div class="row">
				<div class="col-3 ml-3">
					<input class="form-control" placeholder="Nutzername" v-model="inputUsername"/>
					<p id="AnzeigeUsername"></p>
				</div>
				<div class="col-3">
					<input class="form-control" placeholder="Passwort" type="password" v-model="inputPassword"/>
					<p id="AnzeigePassword"></p>
				</div>
				<div class="col-3">
					<input class="form-control" placeholder="eMail" v-model="inputEmail"/>
					<p id="AnzeigeEmail"></p>
				</div>
				<div class="col-1">
					<span class="btn btn-primary" @click="register">
						Registrieren
					</span>
					<p id="registerFail"></p>
				</div>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import validator from 'validator';
import jwt_decode from 'jwt-decode';

import checkUserdata from '../lib/util/checkUserInput';
import getCommonHeaders from '../lib/util/getCommonHeaders';

@Component({})
export default class Registrieren extends Vue {
	private inputPassword: string = '';
	private inputEmail: string = '';
	private inputUsername: string = '';

	private anzeigeUsername: Element;
	private anzeigePassword: Element;
	private anzeigeEmail: Element;
	private registerFail: Element;

	private mounted() {
		const anzeigeUsername = document.querySelector('#AnzeigeUsername');
		if (!anzeigeUsername) {
			return;
		}
		this.anzeigeUsername = anzeigeUsername;

		const anzeigePassword = document.querySelector('#AnzeigePassword');
		if (!anzeigePassword) {
			return;
		}
		this.anzeigePassword = anzeigePassword;

		const anzeigeEmail = document.querySelector('#AnzeigeEmail');
		if (!anzeigeEmail) {
			return;
		}
		this.anzeigeEmail = anzeigeEmail;

		const registerFail = document.querySelector('#RegisterFail');
		if (!registerFail) {
			return;
		}
		this.registerFail = registerFail;
	}

	private async register(event: MouseEvent) {
		event.preventDefault();

		const name = this.inputUsername;
		const passwort = this.inputPassword;
		const email = this.inputEmail;

		if (checkUserdata(name, 30, { checkWhitespace: true, checkLength: true }) === false) {
			this.anzeigeUsername.innerHTML = 'Name muss min. 1 Zeichen und keine Leer- und Sonderzeichen enthalten';
			// this.inputPassword.style.color = 'red';
			return;
		}

		if (checkUserdata(passwort, 40, { checkWhitespace: true, checkLength: true }) === false) {
			this.anzeigePassword.innerHTML = 'Passwort muss min. 1 Zeichen und keine Leer- und Sonderzeichen enthalten';
			// this.inputPassword.style.color = 'red';
			return;
		}

		if (validator.isEmail(email) === false) {
			this.anzeigeEmail.innerHTML = 'keine gültige Email-Adresse';
			// this.inputPassword.style.color = 'red';
			return;
		}

		// send user data to backend
		const response = await fetch('http://localhost:4000/auth/signup', {
			body: JSON.stringify({
				name,
				email,
				passwort
			}),
			headers: getCommonHeaders(),
			method: 'POST',
			mode: 'cors'
		});

		// Handle Errors
		if (!response.ok) {
			this.registerFail.innerHTML = 'Fehler beim Hochladen';
			return;
		}

		const { token } = await response.json();
		const { rang } = jwt_decode(token);

		// Add auth token and userName to localStorage
		localStorage.setItem('token', token);
		localStorage.setItem('userName', this.inputUsername);
		localStorage.setItem('userRang', rang);

		this.$router.push('/hauptseite');
	}
}
</script>
