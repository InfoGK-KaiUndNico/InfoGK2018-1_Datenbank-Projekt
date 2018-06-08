<!-- inputs for data of ingredients, submit button and link back to mainpage -->
<template>
	<div class="container"> 
			<h2 class="mt-2"> Sie sind bei der Zutateingabe.</h2> 
			<form id="formNZ" action="select.html"> 
				<div class="row mt-3"> 
					<div class="col-6 "> 
						<label id="inputZutatname">Zutatname</label> 
						<input class="form-control" v-model="inputName"/> 
					</div>
				</div>
				<div class="row mt-3">
					<div class="col-6 "> 
						<label id="inputNaehrwerteLabel">Nährwerte</label> 
						<textarea class="form-control" v-model="inputNaehrwerte"></textarea> 
					</div>
				</div>
				<div class="row mt-3">
					<div class="col-6">
                        <label>Art der Zutat</label>
                        <select class="form-control" v-model="inputArt">
                            <option v-for="option in ZutatArten" :value="option.value" :key="option.name" >
								{{ option.name }}
							</option>
                        </select>
                    </div>
				</div>
				<div class="row mt-5">
					<div class="col-12"> 
						<span class="btn btn-primary mr-3" @click="addZutat"> 
							Hinzufügen  
						</span>
						<router-link to="/hauptseite">
							<span class="btn btn-outline-secondary"> 
								Zurück 
							</span>
						</router-link>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<span id="labelZutatHinzufügen"></span>
					</div>
				</div>
			</form> 
		</div> 
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import checkUserdata from '../lib/util/checkUserInput';
import loadZutaten from '../lib/util/loadZutaten';
import getCommonHeaders from '../lib/util/getCommonHeaders';
import getHost from '@/lib/util/getHost';
import checkLoggedIn from '@/lib/util/checkLoggedIn';

@Component({})
export default class NeueZutat extends Vue {
	private inputName: string = '';
	private inputNaehrwerte: string = '';
	private inputArt: string = '';

	private labelZutatHinzufügen: Element;

	private erlaubteZutatenArten = ['Fleisch', 'Gemüse', 'Obst und Nüsse', 'Gewürz', 'trocken', 'andere'];
	private ZutatArten = this.erlaubteZutatenArten.map((name: string) => ({ name, value: name }));

	private async mounted() {
		if (!checkLoggedIn()) {
			return this.$router.push('/anmeldung');
		}

		// get Elements
		const labelZutatHinzufügen = document.querySelector('#labelZutatHinzufügen');
		if (!labelZutatHinzufügen) {
			return;
		}

		this.labelZutatHinzufügen = labelZutatHinzufügen;
	}

	private async addZutat() {
		// check input name
		if (checkUserdata(this.inputName, 20, { checkWhitespace: true, checkLength: true }) === false) {
			const inputZutatname = document.getElementById('inputZutatname')!;
			inputZutatname.innerHTML = 'Keine Leer- und Sonderzeichen im Zutatname erlaubt';
			inputZutatname.style.color = 'red';
			return;
		}

		// check input nährwerte
		if (checkUserdata(this.inputNaehrwerte, 20, { checkWhitespace: false, checkLength: true }) === false) {
			const inputNaehrwerteLabel = document.getElementById('inputNaehrwerteLabel')!;
			inputNaehrwerteLabel.innerHTML = 'Keine Leer- und Sonderzeichen in den Nährwerten erlaubt';
			inputNaehrwerteLabel.style.color = 'red';
			return;
		}

		// check if art is valid
		if (!this.erlaubteZutatenArten.includes(this.inputArt)) {
			return;
		}

		// post new ingredient to backend
		const response = await fetch(`${getHost()}/ingredients`, {
			body: JSON.stringify({ name: this.inputName, naehrwerte: this.inputNaehrwerte, art: this.inputArt }),
			headers: getCommonHeaders(),
			method: 'POST',
			mode: 'cors'
		});

		if (!response.ok) {
			this.labelZutatHinzufügen.innerHTML = 'Fehler beim Hinzufügen';
			return;
		}

		// return to mainpage
		this.$router.push('/hauptseite');
	}
}
</script>
