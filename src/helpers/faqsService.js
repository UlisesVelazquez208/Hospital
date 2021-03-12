import API from "../components/APIs/AbstractAPIs";

class faqsService {
    getCategoryFaqs(category_Id, page, filters) {
        return new Promise((resolve, reject) => {
            let faqAPI = new API();

            faqAPI.createEntity({
                name: "/api/faq/es-filter?"
            });

            var data = {
                "with": [
                    "service_category_ids",
                ],
                "with_conditions": {
                    "service_category_ids": [category_Id]
                },
                "conditions": "",
                per_page: 10,
                page: page
            };

            if (filters.nationality && filters.nationality.length > 0) {
                data["with"].push("nationality_ids");
                data["with_conditions"]["nationality_ids"] = filters.nationality;
            }

            if (filters.country && filters.country.length > 0) {
                data["with"].push("country_ids");
                data["with_conditions"]["country_ids"] = filters.country;
            }

            if (filters.search_faqs && filters.search_faqs.length > 2) {
                data["conditions"] = filters.search_faqs;
            }

            let currentLocale = localStorage.getItem('locale') || 'en';
            let theLanguages = JSON.parse(localStorage.getItem('languages'));

            let selectedLang = theLanguages.filter((item) => {
                if(item.acronym == currentLocale) {
                    return item;
                }
            });

            const currentLanguage = selectedLang && Array.isArray(selectedLang) && selectedLang.length > 0 ?
                                        selectedLang[0].name : theLanguages[0].name;
            data["lang"] = currentLanguage;

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

    getCategoryFaqsHashtags(hashtag, page, filters) {
        return new Promise((resolve, reject) => {
            let faqAPI = new API();

            faqAPI.createEntity({
                name: "/api/faq/filter?"
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

            let currentLocale = localStorage.getItem('locale') || 'en';
            let theLanguages = JSON.parse(localStorage.getItem('languages'));

            let selectedLang = theLanguages.filter((item) => {
                if(item.acronym == currentLocale) {
                    return item;
                }
            });

            const currentLanguage = selectedLang && Array.isArray(selectedLang) && selectedLang.length > 0 ?
                                        selectedLang[0].name : theLanguages[0].name;
            data["lang"] = currentLanguage;

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

    getFAQ(id) {
        return new Promise((resolve, reject) => {
            let faqAPI = new API();

            faqAPI.createEntity({
                name:
                    "/api/faq/" + id + "?"
                    + "&with[]=hashtags"
                    + "&with[]=hashtags.translations"
                    + "&with[]=countries"
                    + "&with[]=nationalities"
                    + "&with[]=serviceCategories"
                    + "&with[]=serviceCategories.translations"
                    + "&with[]=media"
                    + "&with[]=translations"
                    + "&with[]=media.meta"
                    + "&with[]=socialMediaLinks"
                    + "&with[]=directories"
                    + "&with[]=directories.translations"
                    + "&with[]=directories.contactForms"
                    + "&with[]=directories.contactForms.directoryCountry"
                    + "&with[]=directories.directoryMedia"
                    + "&with[]=contacts"
                    + "&with[]=contacts.translations"
                    + "&with[]=contacts.phones"
                    + "&with[]=contacts.workingHours"
                    + "&with[]=contacts.directoryCountry"
                    + "&conditions[status:equal]='PUBLISHED'"
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

    getRecentFAQs(catId, page, filters) {

        var dateFormat = require('dateformat');
        let lastWeek = dateFormat(new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)), "yyyy-mm-dd 00:00:00");

        return new Promise((resolve, reject) => {
            let faqAPI = new API();

            faqAPI.createEntity({
                name: "/api/faq/filter?"
            });

            var data = {
                "with": [
                    "serviceCategories",
                ],
                "with_conditions": {
                    'serviceCategories': {
                        'id:in': catId,
                    }
                },
                "conditions": {
                    "updated_at:gte": lastWeek
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
                data['conditions'] = {
                    'question|answer:concat_column_like': filters.search_faqs
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
}

export default faqsService;
