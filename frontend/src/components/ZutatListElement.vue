<template>
	<div>
		<p>{{name}}</p>
		<p>{{naehrwerte}}</p>
		<button @click="review" v-if="shouldReview" class="btn btn-primary">
            Zutat bestätigen
        </button>
	</div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class RezeptListElement extends Vue {
	@Prop({ default: '' })
	private name: string;

	@Prop({ default: '' })
	private erstelltVon: string;

	@Prop({ default: null })
	private review: string;

	private shouldReview: boolean = localStorage.getItem('userRang') === 'Admin' && this.review === null;
	private isReviewed: boolean = this.review === null;

}
</script>
