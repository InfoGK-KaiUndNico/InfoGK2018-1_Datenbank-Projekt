<template>
	<div class="container">
		<h3>Passwort Vergessen</h3>

		<div class="row">
			<div class="col-12 mt-3">
				<button class="btn btn-primary" @click="generateTemporaryCredentials">Temporäre Zugangsdaten generieren</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import jwt_decode from 'jwt-decode';

import checkLoggedIn from '@/lib/util/checkLoggedIn';
import getHost from '@/lib/util/getHost';

@Component({})
export default class PasswordForgetConfirmationComponent extends Vue {
	private token: string = '';

	private mounted() {
		if (checkLoggedIn()) {
			return this.$router.push('/hauptseite');
		}

		this.token = this.$route.params.token;
	}

	private async generateTemporaryCredentials(event: MouseEvent) {
		event.preventDefault();

		if (this.token.length < 1) {
			return;
		}

		const response = await fetch(`${getHost()}/auth/forgot/${this.token}`, {
			method: 'GET'
		});

		if (!response.ok) {
			// TODO Handle errors
			return;
		}

		const { token } = await response.json();

		const { rang, name } = jwt_decode(token);

		// Add authentification token and username to local Storage
		localStorage.setItem('token', token);
		localStorage.setItem('userName', name);
		localStorage.setItem('userRang', rang);

		// Send user to account view to change password
		this.$router.push('/nutzerdaten');
	}
}
</script>

