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
					<input class="form-control" placeholder="Passwort" v-model="inputPassword"/>
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
import checkUserdata from '../lib/util/checkUserInput';
import getCommonHeaders from '../lib/util/getCommonHeaders';
import validator from 'validator';

@Component({})
export default class Registrieren extends Vue {
	private inputPassword: string = '';
	private inputEmail: string = '';
	private inputUsername: string = '';
	private anzeigeUsername = document.querySelector('#AnzeigeUsername')!;
	private anzeigePassword = document.querySelector('#AnzeigePassword')!;
	private anzeigeEmail = document.querySelector('#AnzeigeEmail')!;
	private registerFail = document.querySelector('#registerFail')!;

	private async register(event: MouseEvent) {
		event.preventDefault();

		if (checkUserdata(this.inputPassword, 40, { checkWhitespace: true, checkLength: true }) === false) {
			this.anzeigePassword.innerHTML = 'Passwort muss min. 1 Zeichen enthalten keine Leer- und Sonderzeichen enthalten';
			// this.inputPassword.style.color = 'red';
			return;
		}

		if (checkUserdata(this.inputUsername, 30, { checkWhitespace: true, checkLength: true }) === false) {
			this.anzeigePassword.innerHTML = 'Passwort muss min. 1 Zeichen enthalten keine Leer- und Sonderzeichen enthalten';
			// this.inputPassword.style.color = 'red';
			return;
		}

		if (checkUserdata(this.inputEmail, 40, { checkWhitespace: true, checkLength: true }) === false || validator.isEmail(this.inputEmail) === false) {
			this.anzeigePassword.innerHTML = 'keine gültige Email-Adresse';
			// this.inputPassword.style.color = 'red';
			return;
		}

		// send token and username to backend
		const response = await fetch('url', {
			body: JSON.stringify({
				passwort: this.inputPassword,
				email: this.inputEmail,
				name: this.inputUsername
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

		this.$router.push('/hauptseite');
	}
}
</script>
