import API from "../components/APIs/AbstractAPIs";

class categoriesService {
    getCategories() {
        return new Promise((resolve, reject) => {
            let categoryAPI = new API();
            categoryAPI.createEntity({
                name: "/api/service-category"
            });
            categoryAPI.endpoints
                .getAll()
                .then(({data}) => {
                    var _categories = data.entities;
                    var _parentsCatagories = _categories
                        .filter(obj => obj.parent_id == null)
                        .map(function (elem) {
                            return {
                                id: elem.id,
                                label: elem.name,
                                icon: elem.icon,
                                children: []
                            };
                        });
                    _parentsCatagories.forEach(function (parent) {
                        _categories
                            .filter(elem => elem.parent_id === parent.id)
                            .forEach(function (obj) {
                                parent.children.push({
                                    id: obj.id,
                                    label: obj.name,
                                });
                            });
                    });
                    resolve(_parentsCatagories);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }


    getAllCategories() {
        return new Promise((resolve, reject) => {
            let categoryAPI = new API();
            categoryAPI.createEntity({
                name: "/api/service-category?paginate=0&sorting[name]=asc&with[]=translations"
            });
            categoryAPI.endpoints
                .getAll()
                .then(({data}) => {

                    var _categories = data;
                    var _parentsCatagories = _categories
                        .filter(obj => obj.parent_id == null)
                        .map(function (elem) {
                            return {
                                id: elem.id,
                                label: elem.name,
                                icon: elem.icon,
                                translations:elem.translations
                                // children: []
                            };
                        });
                    _parentsCatagories.forEach(function (parent) {
                        _categories
                            .filter(elem => elem.parent_id === parent.id)
                            .forEach(function (obj) {
                                if (typeof parent.children == "undefined") {
                                    parent.children = [];
                                }
                                parent.children.push({
                                    id: obj.id,
                                    label: obj.name,
                                    translations: obj.translations
                                });
                            });
                    });

                    resolve(_parentsCatagories);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }

    getCategory(catId) {
        return new Promise((resolve, reject) => {
            let categoryAPI = new API();
            categoryAPI.createEntity({
                name: "/api/service-category/"+catId+"?with[]=children&with[]=translations"
            });
            categoryAPI.endpoints
                .getAll()
                .then(({data}) => {
                    resolve(data);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }

    getHashTag(hashtagId) {
        return new Promise((resolve, reject) => {
            let HashtagAPI = new API();
            HashtagAPI.createEntity({
                name: "/api/hashtag/"+hashtagId
            });
            HashtagAPI.endpoints
                .getAll()
                .then(({data}) => {
                    resolve(data);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }


    getHashTag(hashtag) {

        return new Promise((resolve, reject) => {
            let HashtagAPI = new API();

            HashtagAPI.createEntity({
                name: "/api/hashtag/filter?"
            });

            var data = {
                "conditions": {
                    "hashtag:equal": hashtag
                },
            };

            HashtagAPI.endpoints
                .post(data)
                .then(({data}) => {
                    resolve(data);
                })
                .catch(function (e) {
                    reject(e);
                });
        });

    }
}

export default categoriesService;
