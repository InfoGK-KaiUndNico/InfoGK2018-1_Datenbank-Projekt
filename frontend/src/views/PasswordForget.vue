<template>
	<div class="container">
		<h3>Passwort Vergessen?</h3>
		<form>
			<div class="row mt-3">
				<div class="col-4">
					<input class="form-control" type="email" placeholder="E-Mail" v-model="inputEmail" />
				</div>
				<div class="col-8">
					<button class="btn btn-primary" @click="sendForgotRequest">Temporären Zugang anfordern</button>
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

	private mounted() {
		if (checkLoggedIn()) {
			return this.$router.push('/hauptseite');
		}
	}

	private async sendForgotRequest(event: MouseEvent) {
		event.preventDefault();

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
			// TODO Handle errors
			return;
		}

		// TODO Show 'head over to your inbox' message
	}
}
</script>

