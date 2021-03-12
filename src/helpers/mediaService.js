import API from "../components/APIs/AbstractAPIs";

class mediaService {

    getMediaItems(filter, page) {
        return new Promise((resolve, reject) => {
            let directoryAPI = new API();

            directoryAPI.createEntity({
                name: "api/media/filter?"+filter.merge()
            });
    
            var data = {
                "with": [
                    "meta",
                    "countries",
                    "nationalities",
                    "serviceCategories"
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

    getMediaItemsEs(filter, page) {
        return new Promise((resolve, reject) => {
            let directoryAPI = new API();

            directoryAPI.createEntity({
                name: "api/media/es-filter"
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

            var data = {
                "with": filter.getWith(),
                "with_conditions": {...filter.getWithConditions()},
                "conditions": filter.getConditions(),
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

    getMedia(id) {
        return new Promise((resolve, reject) => {
            let faqAPI = new API();

            faqAPI.createEntity({
                name:
                    "api/media/" + id + "?"
                    + "&with[]=meta"
                    + "&with[]=countries"
                    + "&with[]=nationalities"
                    + "&with[]=serviceCategories"
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

    // getRecentFAQs(catId, page, filters) {

    //     var dateFormat = require('dateformat');
    //     let lastWeek = dateFormat(new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)), "yyyy-mm-dd 00:00:00");

    //     return new Promise((resolve, reject) => {
    //         let faqAPI = new API();

    //         faqAPI.createEntity({
    //             name: "/api/faq/filter?"
    //         });

    //         var data = {
    //             "with": [
    //                 "serviceCategories",
    //             ],
    //             "with_conditions": {
    //                 'serviceCategories': {
    //                     'id:in': catId,
    //                 }
    //             },
    //             "conditions": {
    //                 "updated_at:gte": lastWeek
    //             },
    //             per_page: 10,
    //             page: page
    //         };

    //         if (filters.nationality && filters.nationality.length > 0) {
    //             data['with_conditions']['nationalities'] = {
    //                 'id:in': filters.nationality.join(',')
    //             };
    //         }

    //         // countries
    //         if (filters.country && filters.country.length > 0) {
    //             data['with_conditions']['countries'] = {
    //                 'id:in': filters.country.join(',')
    //             };
    //         }

    //         if (filters.search_faqs && filters.search_faqs.length > 2) {
    //             data['conditions'] = {
    //                 'question|answer:concat_column_like': filters.search_faqs
    //             };
    //         }

    //         faqAPI.endpoints
    //             .post(data)
    //             .then(({data}) => {
    //                 resolve(data);
    //             })
    //             .catch(function (e) {
    //                 reject(e);
    //             });
    //     });

    // }
}

export default mediaService;
