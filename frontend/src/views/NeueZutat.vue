<template>
	<div class="container"> 
            <h2 class="mt-2"> Sie sind bei der Zutateingabe.</h2> 
            <form id="formNZ" action="select.html"> 
                <div class="row"> 
                    <div class="col-2 mt-3"> 
                        <label id="inputZutatname">Zutatname</label> 
                        <input class="form-control" v-model="inputName"/> 
                    </div> 
                    <div class="col-4 mt-3"> 
                        <label id="inputNaehrwerteLabel">Nährwerte</label> 
                        <input class="form-control" v-model="inputNaehrwerte"/> 
                    </div>
					<div class="col-2 mt-5"> 
                        <span class="btn btn-primary" @click="hinzufügen"> 
                            Hinzufügen  
                        </span>
						<p id="labelZutatHinzufügen"></p>
                    </div>  
                    <div class="col-2 mt-5"> 
                        <span class="btn btn-primary"> 
                            Überprüfen 
                        </span>  
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
	private inputName: string = "";
	private inputNaehrwerte: string = "";
	private labelZutatHinzufügen = document.querySelector('#labelZutatHinzufügen')
	private Zutaten = [];

private async mounted() {
		const zutaten = await loadZutaten();
		this.Zutaten = zutaten;
	}

	private async hinzufügen() {
		if (checkUserdata(this.inputName, 20, { checkWhitespace: true, checkLength: true }) === false) {
			const inputZutatname = document.querySelector('#inputZutatname')!;
			inputZutatname.innerHTML = 'keine Leer und Sonderzeichen im Zutatname';
            return;
		}

		if (checkUserdata(this.inputNaehrwerte, 20, { checkWhitespace: false, checkLength: true }) === false) {
			const inputNaehrwerteLabel = document.querySelector('#inputNaehrwerteLabel')!;
			inputNaehrwerteLabel.innerHTML = 'keine Leer und Sonderzeichen in den Nährwerten';
            return;
		}

		if (this.Zutaten.includes(this.inputName)) {
			this.labelZutatHinzufügen.innerHTML = 'Zutat schon vorhanden';
			return;
		}

		const response = await fetch(`http://localhost:4000/auth`, {
			body: JSON.stringify({ ZutatName: this.inputName, Naehrwerte: this.inputNaehrwerte }),
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
