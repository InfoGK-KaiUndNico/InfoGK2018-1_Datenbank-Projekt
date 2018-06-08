<template>
	<div>
		<div class="container">
			<h2 class="mt-2">Hier können Sie sich einen Nutzeraccount erstellen.</h2>
			<form id="formReg" action="select.html">
				<div class="row mt-3">
					<div class="col-3">
						<input class="form-control" placeholder="Nutzername" v-model="inputUsername"/>
						<p id="AnzeigeUsername"></p>
					</div>
					<div class="col-3">
						<input class="form-control" placeholder="Passwort" type="password" v-model="inputPassword"/>
						<p id="AnzeigePassword"></p>
					</div>
					<div class="col-3">
						<input class="form-control" placeholder="E-Mail" v-model="inputEmail"/>
						<p id="AnzeigeEmail"></p>
					</div>
				</div>
				<div class="row mt-3">
					<div class="col-12">
						<span class="btn btn-primary mr-3" @click="register">
							Registrieren
						</span>
						<router-link to="/anmeldung">
							<span class="btn btn-outline-secondary">Zur Anmeldung</span>
						</router-link>
						<p id="registerFail"></p>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import validator from 'validator';
import jwt_decode from 'jwt-decode';

import checkUserdata from '../lib/util/checkUserInput';
import getCommonHeaders from '../lib/util/getCommonHeaders';
import getHost from '@/lib/util/getHost';

@Component({})
export default class Registrieren extends Vue {
	private inputPassword: string = '';
	private inputEmail: string = '';
	private inputUsername: string = '';

	private anzeigeUsername: HTMLElement;
	private anzeigePassword: HTMLElement;
	private anzeigeEmail: HTMLElement;
	private registerFail: Element;

	private mounted() {
		const anzeigeUsername = document.getElementById('AnzeigeUsername');
		if (!anzeigeUsername) {
			return;
		}
		this.anzeigeUsername = anzeigeUsername;

		const anzeigePassword = document.getElementById('AnzeigePassword');
		if (!anzeigePassword) {
			return;
		}
		this.anzeigePassword = anzeigePassword;

		const anzeigeEmail = document.getElementById('AnzeigeEmail');
		if (!anzeigeEmail) {
			return;
		}
		this.anzeigeEmail = anzeigeEmail;

		const registerFail = document.querySelector('registerFail');
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
			this.anzeigeUsername.style.color = 'red';
			return;
		}

		if (checkUserdata(passwort, 40, { checkWhitespace: true, checkLength: true }) === false) {
			this.anzeigePassword.innerHTML = 'Passwort muss min. 1 Zeichen und keine Leer- und Sonderzeichen enthalten';
			this.anzeigePassword.style.color = 'red';
			return;
		}

		if (validator.isEmail(email) === false) {
			this.anzeigeEmail.innerHTML = 'keine gültige E-Mail-Adresse';
			this.anzeigeEmail.style.color = 'red';
			return;
		}

		// send user data to backend
		const response = await fetch(`${getHost()}/auth/signup`, {
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
