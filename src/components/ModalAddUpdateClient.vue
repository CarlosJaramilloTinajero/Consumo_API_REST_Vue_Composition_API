<script setup>
import { computed, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, email, minLength, maxLength, numeric } from '@vuelidate/validators';
import { useStore } from 'vuex';
import { notify } from '../notify';

// Instancia del store de Vuex
const store = useStore();

// Propiedad computada para guardar el state 'services' del store de Vuex
const services = computed(() => {
  return store.state.services;
})

// Propiedad computada para guardar el state 'services' del store de Vuex
const client = computed(() => {
  return store.state.clientModal;
})

// constante reactiva para saber si el boton submit es disable o no
const disabled = ref(false);

// Reglas de validacion para el formulario
const rules = {
  name: { required },
  email: { required, email },
  address: { required, minLength: minLength(10) },
  phone: {
    required,
    minLength: minLength(10),
    maxLength: maxLength(10),
    numeric
  },
};

// Creamos la instancia de Vuelidate con las rules y el objeto de client
const v$ = useVuelidate(rules, client);

// Para poder mostrar los errores por primera vez se usa el metodo '$touch()', este metodo pone la propiedad
// $dirty en verdadero, esto es para saber si el input ya fue usado para poder mostrar el mensaje de error
// este metodo se utilizara en el evento '@focusout' del v-on del input.
const touchModel = (e, model) => {
  if (e.target.value) {
    model.$touch();
  }
};

const submit = async (type = 'add') => {
  // el metodo 'validate()' de vuelidate verifica que todas los models cumplan con la reglas de cada una, si no es asi
  // retorna un false, si todas estan bien retorna un true, si hay algun error en un model, se guarda el error en el
  // model de vuelidate.
  const result = await v$.value.$validate();

  if (result) {
    // Acciones a hacer cuando se valide el formulario
    v$.value.$reset();
    disabled.value = true;

    switch (type) {
      case 'add':
        addClient(client.value);
        break;
      case 'update':
        updateClient(client.value);
        break;
    }
  }

};

// ***************************   Conexion a API con Axios Y Vuex   *********************************
const addClient = async (client) => {
  const data = await store.dispatch('addClient', client);
  if (!data) {
    return;
  }
  if (data.status) {
    console.log('creado');
    notify('¡Cliente creado correctamente!', 'success');
  } else {
    console.log(data);
    // Mesaje de error de la API con estatus 200
    notify(data.msg, 'error');
  }
  disabled.value = false;
};

const updateClient = async (client) => {
  if (!client.id) {
    notify('¡Error al actualizar al usuario!', 'error');
    return;
  }

  const data = await store.dispatch('updateClient', client);

  if (!data) {
    return;
  }

  if (data.status) {
    notify('¡Cliente ' + data.client.name + ' actualizado correctamente!', 'success');
  } else {
    // Mesaje de error de la API con estatus 200
    notify(data.msg, 'error');
  }
  disabled.value = false;
};
// *************************************************************************************************

</script>

<template>
  <div class="modal fade" id="addUpdateModal" tabindex="-1" aria-labelledby="addUpdateModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content" v-if="client">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addUpdateModalLabel">
            {{ client.type == 'add' ? 'Agregar un nuevo cliente' : 'Modificar el cliente ' + client.nameTitle }}
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form v-on:submit.prevent="submit(client.type)">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" :class="{ 'is-invalid': v$.name.$dirty && v$.name.$invalid }"
                id="floatingInput" v-model="client.name" @focusin="touchModel($event, v$.name)">
              <label for="floatingInput">Nombre</label>
              <!-- Mensajes de error para el input -->
              <div class="invalid-feedback" v-if="v$.name.$dirty && v$.name.$invalid">
                <p class="mb-0" v-if="v$.name.required.$invalid">El nombre es requerido</p>
              </div>
            </div>

            <div class="form-floating mb-3">
              <input type="email" class="form-control" :class="{ 'is-invalid': v$.email.$dirty && v$.email.$invalid }"
                id="floatingInput" v-model="client.email" @focusout="touchModel($event, v$.email)">
              <label for="floatingInput">Email</label>
              <div class="invalid-feedback" v-if="v$.email.$dirty && v$.email.$invalid">
                <p class="mb-0" v-if="v$.email.email.$invalid">Este email es incorrecto</p>
                <p class="mb-0" v-if="v$.email.required.$invalid">El email es requerido</p>
              </div>
            </div>

            <div class="form-floating mb-3">
              <input type="number" class="form-control" :class="{ 'is-invalid': v$.phone.$dirty && v$.phone.$invalid }"
                id="floatingInput" v-model="client.phone" @focusout="touchModel($event, v$.phone)">
              <label for="floatingInput">Telefono</label>
              <div class="invalid-feedback" v-if="v$.phone.$dirty && v$.phone.$invalid">
                <p class="mb-0" v-if="v$.phone.minLength.$invalid || v$.phone.maxLength.$invalid">El telefono debe
                  contener 10
                  numeros</p>
                <p class="mb-0" v-if="v$.phone.required.$invalid">El telefono es requerido</p>
              </div>
            </div>

            <div class="form-floating mb-3">
              <input type="text" class="form-control" :class="{ 'is-invalid': v$.address.$dirty && v$.address.$invalid }"
                id="floatingInput" v-model="client.address" @focusout="touchModel($event, v$.address)">
              <label for="floatingInput">Direccion</label>
              <div class="invalid-feedback" v-if="v$.address.$dirty && v$.address.$invalid">
                <p class="mb-0" v-if="v$.address.minLength.$invalid">La direccion debe contener almenos 10
                  caracteres</p>
                <p class="mb-0" v-if="v$.address.required.$invalid">La direccion es requerida</p>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Servicios</label>
              <select name="" multiple class="form-control" v-model="client.services">
                <option v-for="  service   in   services  " :key="service.id" :value="service.id">{{ service.name }}
                </option>
              </select>
            </div>

            <div class="d-flex justify-content-start">
              <button type="submit" :disabled="disabled" class="btn btn-primary">{{ client.type
                == 'add' ? 'Agregar' : 'Actualizar' }}</button>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
