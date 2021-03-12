import API from "./../components/APIs/AbstractAPIs";

class directoryMediaService {
    getDirectoryMedia() {
        return new Promise((resolve, reject) => {
            let typeAPI = new API();
            typeAPI.createEntity({
                name: "/api/directory-media?paginate=0&sorting[title]=asc"
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

    deleteDirectoryMedia(id) {
        return new Promise((resolve, reject) => {
            let typeAPI = new API();
            typeAPI.createEntity({
                name: "/api/directory-media"
            });
            typeAPI.endpoints
                .delete({id})
                .then(({data}) => {
                    resolve(data);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }
}
export default directoryMediaService;