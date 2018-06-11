import Vue from 'vue';
import Router from 'vue-router';

import NewRecipe from './views/NewRecipe.vue';
import Login from './views/Login.vue';
import Nutzerdaten from './views/Nutzerdaten.vue';
import Hauptseite from './views/Hauptseite.vue';
import Registrieren from './views/Registrieren.vue';
import Rezeptanzeige from './views/Rezeptanzeige.vue';
import NeueZutat from './views/NeueZutat.vue';
import ZuUeberpruefen from './views/ZuUeberpruefen.vue';
import Rezeptliste from './views/Rezeptliste.vue';
import Zutatenliste from './views/Zutatenliste.vue';

Vue.use(Router);

export default new Router({
	routes: [
		{
			alias: '/',
			path: '/anmeldung',
			name: 'login',
			component: Login
		},
		{
			path: '/hauptseite',
			name: 'mainpage',
			component: Hauptseite
		},
		{
			path: '/unbestaetigt',
			name: 'unconfirmed',
			component: ZuUeberpruefen
		},
		{
			path: '/registrieren',
			name: 'register',
			component: Registrieren
		},
		{
			path: '/rezepte',
			name: 'recipelist',
			component: Rezeptliste
		},
		{
			path: '/rezept/:id',
			name: 'recipe',
			component: Rezeptanzeige
		},
		{
			path: '/zutaten',
			name: 'zutatenliste',
			component: Zutatenliste
		},
		{
			path: '/neues-rezept',
			name: 'newrecipe',
			component: NewRecipe
		},
		{
			path: '/neue-zutat',
			name: 'newzutat',
			component: NeueZutat
		},
		{
			path: '/nutzerdaten',
			name: 'userdata',
			component: Nutzerdaten
		}
	]
});
