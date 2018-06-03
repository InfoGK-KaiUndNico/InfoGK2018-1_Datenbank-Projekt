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
                        <p id="anzeigeZutaten"></p>
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

@Component({})
export default class Rezeptanzeige extends Vue {
	private rezeptId: string;

	private mounted() {
		this.rezeptId = this.$route.params.id;
		this.loadRezeptData();
	}

	private async loadRezeptData() {
	// TODO perform loading
	}
}
</script>
