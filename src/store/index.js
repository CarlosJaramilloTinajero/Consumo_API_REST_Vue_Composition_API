import { createStore } from "vuex";

// Clase que funciona para hacer las solicitudes a la API
import { connection } from "../conectionApi";

const store = createStore({
    state: {
        clients: null,
        services: null,
        tokenUser: localStorage.getItem('token'),
        connectionService: new connection(localStorage.getItem('token')),
        clientModal: {
            id: '',
            name: '',
            nameTitle: '',
            email: '',
            phone: '',
            address: '',
            type: 'add',
            services: []
        },
        serviceModal: {
            id: '',
            name: '',
            nameTitle: '',
            description: '',
            price: '',
            type: 'add',
            clients: []
        },
    },
    mutations: {
        setClients(state, payload) {
            state.clients = payload;
        },
        setServices(state, payload) {
            state.services = payload;
        },
        setClientModal(state, payload) {
            state.clientModal = payload;
        },
        setServiceModal(state, payload) {
            state.serviceModal = payload;
        },
        setTokenUser(state, payload) {
            state.tokenUser = payload
        },
        setTokenConnection(state, payload) {
            state.connectionService.setToken(payload);
        }
    },
    actions: {
        // Iniciar el objeto para el modal de los clientes
        initClientModal({ commit }) {
            commit('setClientModal', {
                id: '',
                name: '',
                nameTitle: '',
                email: '',
                phone: '',
                address: '',
                type: 'add',
                services: []
            });
        },

        // Iniciar el objeto para el modal de los servicios
        initServiceModal({ commit }) {
            commit('setServiceModal', {
                id: '',
                name: '',
                nameTitle: '',
                description: '',
                price: '',
                type: 'add',
                clients: []
            });
        },

        // Accion para obtener los clientes y servicios de la API
        getClientsAndService({ dispatch }) {
            dispatch('getClients');
            dispatch('getServices');
        },

        // ***********************************   Autenticacion   *************************************

        // Solicitud a la API para logear al usuario y guardar el token en localStorage y cambiar el state del token del
        // usuario.
        async loginUser({ commit, state }, credentials) {
            try {
                const { data } = await state.connectionService.loadData('post', '/login', credentials, true, false);

                if (data && data.status) {
                    localStorage.setItem('token', data.access_token);
                    commit('setTokenUser', data.access_token);
                    commit('setTokenConnection', state.tokenUser);
                }

                return await data;
            } catch (error) {
                console.log(error);
            }

        },

        // Cerrar sesion y borrar el item del localStorage donde se guarda el 'token', como tambien del state 'tokenUSer' y de
        // la propiedad de la instancia de la clase connection 'setTokenConnection'
        logout({ commit, state }) {
            if (state.tokenUser) {
                localStorage.removeItem('token');
                commit('setTokenUser', null);
                commit('setTokenConnection', null);
                return true;
            }
            return false;
        },

        // Registro de usuario con una solicitud de tipo POST a la API e inicio de sesion guardando el 'token', en el 
        // 'localStorage' y en los states 'tokenUser' y en la propiedad de la clase connection 'setTokenConnection'.
        async registerAndLogin({ commit, state }, user) {
            try {
                const { data } = await state.connectionService.loadData('post', '/register', user, true, false);
                if (data && data.status) {
                    commit('setTokenUser', data.access_token);
                    localStorage.setItem('token', data.access_token);
                    commit('setTokenConnection', state.tokenUser);
                }
                return await data;
            } catch (error) {
                console.log(error);
            }
        },

        // ***********************************   Clients   *************************************

        // Obtenemos los clientes de la API y los guardamos con la mutacion 'setClients'
        async getClients({ commit, state }) {
            try {
                const { data } = await state.connectionService.loadData('get', '/clients', [], false, true);
                if (data && data.status) {
                    commit('setClients', data.clients)
                }
            } catch (error) {
                console.log(error);
            }
        },

        // Accion para eliminar un cliente y recargar los states de 'clients' y 'services'
        async deleteClient({ dispatch, state }, client) {
            try {
                const { data } = await state.connectionService.loadData('delete', '/client/' + client.id, [], false, true);
                if (data && data.status) {
                    dispatch('getClientsAndService');
                }
                return await data;
            } catch (error) {
                console.log(error);
            }
        },

        // Accion para agregar un nuevo cliente y recargar los states de 'clients' y 'services'
        async addClient({ dispatch, state }, client) {
            try {
                const { data } = await state.connectionService.loadData('post', '/client', client, false, true);
                if (data && data.status) {
                    dispatch('getClientsAndService');
                    dispatch('initClientModal');
                }
                return await data;

            } catch (error) {
                console.log(error);
            }
        },

        // Accion para actualizar un nuevo cliente y recargar los states de 'clients' y 'services'
        async updateClient({ dispatch, state }, client) {
            try {
                const { data } = await state.connectionService.loadData('put', '/client/' + client.id, client, false, true);
                if (data && data.status) {
                    dispatch('getClientsAndService');
                }
                return await data;
            } catch (error) {
                console.log(error);
            }
        },

        // ***********************************   Servicios   *************************************

        // Obtenemos los servicios de la API y los guardamos en el state 'services' con la mutacion 'setServices'
        async getServices({ commit, state }) {
            try {
                const { data } = await state.connectionService.loadData('get', '/service', [], false, true);
                if (data && data.status) {
                    commit('setServices', data.service);
                }
            } catch (error) {
                console.log(error);
            }
        },

        // Accion para eliminar un servicio y recargar los states de 'clients' y 'services'
        async deleteService({ dispatch, state }, service) {
            try {
                const { data } = await state.connectionService.loadData('delete', '/service/' + service.id, [], false, true);
                if (data && data.status) {
                    dispatch('getClientsAndService');
                }
                return await data;
            } catch (error) {
                console.log(error);
            }
        },

        // Accion para agregar un servicio y recargar los states de 'clients' y 'services'
        async addService({ dispatch, state }, service) {
            try {
                const { data } = await state.connectionService.loadData('post', '/service', service, false, true);
                if (data && data.status) {
                    dispatch('getClientsAndService');
                    dispatch('initServiceModal');
                }
                return await data;
            } catch (error) {
                console.log(error);
            }
        },

        // Accion para actualizar un servicio y recargar los states de 'clients' y 'services'
        async updateService({ dispatch, state }, service) {
            try {
                const { data } = await state.connectionService.loadData('put', '/service/' + service.id, service, false, true);
                if (data && data.status) {
                    dispatch('getClientsAndService');
                }
                return await data;
            } catch (error) {
                console.log(error);
            }
        }
    },
    getters: {

    },
    modules: {

    }
});

export default store;