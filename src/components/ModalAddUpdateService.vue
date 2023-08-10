<script setup>
import useVuelidate from '@vuelidate/core';
import { required, numeric } from '@vuelidate/validators';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { notify } from '../notify';

// Instancia de la tiende de Vuex
const store = useStore();

// Propiedad computada para guardar el objeto del modal de los servicios, el cual es un state del store
const service = computed(() => {
    return store.state.serviceModal;
});

// constante reactiva para saber si el boton submit es disable o no
const disabled = ref(false);

// Reglas de validacion del formulario
const rules = {
    name: { required },
    description: { required },
    price: { required, numeric },
};

// instancia de Vuelidate para validar las propiedades del objeto 'service' con las reglas de validacion
const v$ = useVuelidate(rules, service);

// Metodo para ejecutar el metodo $touch de un modelo de la instancia de Vuelidate
const touchModel = (e, model) => {
    if (e.target.value) {
        model.$touch();
    }
}

const submit = async (type) => {
    // Validamos el formulario
    const result = await v$.value.$validate();

    if (result) {

        // Reseteamos la instancia de Vuelidate 
        v$.value.$reset();
        disabled.value = true;

        switch (type) {
            case 'add':
                addService(service.value);
                break;
            case 'update':
                updateService(service.value);
                break;
        }
    }
};

// ***************************   Conexion a API con Axios Y Vuex   *********************************
const addService = async (service) => {

    // Obtenemos la data de la solicitud con el action del store
    const data = await store.dispatch('addService', service);

    if (!data) {
        return;
    }

    if (data.status) {
        notify('Servicio creado correctamente', 'success');
    } else {
        // Mesaje de error de la API con estatus 200
        notify(data.msg, 'error');
    }
    disabled.value = false;
};

const updateService = async (service) => {

    // Obtenemos la data de la solicitud con el action del store
    const data = await store.dispatch('updateService', service);

    if (!data) {
        return;
    }

    if (data && data.status) {
        console.log('actuaizado');
        notify('Servicio actualizado correctamente', 'success');
    } else {
        // Mensaje de error de la API con status 200
        notify(data.msg, 'error');
    }
    disabled.value = false;
};
// *************************************************************************************************

</script>

<template>
    <div class="modal fade" id="addUpdateModal" tabindex="-1" aria-labelledby="addUpdateModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" v-if="service">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="addUpdateModalLabel">
                        {{ service.type == 'add' ? 'Agregar un nuevo servicio' : 'Editar el servicio' + service.nameTitle }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="store.dispatch('initServiceModal')"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submit(service.type)">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control"
                                :class="{ 'is-invalid': v$.name.$dirty && v$.name.$invalid }" id="floatingInput"
                                v-model="service.name" @focusout="touchModel($event, v$.name)">
                            <label for="floatingInput">Nombre</label>
                            <div class="invalid-feedback" v-if="v$.name.$dirty && v$.name.$invalid">
                                <p v-if="v$.name.required.$invalid">El nombre es requerido</p>
                            </div>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control"
                                :class="{ 'is-invalid': v$.description.$dirty && v$.description.$invalid }"
                                @focusout="touchModel($event, v$.description)" id="floatingInput"
                                v-model="service.description">
                            <label for="floatingInput">Descripcion</label>
                            <div class="invalid-feedback" v-if="v$.description.$dirty && v$.description.$invalid">
                                <p v-if="v$.description.required.$invalid">La descripcion es requerida</p>
                            </div>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="number" step="0.001" class="form-control"
                                :class="{ 'is-invalid': v$.price.$dirty && v$.price.$invalid }"
                                @focusout="touchModel($event, v$.price)" id="floatingInput" v-model="service.price">
                            <label for="floatingInput">Precio</label>
                            <div class="invalid-feedback" v-if="v$.price.$dirty && v$.price.$invalid">
                                <p v-if="v$.price.required.$invalid">El precio es requerido</p>
                            </div>
                        </div>
                        <div class="d-flex justify-content-start">
                            <button type="submit" :disabled="disabled" class="btn btn-primary">{{ service.type == 'add' ?
                                'Agregar' :
                                'Actualizar'
                            }}</button>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        @click="initServiceModal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
