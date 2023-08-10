<script setup>
import { ref, computed, onMounted } from "vue";
import { notify } from "../notify";

import ModalAddUpdateClient from "./ModalAddUpdateClient.vue";

import { useStore } from "vuex";

const store = useStore();

// Obtenemos los clientes y servicios por la API usando los actions de vuex para guardar la informacion de la API
// en los states del store 'services' y 'clients'
onMounted(() => {
  if (!store.state.clients) {
    store.dispatch('getClients');
  }

  if (!store.state.services) {
    store.dispatch('getServices');
  }
});

// Guardamos la informacion de los states 'clients y services' de la tienda de vuex en una propiedad computada
const clients = computed(() => {
  return store.state.clients;
});

const services = computed(() => {
  return store.state.services;
});

// El deepClone es para copiar un objeto por valor y no por referencia en memoria
// ya que primero se crea un json (JSON.stringify) del objeto a copiar y luego se vuelve a convertir en objeto
// con el metodo JSON.parse
const deepClone = (object) => {
  return JSON.parse(JSON.stringify(object));
};

let userModal = ref({
  type: 'add',
  id: 0,
  name: '',
  email: '',
  phone: '',
  address: '',
  services: []
});

const initUserModal = () => {
  store.dispatch('initClientModal');
  userModal.value = {
    type: 'add',
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
    services: []
  };
};

const putClientModal = (client) => {
  if (client) {
    store.commit('setClientModal', client);
  }
};

// ***************************   Conexion a API con Axios Y Vuex   *********************************

const deleteClient = async (client) => {
  const data = await store.dispatch('deleteClient', client);
  if (data && data.status) {
    console.log('eliminado');
    notify('¡Cliente eliminado correctamente!', 'success');
  }
};

// *************************************************************************************************

</script>

<template>
  <div class="d-flex justify-content-end">
    <button class="btn btn-sm btn-primary" data-bs-toggle="modal" @click="() => {
      initUserModal();
      putClientModal(userModal)
    }" data-bs-target="#addUpdateModal">Agregar</button>
  </div>
  <div class="loanding-data-container loanding-data mt-4" v-if="!clients"></div>
  <div class="container-responsive mt-3">
    <table class="table table-sm table-striped" v-if="clients">
      <thead>
        <tr>
          <th>#</th>
          <th>NOMRBE</th>
          <th>EMAIL</th>
          <th>TELEFONO</th>
          <th>DIRECCION</th>
          <th>SERVICIOS</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(client, index) in   clients  " :key="client.id">
          <td>{{ index + 1 }}</td>
          <td>{{ client.name }}</td>
          <td>{{ client.email }}</td>
          <td>{{ client.phone }}</td>
          <td>{{ client.address }}</td>
          <td>{{ client.services.length }}</td>
          <td>
            <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              Acciones
            </button>
            <ul class="dropdown-menu">
              <li><button @click="() => {
                userModal = deepClone(client);
                let services = client.services.map((value) => { return value.name });
                userModal.services = services.join(', ');
              }" data-bs-toggle="modal" data-bs-target="#viewModal" class="dropdown-item">Ver</button></li>
              <li><button class="dropdown-item" data-bs-toggle="modal" @click="() => {
                initUserModal();
                userModal = deepClone(client);
                userModal.type = 'update';
                userModal.services = userModal.services.map(element => element.id);
                userModal.nameTitle = client.name;
                putClientModal(userModal);
              }" data-bs-target="#addUpdateModal">Editar</button></li>
              <li><button class="dropdown-item" data-bs-toggle="modal" @click="userModal = deepClone(client)"
                  data-bs-target="#deleteModal">Eliminar</button></li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal view client -->
  <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="viewModalLabel" v-if="userModal">Ver el cliente {{ userModal.name }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="userModal">

            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="floatingInput" readonly :value="userModal.name">
              <label for="floatingInput">Nombre</label>
            </div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="floatingInput" readonly :value="userModal.email">
              <label for="floatingInput">Correo</label>
            </div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="floatingInput" readonly :value="userModal.phone">
              <label for="floatingInput">Telefono</label>
            </div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="floatingInput" readonly :value="userModal.address">
              <label for="floatingInput">Direccion</label>
            </div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="floatingInput" readonly :value="userModal.services">
              <label for="floatingInput">Servicios</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- End view client -->

  <!-- Modal delete client -->
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="deleteModalLabel" v-if="userModal">Eliminar el cliente {{ userModal.name }}
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="userModal">
            <p class="text-danger-modal">¿Esta seguro de eliminar a este cliente?</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-danger" @click="deleteClient(userModal)"
            data-bs-dismiss="modal">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- End delete client -->

  <!-- Modal add/update client -->
  <ModalAddUpdateClient></ModalAddUpdateClient>
  <!-- End add/update client -->
</template>

<style scoped></style>
