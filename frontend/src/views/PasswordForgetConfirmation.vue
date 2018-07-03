<template>
	<div class="container">
		<h3>Passwort Vergessen</h3>

		<span>Lädt...</span>
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

		const token = this.$route.params.token;
		this.generateTemporaryCredentials(token);
	}

	private async generateTemporaryCredentials(systemToken: string) {
		if (systemToken.length < 1) {
			return;
		}

		const response = await fetch(`${getHost()}/auth/forgot/${systemToken}`, {
			method: 'GET'
		});

		if (!response.ok) {
			this.$router.push('/anmeldung');
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

