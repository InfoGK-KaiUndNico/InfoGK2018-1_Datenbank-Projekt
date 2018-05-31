<template>
    <div class="container">
                <h2 class="mt-2">Hallo, willkommen bei unserer Rezepte Datenbank.</h2>
                <h3>Bitte melden sie sich an, um sie zu nutzen.</h3>
                <form id="formIndex1" action="select.html">
                    <div class="row">
                        <div class="col-3 mt-3">
                            <label id="labelNutzername">Nutzername</label>
                            <input @keypress.enter="moveFocus" id="inputUsername" class="form-control" v-model="userName" />
                        </div>
                        <div class="col-3 mt-3">
                            <label id="labelPasswort">Passwort</label>
                            <input @keypress.enter="check" id="inputPassword" type="password" class="form-control" v-model="password" />
                        </div>
                        <div class="col-3 mt-5">
                            <button @click="check" class="btn btn-primary">
                              Log In
                            </button>
                        </div>
                    </div>
                </form>
            </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  private userName: string = "";
  private password: string = "";

  private moveFocus() {
    const inputPassword: HTMLInputElement = document.querySelector(
      "#inputPassword"
    );
    inputPassword.focus();
  }

  private check(event: MouseEvent) {
    event.preventDefault();

    if (/\s+/.test(this.userName) === true || this.userName.length < 1) {
      const labelNutzername: HTMLLabelElement = document.querySelector(
        "#labelNutzername"
      );
      labelNutzername.innerHTML = "Bitte Nutzername eingeben";
      labelNutzername.style.color = "red";
      return;
    }

    if (this.password.length < 1) {
      const labelPasswort: HTMLLabelElement = document.querySelector(
        "#labelPasswort"
      );
      labelPasswort.innerHTML = "Bitte Passwort eingeben";
      labelPasswort.style.color = "red";
      return;
    }

    this.login(this.userName, this.password);
  }

  private login(userName: string, password: string) {
    alert("doing login");
  }
}
</script>

