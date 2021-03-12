import categoriesService from "../helpers/categoryService.js";
import menu_items from "../menu.js";
import countriesService from "../helpers/countryService";
import nationalityService from "../helpers/nationalityService";
import languageService from "./../helpers/languageService";
import Acl from "../components/Acl/Acl";
import i18n from "./../i18n/index.js";

const catSrv = new categoriesService();
const countryserv = new countriesService();
const natService = new nationalityService();
const lngService = new languageService();

let mutations = {
    left_menu(state, option) {
        if (option == "open") {
            state.left_open = true
        } else if (option == "close") {
            state.left_open = false
        } else if (option == "toggle") {
            state.left_open = !state.left_open
        }
        if (state.left_open) {
            document.getElementsByTagName("body")[0].classList.remove("left-hidden")
        } else {
            document.getElementsByTagName("body")[0].classList.add("left-hidden")
        }
    },

    nationalities(state) {
        if (state.nationalities.length || !state.user.name) {
            return true;
        }

        let nationalities = JSON.parse(localStorage.getItem('nationalities'));

        nationalities = nationalities == undefined ? [] : nationalities;

        if(nationalities.length){
            state.nationalities = nationalities;
            return true;
        }

        natService.getNationalities().then((data) => {
            localStorage.setItem('nationalities', JSON.stringify(data));
            state.nationalities = data;
        });

    },
    languages(state) {
        if (state.languages.length || !state.user.name) {
            return true;
        }

        let languages = JSON.parse(localStorage.getItem('languages'));

        languages = languages == undefined ? [] : languages;

        if(languages.length){
            state.languages = languages;
            return true;
        }

        lngService.getLanguages().then((data) => {
            localStorage.setItem('languages', JSON.stringify(data));
            state.languages = data;
        });
    },

    countries(state) {
        if (state.countries.length || !state.user.name) {
            return true;
        }

        let countries = JSON.parse(localStorage.getItem('countries'));

        countries = countries == undefined ? [] : countries;

        if(countries.length){
            state.countries = countries;
            return true;
        }

        countryserv.getCountries().then((data) => {
            localStorage.setItem('countries', JSON.stringify(data));
            state.countries = data;
        });

    },

    categories(state) {

        if (state.categories.length || !state.user.name) {
            return true;
        }

        let categories = JSON.parse(localStorage.getItem('categories'));

        categories = categories == undefined ? [] : categories;

        if(categories.length){
            state.categories = categories;
            return true;
        }

        if(!Acl.currentUserCan('FRONTLINER_VIEW', 'FAQ')){
            // categories = menu_items.concat(categories);
            categories = categories.concat(menu_items);
            localStorage.setItem('categories', JSON.stringify(categories));
            state.categories = categories;
            return true;
        }

        catSrv.getAllCategories().then((data) => {
            let theLanguages = JSON.parse(localStorage.getItem('languages'));
            let messages = i18n.messages;

            // console.log(theLanguages);

            for(var i = 0; i < data.length; i++) {
                if(data[i].translations.length > 0) {
                    let theData = data[i];

                    // if(theLanguages != null && theLanguages.length > 0) {

                    // }
                    for(var k = 0; k < theLanguages.length; k++) {
                        let langAcronym = theLanguages[k].acronym;
                        let langMessages = messages[langAcronym];

                        for(var j = 0; j < data[i].translations.length; j++) {
                            let theTranslation = data[i].translations[j];
                            if(theLanguages[k].id == theTranslation.language_id) {
                                let theLabel = theData.label.replace(/\s/g, '');
                                langMessages[theLabel] = theTranslation.name;
                            }
                        }

                        localStorage.setItem(langAcronym, JSON.stringify(langMessages));
                        i18n.setLocaleMessage(langAcronym, langMessages);
                    }
                }
            }
    
            categories = data.map(function (elem) {

                return {
                    id: elem.id,
                    name: elem.label.replace(/\s/g, ''),
                    icon: elem.icon && elem.icon.includes('fa-') ? "fa " + elem.icon : elem.icon,
                    link: !elem.children ? '/frontline/category/' + elem.id + '/faqs':'',
                    child: elem.children && elem.children.length && elem.children.sort(function (a, b) {
                        let nameA = a.label.toUpperCase(), // ignore upper and lowercase
                        nameB = b.label.toUpperCase(); // ignore upper and lowercase

                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    }).map(function (ch) {
                        return {
                            id: ch.id,
                            name: ch.label,
                            link: '/frontline/category/' + ch.id + '/faqs',
                            permissions: [
                                {
                                    entity: "ServiceCategory",
                                    permission_key: "LIST"
                                }
                            ],
                        };
                    }),
                    permissions: [
                        {
                            entity: "ServiceCategory",
                            permission_key: "LIST"
                        }
                    ]
                };

                // i18n.messages.en
            });



            // categories = menu_items.concat(categories);
            categories = categories.concat(menu_items);
            localStorage.setItem('categories', JSON.stringify(categories));
            state.categories = categories;

        }).catch(function (e) {
            console.log("e", e);
        });

    },

    // lngService.getLanguages().then((data)=>{

    // }),

    user(state, value) {
        state.user = value;
    },

    logout(state) {
        state.user = {};
        state.token = {};
        state.categories = [];
        state.nationalities = [];
        state.countries = [];
        state.languages = [];
        document.querySelector('html').setAttribute('dir', 'ltr');
        localStorage.removeItem('lang_locale');
        let theLanguages = JSON.parse(localStorage.getItem('languages'));
        theLanguages.map((item)=>{
            localStorage.removeItem(item.acronym);
        });
        localStorage.removeItem('languages');
        localStorage.removeItem('locale');
        localStorage.removeItem('countries');
    },

    routeChange(state, loader) {
        if (loader == "start") {
            state.preloader = true
        } else if (loader == "end") {

            state.preloader = false
        }
    },

    addToken(state, token){
        state.token = token;
    },

    changePageTitle(state, title) {
        state.page_title = title
        document.title = title + " - " + state.site_name
    },

    addevent(state, event) {
        let id = state.cal_events[state.cal_events.length - 1] ? state.cal_events[state.cal_events.length - 1].id + 1 : 0;
        state.cal_events.push({id: id, title: event.evtname, start: event.date.from, end: event.date.to})
    },

    editevent(state, event) {
        let evt = JSON.parse(JSON.stringify(event));
        let id_index = "";
        state.cal_events.forEach(function (currentValue, index) {
            if (currentValue.id == evt.id) {
                id_index = index;
            }
        });
        state.cal_events[id_index].title = evt.title;
        state.cal_events[id_index].start = evt.start;
        state.cal_events[id_index].end = evt.end;
    },
    
    removeevent(state, id) {
        let id_index = "";
        state.cal_events.forEach(function (currentValue, index) {
            if (currentValue.id == id.evtid) {
                id_index = index;
            }
        });
        state.cal_events.splice(id_index, 1);
    }
}
export default mutations
