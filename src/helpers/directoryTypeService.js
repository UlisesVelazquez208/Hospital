import API from "./../components/APIs/AbstractAPIs";

class typesService {
    getDirectoryTypes() {
        return new Promise((resolve, reject) => {
            let typeAPI = new API();
            typeAPI.createEntity({
                name: "/api/directory-type?paginate=0"
            });
            typeAPI.endpoints
                .getAll()
                .then(({data}) => {
                    resolve(data);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }
}
export default typesService;