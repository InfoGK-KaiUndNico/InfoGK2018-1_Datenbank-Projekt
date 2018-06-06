<template>
	<div @click="rezeptOeffnen">
		<p>{{rezept.name}}</p>
		<p>{{rezept.erstelltVon}}</p>
		<p v-if="isReviewed">reviewed</p>
		<button @click="createReview" v-if="shouldReview" class="btn btn-primary">
            Rezept bestätigen
        </button>
	</div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class RezeptListElement extends Vue {
	@Prop({ default: {}})
	private rezept: any;

	private shouldReview: boolean = false;
	private isReviewed: boolean = true;

	private mounted() {
		this.isReviewed = this.rezept.review === null;
		this.shouldReview = localStorage.getItem('userRang') === 'Admin' && this.rezept.review === null;
	}

	private rezeptOeffnen() {
		this.$router.push(`/rezept/${this.rezept.id}`);
	}

	private createReview() {
		// TODO
	}
}
</script>

