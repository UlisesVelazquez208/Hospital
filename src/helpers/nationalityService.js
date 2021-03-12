import API from "../components/APIs/AbstractAPIs";

Object.defineProperty(Array.prototype, 'group_nationality', {
    enumerable: false,
    value: function (key) {
        var map = {};
        this.forEach(function (e) {
            var k = key(e);
            map[k] = map[k] || [];
            map[k].push({
                id: e.id,
                label: e.nationality
            });
        });
        return Object.keys(map).map(function (k) {
            return {id: k, label: k,  children: map[k]};
        });
    }
});

class nationalityService {
    getNationalities() {
        return new Promise((resolve, reject) => {
            let nationalityAPI = new API();
            nationalityAPI.createEntity({
                name: "api/nationality?paginate=0"
            });
            nationalityAPI.endpoints
                .getAll()
                .then(({data}) => {
                    const _nationality = data;
                    let _parentsCountries = [];
                    _parentsCountries = _nationality.group_nationality(function (item) {
                        return item.continent;
                    });
                    resolve(_parentsCountries);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }
}
export default nationalityService;
