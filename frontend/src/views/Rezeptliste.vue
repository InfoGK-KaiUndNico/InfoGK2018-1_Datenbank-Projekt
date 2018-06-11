<template>
	<div class="container">
		<h2 class="mt-1">Alle Rezepte</h2>
		<div class="row mt-3">
			<div class="col-12">
				<router-link to="/neues-rezept">
					<span class="btn btn-outline-success mr-3"> 
						Neues Rezept 
					</span> 
				</router-link>
				<router-link to="/hauptseite">
					<span class="btn btn-outline-secondary">
						Zurück
					</span>
				</router-link>
			</div>
		</div>
		<div v-if="!loading" class="row mb-3">
			<div class="mt-3 col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4" v-for="rezept in rezepte" :key="rezept.name">
				<RezeptListCardElement :rezept="rezept" :onDelete="onRezeptDelete"/>
			</div>
		</div>
		<div v-else class="my-3">
			<p>Lädt...</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import RezeptListCardElement from '../components/RezeptListCardElement.vue';
import checkLoggedIn from '@/lib/util/checkLoggedIn';
import getHost from '@/lib/util/getHost';
import getCommonHeaders from '@/lib/util/getCommonHeaders';
import loadRecipesByIds from '@/lib/util/loadRecipesByIds';

@Component({ components: { RezeptListCardElement } })
export default class Rezeptliste extends Vue {
	private rezepte: any[] = [];
	private loading: boolean = true;

	private async mounted() {
		if (!checkLoggedIn()) {
			return this.$router.push('/anmeldung');
		}

		// load all ingredient ids
		try {
			const response = await fetch(`${getHost()}/recipes`, {
				headers: getCommonHeaders(),
				method: 'GET',
				mode: 'cors'
			});

			const { recipes }: { recipes: string[] } = await response.json();

			if (!Array.isArray(recipes)) {
				return;
			}

			this.rezepte = await loadRecipesByIds(recipes);
			this.loading = false;
		} catch (err) {
			return;
		}
	}

	private onRezeptDelete(rezeptId: string) {
		this.rezepte.splice(this.rezepte.findIndex((rezept) => rezept.id === rezeptId), 1);
	}
}
</script>

