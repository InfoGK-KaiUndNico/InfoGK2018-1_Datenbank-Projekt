<template>
	<div class="container">
            <h2 class="mt-2">Rezeptansicht</h2>
            <form id="formRA" action="select.html">
                <div class="row">
                    <div class="col-3">
                        <label>Name</label>
                        <p><b>{{name}}</b></p>
                    </div>
                    <div class="col-3">
                        <label>Zeitaufwand</label>
                        <p><b>{{laufzeitBerechnen()}}</b></p>
                    </div>
                    <div class="col-3">
                        <label>Art des Rezepts</label>
                        <p><b>{{art}}</b></p>
                    </div>
					<div class="col-3">
						<label>Überprüft?</label>
						<p v-if="review === null">❌</p>
						<p v-else>✔️</p>
					</div>
                </div>
				<div class="row">
					<div class="col-3">
						<label>Erstellt von</label>
						<p><b>{{erstelltVon}}</b></p>
					</div>
					<div class="col-3">
						<label>Erstellt</label>
						<p><b>{{erstellungsDatumBerechnen()}}</b></p>
					</div>
				</div>
                <div class="row mt-3">                
                    <div class="col-12">
                        <label>Zutaten</label>
                        <ul class="list-group">
							<li class="list-group-item" v-for="zutat in zutaten" v-bind:key="zutat.zutat">
								{{zutat.menge}}g {{zutat.zutat}}
							</li>
						</ul>
                    </div>
                </div>
				<div class="row mt-3">
					<div class="col-8">
                        <label>Anleitung</label>
                        <p>{{anleitung}}</p>
                    </div>
					<div class="col-4"> 
                		<label>Nährwerte</label> 
                        <p>To be added</p> 
                    </div>
				</div>
				<div class="row mt-3">
					<div class="col-12">
						<router-link to="/hauptseite">
							<span class="btn btn-outline-secondary">
								Zurück
							</span>
						</router-link>
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
	private review: any = null;
	private erstelltVon: string = '';
	private erstellt: string = new Date().toISOString();

	private mounted() {
		this.rezeptId = this.$route.params.id;
		this.loadRezeptData();
	}

	private laufzeitBerechnen() {
		if (this.laufzeit > 60) {
			return `${(this.laufzeit / 60).toFixed(1)}h`;
		}

		return `${this.laufzeit} min.`;
	}

	private erstellungsDatumBerechnen() {
		const date = new Date(this.erstellt);
		return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
	}

	private async loadRezeptData() {
		const response = await fetch(`http://localhost:4000/recipes/${this.rezeptId}`, {
			headers: getCommonHeaders(),
			method: 'GET',
			mode: 'cors'
		});

		const { name, laufzeit, art, anleitung, zutaten, review, erstelltVon, erstellt } = await response.json();

		this.name = name;
		this.laufzeit = laufzeit;
		this.art = art;
		this.anleitung = anleitung;
		this.zutaten = zutaten;
		this.review = review;
		this.erstelltVon = erstelltVon;
		this.erstellt = erstellt;
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
