<template>
	<div class="card">
		<div class="card-body">
			<p style="color: #007bff">{{zutat.name}}</p>
			<p>{{zutat.submitter}}</p>

			<!-- admin review indicators -->
			<button @click="createReview" v-if="!isReviewed && canReview" class="btn btn-primary">
				Zutat bestätigen
			</button>
			<button v-else-if="isReviewed && canReview" disabled class="btn btn-success">Bestätigt!</button>
			
			<!-- user review indicators -->
			<span v-if="isReviewed && !canReview">✔️ Bestätigt</span>
			<span v-else-if="!isReviewed && !canReview">❌ Nicht bestätigt</span>

			<span v-show="canDelete" class="text-danger ml-3" style="cursor: pointer" @click="deleteZutat">❌ Löschen</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import getCommonHeaders from '../lib/util/getCommonHeaders';
import getHost from '../lib/util/getHost';

@Component({})
export default class ZutatListCardElement extends Vue {
	@Prop({ default: {} })
	private zutat: any;

	@Prop() private onDelete: (name: string) => void;

	private canReview: boolean = false;
	private isReviewed: boolean = true;

	private canDelete: boolean = false;

	private mounted() {
		// determine if user is admin and if recipe is unreviewed
		this.isReviewed = this.zutat.review !== null;

		const isAdmin = localStorage.getItem('userRang') === 'Admin';

		this.canReview = isAdmin;
		this.canDelete = isAdmin;
	}

	private async deleteZutat(event: MouseEvent) {
		event.preventDefault();

		const response = await fetch(`${getHost()}/ingredients/${this.zutat.name}`, {
			headers: getCommonHeaders(),
			method: 'DELETE',
			mode: 'cors'
		});

		if (!response.ok) {
			// TODO Show/handle error
			return;
		}

		this.onDelete(this.zutat.name);
	}

	private async createReview(event: MouseEvent) {
		event.preventDefault();

		// post the review to backend
		const response = await fetch(`${getHost()}/reviews`, {
			headers: getCommonHeaders(),
			body: JSON.stringify({ type: 'zutat', subject: this.zutat.name, annotations: '' }),
			method: 'POST',
			mode: 'cors'
		});

		if (!response.ok) {
			// TODO Handle errors
			return;
		}

		// update isReviewed to toggle button
		this.isReviewed = true;
	}
}
</script>

