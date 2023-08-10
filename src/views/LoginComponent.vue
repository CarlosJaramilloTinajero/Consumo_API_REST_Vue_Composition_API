<script setup>
import { required, email, sameAs } from '@vuelidate/validators';
import { useStore } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { ref } from 'vue';

import router from '../routes';
import { notify } from '../notify';

// Instancia de la tienda de Vuex
const store = useStore();

// Objeto con para el formulario
const credentials = ref({
    address: '',
    password: '',
});

// Reglas de validacion para el formulario
const rules = {
    address: { required, email },
    password: { required },
};

// Metodo para ejecutar el metodo $touch de un modelo de la instancia de Vuelidate
const touchModel = (event, model) => {
    if (event.target.value) {
        model.$touch();
    }
}

// instancia de Vuelidate para validar las propiedades reactivas del objeto user con las reglas de validacion
const v$ = useVuelidate(rules, credentials);

const submit = async () => {
    // Validamos el formulario
    const result = await v$.value.$validate();

    // Si esta bien el formulario
    if (result) {

        // Reseteamos la instancia de Vuelidate 
        v$.value.$reset();

        // Ejecutamos la accion de loginUser de la tienda de Vuex
        const data = await store.dispatch('loginUser', { email: credentials.value.address, password: credentials.value.password });

        if (!data) {
            return;
        }

        // Si el status de la data de la solicitud es true
        if (data.status) {
            // Mandamos al inicio
            router.push('/');
        } else {
            // Notificamos del error
            notify('Las credenciales proporcionadas son incorrectas. Por favor, verifica tu email y contraseña e inténtalo de nuevo.', 'error');
        }
    }

};

</script>

<template>
    <div class="container-form animation animation-left animation-1s animation-forwards">
        <form @submit.prevent="submit">
            <p class="title">Inicar sesion</p>
            <div class="form-floating mb-3">
                <input type="email" v-model="credentials.address" @focusout="touchModel($event, v$.address)"
                    class="form-control" :class="{ 'is-invalid': v$.address.$invalid && v$.address.$dirty }"
                    id="floatingInput">
                <label for="floatingInput">Email</label>
                <div class="invalid-feedback" v-if="v$.address.$invalid && v$.address.$dirty">
                    <p class="mb-0" v-if="v$.address.email.$invalid">Ese correo no es valido</p>
                    <p class="mb-0" v-if="v$.address.required.$invalid">El correo es requerido</p>
                </div>
            </div>

            <div class="form-floating mb-3">
                <input type="password" v-model="credentials.password" class="form-control"
                    @focusout="touchModel($event, v$.password)"
                    :class="{ 'is-invalid': v$.password.$invalid && v$.password.$dirty }" id="floatingInput">
                <label for="floatingInput">Contraseña</label>
                <div class="invalid-feedback" v-if="v$.password.$invalid && v$.password.$dirty">
                    <p class="mb-0" v-if="v$.password.required.$invalid">La conreaseña es requerida</p>
                </div>
            </div>
            <div class="d-flex justify-content-center mb-4">
                <button type="submit" class="btn btn-primary">Ingresar</button>
            </div>
        </form>
        <p class="text-inf">¿No tienes cuenta? <router-link to="/register">Registrate</router-link></p>
    </div>
</template>

<style scoped></style>
