import API from "./../components/APIs/AbstractAPIs";

class languageService {
    getLanguages() {
        return new Promise((resolve, reject) => {
            let nationalityAPI = new API();
            nationalityAPI.createEntity({
                name: "api/language?paginate=0"
            });
            nationalityAPI.endpoints
                .getAll()
                .then(({data}) => {
                    let theLanguages = data.map(function(item) {
                        return { id: item.id, name: item.name, acronym: item.acronym, text_direction:item.text_direction, is_default:item.is_default};
                    });
                    resolve(theLanguages);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }
}
export default languageService;
