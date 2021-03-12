import API from "../components/APIs/AbstractAPIs";

class directoriesService {

    getCategoryDirectories(category_Id, page, filters) {
        return new Promise((resolve, reject) => {
            let directoryAPI = new API();

            directoryAPI.createEntity({
                name: "/api/directory/filter?"
            });

            var data = {
                "with": [
                    "serviceCategories",
                ],
                "with_conditions": {
                    'serviceCategories': {
                        'id': category_Id,
                    }
                },
                "conditions": {
                    "status": 'PUBLISHED'
                },
                per_page: 10,
                page: page
            };

            if (filters.search_faqs && filters.search_faqs.length > 2) {
                data['conditions'] = {
                    'name|description:concat_column_like': filters.search_faqs
                };
            }

            directoryAPI.endpoints
                .post(data)
                .then(({data}) => {
                    resolve(data);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }

    getDirectories(filter, page) {
        return new Promise((resolve, reject) => {
            let directoryAPI = new API();

            directoryAPI.createEntity({
                name: "/api/directory/filter?"+filter.merge()
            });
    
            var data = {
                "with": [
                    "serviceCategories",
                    "hashtags",
                    "directoryMediaLinks",
                    "contactForms"
                ],
                per_page: 10,
                page: page
            };
    
            directoryAPI.endpoints
            .post(data)
            .then(({data}) => {
                resolve(data);
            })
            .catch(function (e) {
                reject(e);
            });
        });
    }

    getDirectoriesFromEs(filter, page) {
        return new Promise((resolve, reject) => {
            let directoryAPI = new API();

            directoryAPI.createEntity({
                name: "/api/directory/es-filter"
            });

            let currentLocale = localStorage.getItem('locale') || 'en';
            let theLanguages = JSON.parse(localStorage.getItem('languages'));

            let selectedLang = theLanguages.filter((item) => {
                if(item.acronym == currentLocale) {
                    return item;
                }
            });

            const currentLanguage = selectedLang && Array.isArray(selectedLang) && selectedLang.length > 0 ?
                                        selectedLang[0].name : theLanguages[0].name;
            
            const condition = filter.getConditions();
            var data = {
                "with": filter.getWith(),
                "with_conditions": filter.getWithConditions(),
                "conditions": condition,
                "filter_by_first_char": filter.getCustomConditions()['filter_by_first_char'] || '',
                "lang": currentLanguage,
                per_page: 10,
                page: page
            };

            directoryAPI.endpoints
            .post(data)
            .then(({data}) => {
                resolve(data);
            })
            .catch(function (e) {
                reject(e);
            });
        });
    }

    getCategoryDirectorysHashtags(hashtag, page, filters) {
        return new Promise((resolve, reject) => {
            let faqAPI = new API();

            faqAPI.createEntity({
                name: "/api/directory/filter?"
            });

            var data = {
                "with": [
                    "serviceCategories",
                    "hashtags"
                ],
                "conditions": {
                    "status": 'PUBLISHED'
                },
                per_page: 10,
                page: page
            };

            if (filters.nationality && filters.nationality.length > 0) {
                data['with_conditions']['nationalities'] = {
                    'id:in': filters.nationality.join(',')
                };
            }

            // countries
            if (filters.country && filters.country.length > 0) {
                data['with_conditions']['countries'] = {
                    'id:in': filters.country.join(',')
                };
            }

            if (filters.search_faqs && filters.search_faqs.length > 2) {

                if (filters.search_faqs.includes('#')) {

                    data['with_conditions'] = {
                        hashtags: {
                            hashtag: filters.search_faqs
                        }
                    };

                } else {

                    data['conditions'] = {
                        'question|answer:concat_column_like': filters.search_faqs
                    };
                }

            } else {
                data['with_conditions'] = {
                    hashtags: {
                        hashtag: hashtag
                    }
                };
            }

            faqAPI.endpoints
                .post(data)
                .then(({data}) => {
                    resolve(data);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }

    getDirectory(id) {
        return new Promise((resolve, reject) => {
            let faqAPI = new API();

            faqAPI.createEntity({
                name:
                    "/api/directory/" + id + "?"
                    + "&with[]=hashtags"
                    + "&with[]=directoryType"
                    + '&with[]=directoryMedia'
                    + "&with[]=directoryMediaLinks"
                    + "&with[]=serviceCategories"
                    + "&with[]=serviceCategories.translations"
                    + "&with[]=contactForms"
                    + "&with[]=contactForms.workingHours"
                    + "&with[]=contactForms.phones"
                    + "&with[]=contactForms.directoryCountry"
                    + "&with[]=translations"
                    + "&with[]=directoryType.translations"
            });

            faqAPI.endpoints
                .get()
                .then(({data}) => {
                    resolve(data);
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }
}

export default directoriesService;
