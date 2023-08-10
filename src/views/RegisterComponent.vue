<script setup>
import router from '../routes';
import { notify } from '../notify';
import { ref, computed } from 'vue';
import { required, email, sameAs, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useStore } from 'vuex';

// Instancia de la tienda de vuex 
const store = useStore();

// Objeto para el formulario
const user = ref({
    name: '',
    address: '',
    password: '',
    confirmPassword: '',
});

// Propiedad computada para guardar la contraseña ingresada en la propiedad password del objeto user
const passwordUser = computed(() => user.value.password);

// Reglas de validacion del formulario
const rules = {
    name: { required },
    address: { required, email },
    password: { required, minLength: minLength(8) },
    confirmPassword: { required, sameAsPassword: sameAs(passwordUser) }
};

// instancia de Vuelidate para validar las propiedades reactivas del objeto user con las reglas de validacion
const v$ = useVuelidate(rules, user);

// Metodo para ejecutar el metodo $touch de un modelo de la instancia de Vuelidate
const touchModel = (event, model) => {
    if (event.target.value) {
        model.$touch();
    }
};

const submit = async () => {
    // Validamos el formulario
    const validate = await v$.value.$validate();

    if (validate) {

        let data = {
            name: user.value.name,
            email: user.value.address,
            password: user.value.password,
        };

        // Usamos el action 'registerAndLogin' del store, el cual retorna la respuesta de la solicitud y
        // obtiene y guarda el token obtenido con el registro y lo guarda en el state userToken
        const result = await store.dispatch('registerAndLogin', data);

        if (!result) {
            return;
        }

        // Si el status de la respuesta es verdadero redireccionamos al inicio
        if (result.status) {
            router.push('/');
        } else {
            notify(result.msg, 'error');
        }
    }
};

</script>

<template>
    <div class="container-form animation animation-left animation-1s animation-forwards">
        <form @submit.prevent="submit">
            <p class="title">Registro</p>

            <div class="form-floating mb-3">
                <input type="text" v-model="user.name" class="form-control" @focusout="touchModel($event, v$.name)"
                    :class="{ 'is-invalid': v$.name.$invalid && v$.name.$dirty }" id="floatingInput">
                <label for="floatingInput">Nombre</label>
                <div class="invalid-feedback" v-if="v$.name.$invalid && v$.name.$dirty">
                    <p class="mb-0" v-if="v$.name.required.$invalid">El nombre es requerido</p>
                </div>
            </div>

            <div class="form-floating mb-3">
                <input type="email" v-model="user.address" class="form-control" @focusout="touchModel($event, v$.address)"
                    :class="{ 'is-invalid': v$.address.$invalid && v$.address.$dirty }" id="floatingInput">
                <label for="floatingInput">Email</label>
                <div class="invalid-feedback" v-if="v$.address.$invalid && v$.address.$dirty">
                    <p class="mb-0" v-if="v$.address.required.$invalid">El correo es requerido</p>
                    <p class="mb-0" v-if="v$.address.email.$invalid">El correo no es valido</p>
                </div>
            </div>

            <div class="form-floating mb-3">
                <input type="password" v-model="user.password" @focusout="touchModel($event, v$.password)"
                    :class="{ 'is-invalid': v$.password.$invalid && v$.password.$dirty }" class="form-control"
                    id="floatingInput">
                <label for="floatingInput">Contraseña</label>
                <div class="invalid-feedback" v-if="v$.password.$invalid && v$.password.$dirty">
                    <p class="mb-0" v-if="v$.password.required.$invalid">La contraseña es requerida</p>
                    <p class="mb-o" v-if="v$.password.minLength.$invalid">La contraseña debe tener minimo 8 caracteres</p>
                </div>
            </div>

            <div class="form-floating mb-3">
                <input type="password" class="form-control" @focusout="touchModel($event, v$.confirmPassword)"
                    :class="{ 'is-invalid': v$.confirmPassword.$invalid && v$.confirmPassword.$dirty }"
                    v-model="user.confirmPassword" id="floatingInput">
                <label for="floatingInput">Confirmar contraseña</label>
                <div class="invalid-feedback" v-if="v$.confirmPassword.$invalid && v$.confirmPassword.$dirty">
                    <p class="mb-0" v-if="v$.confirmPassword.required.$invalid">La confirmacion es requerida</p>
                    <p class="mb-0" v-if="v$.confirmPassword.sameAsPassword.$invalid">La confirmacion debe ser la misma que
                        la
                        contraseña</p>
                </div>
            </div>
            <div class="d-flex justify-content-center mb-4">
                <button type="submit" class="btn btn-primary">Registrar</button>
            </div>
        </form>
        <p class="text-inf">¿Ya tienes cuenta? <router-link to="/login">Inicia sesion</router-link></p>
    </div>
</template>

<style scoped></style>
