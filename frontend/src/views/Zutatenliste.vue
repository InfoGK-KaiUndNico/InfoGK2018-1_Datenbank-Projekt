<template>
	<div class="container">
		<h2 class="mt-1">Alle Zutaten</h2>
		<div class="row mt-3">
			<div class="col-12">
				<router-link to="/neue-zutat">
					<span class="btn btn-outline-success mr-3"> 
						Neue Zutat 
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
			<div class="mt-3 col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4" v-for="zutat in zutaten" :key="zutat.name">
				<ZutatListCardElement :zutat="zutat" :onDelete="onZutatDelete"/>
			</div>
		</div>
		<div v-else class="my-3">
			<p>Lädt...</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import ZutatListCardElement from '../components/ZutatListCardElement.vue';
import checkLoggedIn from '@/lib/util/checkLoggedIn';
import getHost from '@/lib/util/getHost';
import getCommonHeaders from '@/lib/util/getCommonHeaders';
import loadZutatenByIds from '@/lib/util/loadZutatenByIds';

@Component({ components: { ZutatListCardElement } })
export default class Zutatenliste extends Vue {
	private zutaten: any[] = [];
	private loading: boolean = true;

	private async mounted() {
		if (!checkLoggedIn()) {
			return this.$router.push('/anmeldung');
		}

		// load all ingredient ids
		try {
			const response = await fetch(`${getHost()}/ingredients?nofilter=true`, {
				headers: getCommonHeaders(),
				method: 'GET',
				mode: 'cors'
			});

			const { zutaten }: { zutaten: string[] } = await response.json();

			if (!Array.isArray(zutaten)) {
				return;
			}

			this.zutaten = await loadZutatenByIds(zutaten);
			this.loading = false;
		} catch (err) {
			return;
		}
	}

	private onZutatDelete(name: string) {
		this.zutaten.splice(this.zutaten.findIndex((zutat) => zutat.name === name), 1);
	}
}
</script>

