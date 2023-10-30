import axios from 'axios';
import { notify } from '../notify';

class connection {

    constructor(token = '') {
        // Endpoint base de la API
        // this.endpoint = 'http://127.0.0.1:8000/api';
        this.endpoint = 'https://api.carlosjaramillo.beauty/api/';
        this.token = token;

        // Creamos la instancia de la clase axios con las cinfiguraciones que se van a utilizar en todos los endpoints y la guardo
        // en la constante 'axiosCon'
        this.axiosCon = axios.create({
            baseURL: this.endpoint,
            headers: {
                Accept: 'application/json',
            }
        });

    }

    // Setter para el token
    setToken(token) {
        this.token = token;
    }

    // Creacion de metodo asincrono para recibir los datos de la api usando la instancia de axios creada anteriormente
    async loadData(method = 'get', uri = '', data = {}, errorResponse = false, token = true) {
        try {

            // si el parametro token es 'true' se va agregar el token en los encabezados de la solicitud 
            const header = !token ? {} : {
                Authorization: 'Bearer ' + this.token
            };

            // Retornamos la respuesta de la api usando una promesa
            return await this.axiosCon({
                headers: header,
                method: method,
                url: uri,
                data: data
            });
        } catch (error) {
            // Si el estatus de la respuesta de la solicitud es 401 retornamos la respuesta
            if (error.response && (error.response.status == 401 || error.response.status == 400) && errorResponse) {
                return error.response;
            }

            // Si hay un error de conexion con la API
            console.log(error);
            notify('¡Error al obtener los datos del servidor!', 'error');
        }
    }
}

export { connection };