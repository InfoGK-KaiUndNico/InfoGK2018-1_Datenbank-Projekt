<template>
	<div class="container">
            <h2 class="mt-2">Hier sehen sie das ausgewählte Rezept</h2>
            <form id="formRA" action="select.html">
                <div class="row">
                    <div class="col-3">
                        <label>Name</label>
                        <p>{{name}}</p>
                    </div>
                    <div class="col-3">
                        <label>Zeitaufwand</label>
                        <p>{{laufzeitBerechnen()}}</p>
                    </div>
                    <div class="col-3">
                        <label>Art des Rezepts</label>
                        <p>{{art}}</p>
                    </div>
                </div>
                <div class="row">                
                    <div class="col-12">
                        <label>Zutaten</label>
                        <ul>
							<li v-for="zutat in zutaten" v-bind:key="zutat.zutat">
								{{zutat.menge}}g {{zutat.zutat}}
							</li>
						</ul>
                    </div>
                </div>
				<div class="row">
					<div class="col-6">
                        <label>Anleitung</label>
                        <p>{{anleitung}}</p>
                    </div>
					<div class="col-6"> 
                		<label>Nährwerte</label> 
                        <p>To be added</p> 
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
	private rezeptId: string = '';
	private name: string = '';
	private laufzeit: number = 0;
	private art: string = '';
	private zutaten: any[] = [];
	private anleitung: string = '';

	private mounted() {
		this.rezeptId = this.$route.params.id;
		this.loadRezeptData();
	}

	private laufzeitBerechnen() {
		if (this.laufzeit > 60) {
			return `${this.laufzeit / 60}h`;
		}

		return `${this.laufzeit} min.`;
	}

	private async loadRezeptData() {
		const response = await fetch(`http://localhost:4000/recipes/${this.rezeptId}`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		const { name, laufzeit, art, anleitung, zutaten } = await response.json();

		this.name = name;
		this.laufzeit = laufzeit;
		this.art = art;
		this.anleitung = anleitung;
		this.zutaten = zutaten;
	}

	private async loadZutatenData() {
		const response = await fetch(`http://localhost:4000/recipes/${this.rezeptId}`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});
		let verwendeteZutaten: any[] = [];
		const { verwendung }: { verwendung: string[] } = await response.json();
		verwendeteZutaten = verwendung.map((verwendet: string) => ({ name: verwendet, menge: verwendet }));
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
