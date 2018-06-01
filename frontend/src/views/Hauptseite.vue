<template>
    <div class="container">
        <h2 class="mt-1">Hier geben sie Rezepte ein, suchen sie und sehen ihre Infos.</h2>
        <form id="formHS" action="select.html">
            <div class="row">
                <div class="col-1">
                    <router-link to="/neues-rezept">
                        <span class="btn btn-primary mt-3 mb-1 mr-5">
                            Neues Rezept
                        </span>
                    </router-link>
                </div>
                <div class="col-1">
                    <router-link to="/nutzerdaten">
                        <span class="btn btn-primary mt-3 mb-1 ml-5 mr-5">
                            Nutzerdaten
                        </span>
                    </router-link>
                </div>
            </div>
            <div class="row">
                <div class="col-3">
                    <label>Rezeptsuche</label>
                    <input class="form-control" placeholder="Suche" />
                </div>
                <div class="col-3">
                    <label>Zutatensuche</label>
                    <select class="form-control">
                        <option>Salz</option>
                        <option>Pfeffer</option>
                        <option>Zucker</option>
                        <option>witziger Witz</option>
                    </select>
                </div>
                <div class="col-3">
                    <label>Suche nach Art</label>
                    <select class="form-control">
                        <option>Fleisch </option>
                        <option>Obst und Nüsse </option>
                        <option>Gemüse </option>
                        <option>Gewürz </option>
                        <option>trocken </option>
                        <option>Herzhaft </option>
                        <option>Süß </option>
                        <option>andere </option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p id="paragraphHS1">
                        <span>
                            Hier
                            <br>kannst
                            <br>du
                            <br>mit
                            <br>JS
                            <br>die
                            <br>Ausgabe
                            <br>reinschreiben
                        </span>
                    </p>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

@Component
export default class Hauptseite extends Vue {}
</script>