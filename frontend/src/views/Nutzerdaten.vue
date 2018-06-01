<template>
    <div class="container">
        <h2 class="mt-1">Hier sehen sie ihre Nutzerdaten</h2>
        <form id="formND" action="select.html">
            <div class="row">
                <div class="col-3 mt-3">
                    <label>Nutzername</label>
                    <input id="inputChangeUsername" class="form-control" v-model="changeUsername"/>
                </div>
                <div class="col-3 mt-3">
                    <label>Passwort</label>
                    <input id="inputChangePassword" class="form-control" v-model="changePassword"/>
                </div>
                <div class="col-2 mt-5">
                    <span class="btn btn-primary " @click="zurueck">
                        zurück
                    </span>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

@Component
export default class Nutzerdaten extends Vue {
  private inputChangeUsername: string = "";
  private inputChangePassword: string = "";
  private inputUsername: HTMLInputElement = document.querySelector(
    "#inputChangeUsername"
  );
  private inputPassword: HTMLInputElement = document.querySelector(
    "#inputChangePassword"
  );
  //showUserData
  private async showUserData() {
    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    //send token and username to backend to veryfy identity and get data
    const response = await fetch("url", {
      body: JSON.stringify({ userName, token }),
      headers,
      method: "POST",
      mode: "cors"
    });
    if (!response.ok) {
      this.inputUsername.innerHTML = "Fehler beim Laden der Daten";
      this.inputPassword.innerHTML = "Fehler beim Laden der Daten";
      return;
    }
    //output data
    const { responseUsername, responsePassword } = await response.json();
    this.inputUsername.innerHTML = responseUsername;
    this.inputPassword.innerHTML = responsePassword;
  }
  private zurueck() {
    this.$router.push("/hauptseite");
  }
  private checkUserdata(event: MouseEvent) {
    event.preventDefault();
    if (
      /\s+/.test(this.inputChangeUsername) === true ||
      this.inputChangeUsername.length < 1
    ) {
      this.inputUsername.innerHTML = "Nutzername muss min. 1 Zeichen enthalten";
      this.inputUsername.style.color = "red";
      this.showUserData();
      return;
    }
    if (this.inputChangePassword.length < 1) {
      this.inputPassword.innerHTML = "Passwort muss min. 1 Zeichen enthalten";
      this.inputPassword.style.color = "red";
      this.showUserData();
      return;
    }
    this.updateUser(this.inputChangeUsername, this.inputChangePassword);
  }
  //TODO update Data !Request Button from Kai (@click="updateUser"), <p id="loginFail"></p>
  private async updateUser(currentUsername: string, currentPassword: string) {
    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    //send token and username to backend to veryfy identity and access, send currentPW and currentUN to update data
    const response = await fetch("url", {
      body: JSON.stringify({
        userName,
        token,
        currentPassword,
        currentUsername
      }),
      headers,
      method: "POST",
      mode: "cors"
    });
    //Handle Errors
    const updateFail: HTMLLabelElement = document.querySelector("#updateFail")!;
    if (!response.ok) {
      updateFail.innerHTML = "Fehler beim Hochladen";
    } else {
      updateFail.innerHTML = "Daten erfolgreich hochgeladen!";
    }
  }
}
</script>