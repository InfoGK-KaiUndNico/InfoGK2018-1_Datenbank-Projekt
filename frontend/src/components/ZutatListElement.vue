<!-- One element in any list of ingredients, displaying name, and nutritional value -->
<!-- Admins can see abutton offering to review said recipe -->
<template>
	<div>
		<p>{{zutat.name}}</p>
		<p>{{zutat.naehrwerte}}</p>
		<button @click="review" v-show="!isReviewed && shouldReview" class="btn btn-primary">
            Zutat bestätigen
        </button>
	</div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';
import getCommonHeaders from '../lib/util/getCommonHeaders';

@Component({})
export default class ZutatListElement extends Vue {
	@Prop({ default: {}})
	private zutat: any;

	private shouldReview: boolean = false;
	private isReviewed: boolean = true;

	private mounted() {
		// determine if autor is admin and ingredient is not reviewed
		this.shouldReview = localStorage.getItem('userRang') === 'Admin';
		this.isReviewed = this.zutat.review === null;
	}

	private async review(event: MouseEvent) {
		event.preventDefault();

		// post review to backend
		const response = await fetch(`http://localhost:4000/reviews`, {
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
