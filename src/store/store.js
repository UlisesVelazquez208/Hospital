import 'es6-promise/auto'
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import env from "../Env";

Vue.use(Vuex)

function addDays(noOfDays) {
    return (noOfDays * 24 * 60 * 60 * 1000)
}

//=======vuex store start===========
const store = new Vuex.Store({
    state: {
        left_open: true,
        preloader: true,
        site_name: "Knowledgebase for Refugees",
        page_title: null,
        locale: "en-US",
        user: {},
        token: {},
        categories: [],
        nationalities: [],
        languages:[],
        countries: [],
        lang_locale:"en",
        cal_events: [{
            id: 0,
            title: 'Office',
            start: Date.now(),
            end: Date.now() + addDays(1)
        }, {
            id: 1,
            title: 'Holidays',
            start: Date.now() + addDays(3),
            end: Date.now() + addDays(4)
        }],
        // Add your application keys
        gmap_key: 'AIzaSyBTnQCx3FXEnfWPPWTKAwIxt6wSjAn_8ug',
        openWeather_key: 'c00194f61244d2b33b863bff6d94e663',
        google_analytics_key: env.GOOGLE_ANALYTICS_TRACKING_ID,
    },
    mutations
})
//=======vuex store end===========
export default store;
