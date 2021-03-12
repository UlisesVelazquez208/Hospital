import Env from '../../Env';


const axios = require('axios');

class API {
    constructor() {
        this.url = Env.API_URL;
        this.endpoints = {};
        this.axios = axios.create({
            baseURL: this.url,
            headers: { 'Accept': 'application/json', 'Authorization': this.getToken() }
        });
    }

    getToken() {
        if (!localStorage.getItem("token_type") || !localStorage.getItem("access_token")) {
            return '';
        }
        return localStorage.getItem("token_type") + ' ' + localStorage.getItem("access_token");
    }

    refreshAuthHeader()
    {
        this.axios = axios.create({
            baseURL: this.url,
            headers: { 'Accept': 'application/json', 'Authorization': this.getToken() }
        });
    }

    /**
     * Create and store a single entity's endpoints
     * @param {A entity Object} entity
     */
    createEntity(entity) {
        this.endpoints = this.createBasicCRUDEndpoints(entity)
    }

    createEntities(arrayOfEntity) {
        arrayOfEntity.forEach(this.createEntity.bind(this))
    }

    /**
     * Create the basic endpoints handlers for CRUD operations
     * @param {A entity Object} entity
     */
    createBasicCRUDEndpoints({ name }) {
        var endpoints = {};

        const resourceURL = `${this.url}/${name}`;

        endpoints.get = (data) => this.axios.get(resourceURL, data);

        endpoints.getAll = ({ query } = {}) => this.axios.get(resourceURL, { params: { query } });

        endpoints.post = (data) => this.axios.post(resourceURL, data);

        endpoints.getOne = ({ id, query }) => this.axios.get(`${resourceURL}/${id}${query}`);

        endpoints.create = (toCreate) => this.axios.post(resourceURL, toCreate);

        endpoints.update = (toUpdate) => this.axios.put(`${resourceURL}/${toUpdate.id}`, toUpdate);

        endpoints.patch = ({ id }, toPatch) => axios.patch(`${resourceURL}/${id}`, toPatch);

        endpoints.delete = ({ id }) => this.axios.delete(`${resourceURL}/${id}`);

        endpoints.auth = (param) => this.axios.post(resourceURL, param);

        endpoints.logout = (param) => this.axios.get(resourceURL, param);

        endpoints.forgetpassword = (param) => this.axios.post(resourceURL, param);

        endpoints.resetpassword = (param) => this.axios.post(resourceURL, param);

        return endpoints
    }

}

export default API;
