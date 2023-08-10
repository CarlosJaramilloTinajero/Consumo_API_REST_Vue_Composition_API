<script setup>
import { useStore } from 'vuex';
import { computed, ref, onMounted } from 'vue';
import { notify } from '../notify';
import ModalAddUpdateService from './ModalAddUpdateService.vue';

// Instancia del store de Vuex
const store = useStore();

// Si el state 'services' del store de Vuex es nullo, cargamos el state usando el 'dispatch' del store, el cual ejecuta la
// accion 'getServices'
onMounted(() => {
    if (!store.state.services) {
        store.dispatch('getServices');
    }
});

// Propiedad computada para guardar el state 'services' del store de vuex
const services = computed(() => {
    return store.state.services;
});

const serviceModal = ref({
    id: '',
    name: '',
    nameTitle: '',
    description: '',
    price: '',
    type: 'add',
    clients: []
});

const initServiceModal = () => {
    serviceModal.value = {
        id: '',
        name: '',
        nameTitle: '',
        description: '',
        price: '',
        type: 'add',
        clients: []
    };
};

const deepClone = (object) => {
    return JSON.parse(JSON.stringify(object));
};

// Funcion para eliminar un servicio usado el action 'deleteService' del store de vuex
const deleteService = async (service) => {
    if (!service.id) {
        notify('Error al borra el servcio', 'error');
        return;
    }

    const data = await store.dispatch('deleteService', service);
    if (data && data.status) {
        console.log('eliminado');
        notify('Servicio eliminado correctamente', 'success');
    }
};

// Funcion para actuaizar un servicio usado el action 'deleteService' del store de vuex
const putServicesModal = (service) => {
    store.dispatch('initServiceModal');
    if (service) {
        store.commit('setServiceModal', deepClone(service))
    }
};

</script>

<template>
    <div class="mt-2 d-flex justify-content-end">
        <button class="btn btn-primary btn-sm" @click="putServicesModal(null)" data-bs-toggle="modal"
            data-bs-target="#addUpdateModal">Agregar</button>
    </div>
    <div class="loanding-data-container loanding-data mt-4" v-if="!services"></div>
    <div class="container-responsive mt-3">
        <table class="table table-sm table-striped" v-if="services">
            <thead>
                <tr>
                    <th>#</th>
                    <th>NOMBRE</th>
                    <th>DESCRIPCION</th>
                    <th>PRECIO</th>
                    <th>CLIENTES</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(service, index) in services" :key="service.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ service.name }}</td>
                    <td>{{ service.description }}</td>
                    <td>{{ service.price }}</td>
                    <td>{{ service.clients.length }}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Acciones
                        </button>
                        <ul class="dropdown-menu">
                            <li class="dropdown-item" @click="() => {
                                initServiceModal();
                                serviceModal = deepClone(service);
                                serviceModal.clients = service.clients.map(value => value.name).join(', ');
                            }" data-bs-toggle="modal" data-bs-target="#viewModal">Ver</li>
                            <li data-bs-toggle="modal" data-bs-target="#addUpdateModal" class="dropdown-item" @click="() => {
                                serviceModal = deepClone(service);
                                serviceModal.type = 'update';
                                serviceModal.nameTitle = service.name;
                                putServicesModal(serviceModal);
                                initServiceModal();
                            }">Editar</li>
                            <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="() => {
                                initServiceModal();
                                serviceModal = deepClone(service);
                            }">
                                Eliminar</li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Modal view client -->
    <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" v-if="serviceModal">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="viewModalLabel">Ver el servicio {{ serviceModal.name }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="initServiceModal"></button>
                </div>
                <div class="modal-body">

                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="floatingInput" readonly :value="serviceModal.name">
                        <label for="floatingInput">Nombre</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="floatingInput" readonly
                            :value="serviceModal.description">
                        <label for="floatingInput">Descripcion</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="floatingInput" readonly :value="serviceModal.price">
                        <label for="floatingInput">Precio</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="floatingInput" readonly :value="serviceModal.clients">
                        <label for="floatingInput">Clientes</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        @click="initServiceModal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- End view client -->

    <!-- Modal delete client -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" v-if="serviceModal">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteModalLabel">Eliminar el servicio {{
                        serviceModal.name }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div>
                        <p class="text-danger-modal">¿Esta seguro de eliminar a este servicio?</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-danger" @click="deleteService(serviceModal)"
                        data-bs-dismiss="modal">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- End delete client -->

    <!-- Update add Modal -->
    <ModalAddUpdateService></ModalAddUpdateService>
    <!-- End add update Modal -->
</template>

<style scoped></style>
