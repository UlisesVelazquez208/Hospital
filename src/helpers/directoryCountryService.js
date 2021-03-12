import API from "./../components/APIs/AbstractAPIs";

class directoryCountryService {
    getDirectoryCountries(isGroup = true) {
        return new Promise((resolve, reject) => {
            let typeAPI = new API();
            typeAPI.createEntity({
                name: "/api/directory-country?paginate=0&sorting[country]=asc"
            });
            typeAPI.endpoints
                .getAll()
                .then(({data}) => {
                    if(isGroup) {
                        const _nationality = data;
                        let _parentsCountries = [];
                        _parentsCountries = _nationality.group(function (item) {
                            return item.continent;
                        });

                        resolve(_parentsCountries);
                    }
                    resolve(data);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }
}
export default directoryCountryService;