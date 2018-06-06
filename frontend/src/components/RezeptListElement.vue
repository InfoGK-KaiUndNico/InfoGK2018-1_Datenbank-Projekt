<!-- One element in any list of recipes, displaying name, author and review status -->
<!-- Admins can see abutton offering to review said recipe -->
<!-- ListElement is a button that opens the recipes display page -->
<template>
	<div @click="rezeptOeffnen" style="cursor: pointer">
		<p style="color: blue">{{rezept.name}}</p>
		<p>{{rezept.erstelltVon}}</p>
		<p v-if="isReviewed">reviewed</p>
		<button @click="createReview" v-if="shouldReview" class="btn btn-primary">
            Rezept bestätigen
        </button>
	</div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';
import getCommonHeaders from '../lib/util/getCommonHeaders';

@Component({})
export default class RezeptListElement extends Vue {
	@Prop({ default: {}})
	private rezept: any;

	private shouldReview: boolean = false;
	private isReviewed: boolean = true;

	private mounted() {
	// determine if user is admin and if recipe is unreviewed
		this.isReviewed = this.rezept.review === null;
		this.shouldReview = localStorage.getItem('userRang') === 'Admin' && this.rezept.review === null;
	}

	private rezeptOeffnen() {
	// go to elements display page
		this.$router.push(`/rezept/${this.rezept.id}`);
	}

	private async createReview() {
	// post the review to backend
		const response = await fetch(`http://localhost:4000/reviews`, {
			headers: getCommonHeaders(),
			body: JSON.stringify({ type: 'rezept', subject: this.rezept.id, annotations: '' }),
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

