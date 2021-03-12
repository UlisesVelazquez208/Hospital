import API from "../../APIs/AbstractAPIs";

class coreForm {

    getData(id, module, success, failure, query="") {
        success = success || function (data) {
            return data;
        };

        failure = failure || function (error) {

        };

        let APIs = new API();
        APIs.createEntity({name: 'api/' + module});
        APIs.endpoints.getOne({
            'id': id,
            'query': query
        }).then(success).catch(failure);
    }

    deleteItem(id, module, success, failure) {

        success = success || function (data) {
            return data;
        };

        failure = failure || function (error) {

        };

        let APIs = new API();
        APIs.createEntity({name: 'api/' + module});
        APIs.endpoints.delete({'id': id}).then(success).catch(failure);
    }
}

let coreFormClass = new coreForm;

export default coreFormClass;