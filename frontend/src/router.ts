import Vue from "vue";
import Router from "vue-router";
import NewRecipe from "./views/NewRecipe.vue";
import Login from "./views/Login.vue";
import Nutzerdaten from "./views/Nutzerdaten.vue";
import Hauptseite from "./views/Hauptseite.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      alias: "/",
      path: "/anmeldung",
      name: "login",
      component: Login
    },
    {
      path: "/hauptseite",
      name: "newrecipe",
      component: Hauptseite
    },
    {
      path: "/neues-rezept",
      name: "newrecipe",
      component: NewRecipe
    },
    {
      path: "/nutzerdaten",
      name: "nutzerdaten",
      component: Nutzerdaten
    }
  ]
});
