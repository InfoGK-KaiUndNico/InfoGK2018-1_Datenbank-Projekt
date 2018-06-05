<template>
	<div class="container">
            <h2 class="mt-2">Hier sehen sie das ausgewählte Rezept</h2>
            <form id="formRA" action="select.html">
                <div class="row">
                    <div class="col-3">
                        <label>Name</label>
                        <p id="anzeigeName"></p>
                    </div>
                    <div class="col-3">
                        <label>Zeitaufwand</label>
                        <p id="anzeigeLaufzeit"></p>
                    </div>
                    <div class="col-3">
                        <label>Art des Rezepts</label>
                        <p id="anzeigeArt"></p>
                    </div>
                </div>
                <div class="row">                
                    <div class="col-3">
                        <label>Zutaten</label>
                        <ul>
							<li v-for="zutat in verwendeteZutaten" v-bind:key="zutat.name">
								{{zutat.menge}}g{{zutat.name}}
							</li>
						</ul>
                    </div>                
                    <div class="col-5">
                        <label>Anleitung</label>
                        <p id="anzeigeAnleitung"></p>
                    </div>
					<div class="col-4"> 
                		<label>Nährwerte</label> 
                        <p id="anzeigeNaehrwerte"></p> 
                    </div> 
                </div>
            </form>
        </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import getCommonHeaders from '../lib/util/getCommonHeaders';

@Component({})
export default class Rezeptanzeige extends Vue {
	private rezeptId: string;
	private anzeigeName = document.querySelector('#anzeigeName');
	private anzeigeLaufzeit = document.querySelector('#anzeigeLaufzeit');
	private anzeigeArt = document.querySelector('#anzeigeArt');
	private anzeigeZutaten = document.querySelector('#anzeigZutaten');
	private anzeigeAnleitung = document.querySelector('#anzeigAnleitung');

	private mounted() {
		this.rezeptId = this.$route.params.id;
		this.loadRezeptData();
		this.loadZutatenData();
		// this.loadNaehrwerteData();
	}

	private async loadRezeptData() {
		const response = await fetch('http://localhost:4000/recipes/${rezeptId}', {
		headers: getCommonHeaders(),
		method: 'GET',
		mode: 'cors'
		});
		const { name, laufzeit, art, anleitung } = await response.json();
		this.anzeigeName = name;
		this.anzeigeLaufzeit = laufzeit;
		this.anzeigeArt = art;
		this.anzeigeAnleitung = anleitung;
	}

	private async loadZutatenData() {
		const response = await fetch('http://localhost:4000/recipes/${rezeptId}', {
		headers: getCommonHeaders(),
		method: 'GET',
		mode: 'cors'
		});
		let verwendeteZutaten: any[] = [];
		const {verwendung}: { verwendung: string[] } = await response.json();
		verwendeteZutaten = verwendung.map((verwendet: string) => ({ name: verwendet, menge: verwendet}));
	}

	/* private async loadNaehrwerteData() {
		const response = await fetch('http://localhost:4000/recipes/${rezeptId}', {
		headers: getCommonHeaders(),
		method: 'GET',
		mode: 'cors'
		});
		for(const of ){}
	} */
}
</script>
