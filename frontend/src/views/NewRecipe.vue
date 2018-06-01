<template>
    <div class="container">
        <h2 class="mt-1"> Sie sind bei der Rezepteingabe.</h2>
        <form id="formNR" action="select.html">
            <div class="row">
                <div class="col-2">
                    <label id="labelLaufzeit">Zeitaufwand</label>
                    <input class="form-control" placeholder="Zeit (HH:MM)" v-model="inputLaufzeit"/>
                </div>
                <div class="col-2">
                    <label>Art des Rezepts</label>
                    <select class="form-control" name="Art" v-model="inputArt">
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
                <div class="col-4 mt-2">
                    <label id="labelZutaten">Zutaten</label>
                    <textarea class="form-control" v-model="inputZutaten" placeholder="eine Zutat pro Zeile"></textarea>
                </div>
                <div class="col-6 mt-2">
                    <label>Anleitung</label>
                    <textarea class="form-control" v-model="inputAnleitung"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-3">
                    <span class="btn btn-primary mt-3" @click="checkAnleitung">
                        Posten
                    </span>
                </div>
            </div>
            <div class="row">
                <h4 class="mt-2 ml-2">Hilfe</h4>
            </div>
            <div class="row">
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
        </form>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

@Component
export default class NewRecipe extends Vue {
  //TODO request input Name und Label name from kai
  private inputName: string = "";
  private inputAnleitung: string = "";
  private inputZutaten: string = "";
  private inputArt: string = "";
  private inputLaufzeit: string = "";
  //TODO request button zurück from Kai
  zurueck() {
    this.$router.push("/hauptseite");
  }
  private checkAnleitung(event: MouseEvent) {
    event.preventDefault();
    if (this.inputLaufzeit.length > 0) {
      if (/\d\d:\d\d/.test(this.inputLaufzeit) === false) {
        const labelLaufzeit: HTMLLabelElement = document.querySelector(
          "#labelLaufzeit"
        )!;
        labelLaufzeit.innerHTML = "Bitte Format beachten (HH:MM)";
        labelLaufzeit.style.color = "red";
        return;
      }
    }
    if (this.inputName.length < 1) {
      const labelName: HTMLLabelElement = document.querySelector("#labelName")!;
      labelName.innerHTML = "Bitte Name eingeben";
      labelName.style.color = "red";
      return;
    }
    if (this.inputZutaten.length < 1) {
      const labelZutaten: HTMLLabelElement = document.querySelector(
        "#labelZutaten"
      )!;
      labelZutaten.innerHTML = "Bitte Zutaten eingeben";
      labelZutaten.style.color = "red";
      return;
    }
    this.rezeptAnlegen(
      this.inputName,
      this.inputAnleitung,
      this.inputZutaten,
      this.inputArt,
      this.inputLaufzeit
    );
  }
  private async rezeptAnlegen(
    Name: string,
    Anleitung: string,
    Zutaten: string,
    Art: string,
    Laufzeit: string
  ) {
    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    //send token and username to backend to veryfy identity and access, send currentPW and currentUN to update data
    const response = await fetch("url", {
      body: JSON.stringify({
        userName,
        token,
        Name,
        Anleitung,
        Zutaten,
        Art,
        Laufzeit
      }),
      headers,
      method: "POST",
      mode: "cors"
    });
    //Handle Errors, request from Kai <p id="uploadFail"></p>
    const uploadFail: HTMLLabelElement = document.querySelector("#uploadFail")!;
    if (!response.ok) {
      uploadFail.innerHTML = "Fehler beim Hochladen";
    } else {
      uploadFail.innerHTML = "Daten erfolgreich hochgeladen!";
    }
  }
}
</script>
