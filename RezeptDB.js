/*  user functions (new user, login, edit data)
    newRecipe edit recipe
    recipe fetch(favourites, selfmade, bookmarked, by attributes/ ingredients)
*/

//login
const inpFldUsername = document.querySelector("#Nname");
const inpFldPW = document.querySelector("#PWort");
const lblUsername = document.querySelector("#NnameLabel");
const lblPW = document.querySelector("#PWortLabel");

//jump to password field
inpFldUsername.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    inpFldPW.focus();
  }
});

inpFldPW.addEventListener("keydown", event => {
  if (event.key !== "Enter") {
    return;
  }
  // Check username for whitespace
  if (/\s+/.test(inpFldUsername.value) === true) {
    lblUsername.value = "Bitte Nutzername eingeben";
    lblUsername.style.color = "red";
    return;
  }
  // Check password for whitespace
  if (/\s+/.test(inpFldPW.value) === true) {
    lblPW.value = "Bitte Passwort eingeben";
    lblPW.style.color = "red";
    return;
  }
  login(inpFldUsername.value, inpFldPW.value);
});

function login(UN, PW) {
  window.location.assign("Hauptseite.html");
  let sessionUserName = inpFldUsername.value;
}
