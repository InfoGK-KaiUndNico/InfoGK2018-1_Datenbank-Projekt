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

@Component({})
export default class NeueZutat extends Vue {
	private inputName: string = '';
	private inputNaehrwerte: string = '';
	private inputArt: string = '';

	private labelZutatHinzufügen: Element;

	private erlaubteZutatenArten = ['Fleisch', 'Gemüse', 'Obst und Nüsse', 'Gewürz', 'trocken', 'andere'];
	private ZutatArten = this.erlaubteZutatenArten.map((name: string) => ({ name, value: name }));

	private async mounted() {
		const labelZutatHinzufügen = document.querySelector('#labelZutatHinzufügen');
		if (!labelZutatHinzufügen) {
			return;
		}

		this.labelZutatHinzufügen = labelZutatHinzufügen;
	}

	private async addZutat() {
		if (checkUserdata(this.inputName, 20, { checkWhitespace: true, checkLength: true }) === false) {
			const inputZutatname = document.getElementById('#inputZutatname')!;
			inputZutatname.innerHTML = 'keine Leer und Sonderzeichen im Zutatname';
			inputZutatname.style.color = 'red';
			return;
		}

		if (checkUserdata(this.inputNaehrwerte, 20, { checkWhitespace: false, checkLength: true }) === false) {
			const inputNaehrwerteLabel = document.getElementById('#inputNaehrwerteLabel')!;
			inputNaehrwerteLabel.innerHTML = 'keine Leer und Sonderzeichen in den Nährwerten';
			inputNaehrwerteLabel.style.color = 'red';
			return;
		}

		if (!this.erlaubteZutatenArten.includes(this.inputArt)) {
			return;
		}

		const response = await fetch(`http://localhost:4000/ingredients`, {
			body: JSON.stringify({ name: this.inputName, naehrwerte: this.inputNaehrwerte, art: this.inputArt }),
			headers: getCommonHeaders(),
			method: 'POST',
			mode: 'cors'
		});

		if (!response.ok) {
			this.labelZutatHinzufügen.innerHTML = 'Fehler beim hinzufügen';
			return;
		}

		this.$router.push('/hauptseite');
	}
}
</script>
