import API from "../components/APIs/AbstractAPIs";

Object.defineProperty(Array.prototype, 'group', {
    enumerable: false,
    value: function (key) {
        var map = {};
        this.forEach(function (e) {
            var k = key(e);
            map[k] = map[k] || [];
            map[k].push({
                id: e.id,
                label: e.country
            });
        });
        return Object.keys(map).map(function (k) {
            return {id: k, label: k,  children: map[k]};
        });
    }
});

class countriesService {
    getCountries() {
        return new Promise((resolve, reject) => {
            let countryAPI = new API();
            countryAPI.createEntity({
                name: "api/country?paginate=0"
            });
            countryAPI.endpoints
                .getAll()
                .then(({data}) => {
                    const _nationality = data;
                    let _parentsCountries = [];
                    _parentsCountries = _nationality.group(function (item) {
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
export default countriesService;
