import { createRouter, createWebHashHistory } from 'vue-router';

import LoginComponent from "../views/LoginComponent.vue";
import RegisterComponent from "../views/RegisterComponent.vue";
import HomeComponent from '../views/HomeComponent.vue';
import ClientsComponent from "../views/ClientsComponent.vue";
import ServicesComponent from "../views/ServicesComponent.vue";

const routes = [
    { path: '/', name: 'home', component: HomeComponent, meta: { requieresAuth: true } },
    { path: '/clientes', name: 'clients', component: ClientsComponent, meta: { requieresAuth: true } },
    { path: '/services', name: 'services', component: ServicesComponent, meta: { requieresAuth: true } },
    { path: '/login', name: 'login', component: LoginComponent, meta: { guest: true } },
    { path: '/register', name: 'register', component: RegisterComponent, meta: { guest: true } },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from) => {

    // Si la ruta actual requerie que no se este autenticado
    if (to.matched.some(record => record.meta.guest)) {

        // Si existe el item 'token' del localStorager siginifica que ya esta autentiado el usuario
        if (!localStorage.getItem('token')) {
            return true;
        }

        // Si ya esta autenticado redireccionamos el inicio
        return { path: '/' };
    }

    // Si la ruta acual requiere autenticacion
    if (to.matched.some(record => record.meta.requieresAuth)) {
        // Si el usuario esta autenticado significa que en el localStorage esta guardado el token del usuario
        if (localStorage.getItem('token')) {
            return true;
        }

        // Si no esta autenticado se manda al login
        return { path: '/login' };
    }
});

export default router;