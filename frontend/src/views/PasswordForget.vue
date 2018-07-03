<template>
	<div class="container">
		<h3>Passwort Vergessen?</h3>
		<form>
			<div class="row mt-3">
				<div class="col-4">
					<input class="form-control" type="email" placeholder="E-Mail" v-model="inputEmail" />
				</div>
				<div class="col-8">
					<button class="btn btn-primary mr-3" @click="sendForgotRequest" :disabled="disablePrimaryButton">Temporären Zugang anfordern</button>
					<router-link to="/anmeldung">
						<span class="btn btn-outline-secondary">Zurück</span>
					</router-link>
				</div>
			</div>
			<div class="row mt-3">
				<div class="col-12">
					<span>{{bottomText}}</span>
				</div>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import validator from 'validator';

import getHost from '@/lib/util/getHost';
import checkLoggedIn from '@/lib/util/checkLoggedIn';

@Component({})
export default class PasswordForgetConfirmationComponent extends Vue {
	private inputEmail: string = '';
	private disablePrimaryButton: boolean = false;
	private bottomText: string = '';

	private mounted() {
		if (checkLoggedIn()) {
			return this.$router.push('/hauptseite');
		}
	}

	private async sendForgotRequest(event: MouseEvent) {
		event.preventDefault();

		this.bottomText = 'Loading...';
		this.disablePrimaryButton = true;

		const email = this.inputEmail;

		if (!validator.isEmail(email)) {
			// TODO Handle errors
			return;
		}

		const response = await fetch(`${getHost()}/auth/forgot`, {
			body: JSON.stringify({
				email
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		});

		if (!response.ok) {
			this.bottomText = 'Irgendetwas ist mit Ihrer Anfrage schiefgelaufen, bitte probieren Sie es noch einmal!';
			this.disablePrimaryButton = false;
			return;
		}

		this.disablePrimaryButton = false;
		this.bottomText = 'Super, schauen Sie in ihren Posteingang, um die Ihnen gesendete Bestätigungsmail wahrzunehmen!';
	}
}
</script>

