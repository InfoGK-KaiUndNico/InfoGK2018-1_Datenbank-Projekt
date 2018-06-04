<template>
    <div class="container">
        <h2 class="mt-2"> Sie sind bei der Rezepteingabe.</h2>
        <form id="formNR" action="select.html">
            <div class="row">
				<div class="col-3">
                    <label id="labelName">Name</label>
                    <input class="form-control" placeholder="Name" v-model="inputName"/>
                </div>
                <div class="col-3" >
                    <label id="labelLaufzeit">Zeitaufwand</label>
                    <input class="form-control" placeholder="Zeit (HH:MM)" v-model="inputLaufzeit"/>
                </div>
                <div class="col-3">
                    <label>Art des Rezepts</label>
					<select class="form-control" name="Art" v-model="inputArt">
						<option v-for="option in rezeptArten" v-bind:key="option.name">
							{{ option.name }}
						</option>
					</select>
                </div>
			</div>
			<div class="row mt-2">
                    <div class="col-4">
                        <label>Zutat für Rezept</label>
                        <select class="form-control" v-model="inputZutat">
                            <option v-for="option in Zutaten" v-bind:key="option.name" >
								{{ option.name }}
							</option>
                        </select>
                    </div> 
                    <div class="col-3">
						<label>Menge der Zutat</label>
                        <input class="form-control" placeholder="Menge in Gramm" v-model="inputMenge"/>
                    </div>
                    <div class="col-3">
						<label>Zutat zum Rezept hinzufügen</label>
                        <button class="btn btn-primary" @click="addZutat" :disabled="inputZutat.length < 1 || inputMenge.length < 1">
                            Hinzufügen
                        </button>
                    </div>
            </div>
			<div class="row">
				<div class="col-4">
					<label>Zutaten im Rezept</label>
					<ul>
						<li v-for="ingredient in verwendeteZutaten" v-bind:key="ingredient.name">
							{{ingredient.name}}{{ingredient.menge}}
						</li>
					</ul>
				</div>
			</div>
            <div class="row mt-2">
                <div class="col-6">
                    <label id="labelAnleitung">Anleitung</label>
                    <textarea class="form-control" v-model="inputAnleitung"></textarea>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-1 mr-1">
                    <span class="btn btn-primary" @click="rezeptAnlegen">
                        Posten
                    </span>
                </div>
				<div class="col-1">
                    <router-link to="/hauptseite">
						<span class="btn btn-primary">
							zurück
						</span>
                    </router-link>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-12">
					<h4 class="ml-2">Hilfe</h4>
					<ol>
						<li class="ml-2">Die Arbeit sollte in Arbeitsschritte geteilt werden. Ein Arbeitsschritt zeichnet sich dadurch aus, dass
							mit einer oder mehreren Zutaten die gleiche oder eine sehr ähnliche Tätigkeit ausgeführt werden.</li>
						<li class="ml-2">Die Arbeitsschritte sollten in der Anleitung chronologisch angeordnet sein, wenn mehrere Tätigkeiten
							parallel ausgeführt werden sollten sie getrennt chronologisch behandelt und mit einer entsprechenden
							Kennzeichnung (Untertitel) versehen werden.</li>
						<li class="ml-2">Für jeden Arbeitsschritt sollte ein Absatz verwendet werden, um die Lesbarkeit zu erleichtern</li>
						<li class="ml-2">Ähnliche oder sich widerholende Tätigkeiten müssen nicht immer vollständig beschrieben, sondern können
							auch zusammengefasst werden.</li>
						<li class="ml-2">Grundlegende Fähigkeiten im Kochen werden vorausgesetzt, komplizierte Vorgänge können aber in einem getrennten
							Absatz näher erläutert werden.</li>
					</ol>
				</div>
            </div>
        </form>
		<p id="updateFail"></p>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import checkUserdata from '../lib/util/checkUserInput';
import getCommonHeaders from '../lib/util/getCommonHeaders';
import loadZutaten from '../lib/util/loadZutaten';

@Component
export default class NewRecipe extends Vue {
	// TODO request input Name und Label name from kai

	// General recipe information bindings
	private inputName: string = '';
	private inputAnleitung: string = '';
	private inputArt: string = '';
	private inputLaufzeit: string = '';

	// Ingredient addition
	private inputZutat: string = '';
	private inputMenge: string = '';

	private verwendeteZutaten: any[] = [];

	private Zutaten: any[] = [];
	private rezeptArten: any[] = [
		{ name: 'Fleisch', value: 'Fleisch' },
		{ name: 'Obst und Nüsse', value: 'ObstUndNuesse' },
		{ name: 'Gemüse', value: 'Gemuese' },
		{ name: 'Gewürz', value: 'Gewuerz' },
		{ name: 'trocken', value: 'trocken' },
		{ name: 'Herzhaft', value: 'Herzhaft' },
		{ name: 'Süß', value: 'Suess' },
		{ name: 'andere', value: 'andere' }
	];
	private async mounted() {
		try {
			const zutaten = await loadZutaten();
			this.Zutaten = zutaten;
		} catch (err) {
			// Handle errors
			return;
		}
	}

	private addZutat() {
		this.verwendeteZutaten.push({ name: this.inputZutat, menge: this.inputMenge });
	}

	private async rezeptAnlegen(event: MouseEvent) {
		event.preventDefault();
		if (/\d\d:\d\d/.test(this.inputLaufzeit) === false) {
			const labelLaufzeit = document.querySelector('#labelLaufzeit')!;
			labelLaufzeit.innerHTML = 'Bitte Format beachten (HH:MM)';
			// labelLaufzeit.style.color = 'red';
			return;
		}

		if (
			checkUserdata(this.inputName, 100, {
				checkWhitespace: false,
				checkLength: true
			}) === false
		) {
			const labelName = document.querySelector('#labelName')!;
			labelName.innerHTML = 'Bitte Name eingeben (keine Sonderzeichen)';
			// labelName.style.color = 'red';
			return;
		}

		if (
			checkUserdata(this.inputAnleitung, 65538, {
				checkWhitespace: false,
				checkLength: true
			}) === false
		) {
			const labelName = document.querySelector('#labelAnleitung')!;
			labelName.innerHTML = 'Bitte Anleitung eingeben';
			// labelName.style.color = 'red';
			return;
		}

		// Send token and username to backend to veryfy identity and access, send currentPW and currentUN to update data
		const response = await fetch('url', {
			body: JSON.stringify({
				inputName: this.inputName,
				inputAnleitung: this.inputAnleitung,
				verwendeteZutaten: this.verwendeteZutaten,
				inputArt: this.inputArt,
				inputLaufzeit: this.inputLaufzeit
			}),
			headers: getCommonHeaders(),
			method: 'POST',
			mode: 'cors'
		});

		// Handle Errors, request from Kai <p id="uploadFail"></p>
		const uploadFail = document.querySelector('#uploadFail')!;
		if (!response.ok) {
			uploadFail.innerHTML = 'Fehler beim Hochladen';
			return;
		}

		uploadFail.innerHTML = 'Daten erfolgreich hochgeladen!';
	}
}
</script>
