import env from "./Env";

window.axios = require('axios');
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/store.js';
import VueAnalytics from 'vue-analytics';
import API from "./components/APIs/AbstractAPIs" ;
import VueSweetalert2 from 'vue-sweetalert2';
import {EventBus} from './eventbus/event-bus.js';
import Acl from "./components/Acl/Acl";
import i18n from "./i18n";
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);

// window.axios.defaults.headers.common = {
//     'X-Requested-With': 'XMLHttpRequest'
// }

// Google Analytics
const google_analytics_key = store.state.google_analytics_key;

if (google_analytics_key) {

    Vue.use(VueAnalytics, {
        id: google_analytics_key, // TRACKING_ID
        appName: "Knowledgebase for Refugees",
        appVersion: '1.0.0',
        vueRouter: router,
        checkDuplicatedScript: true,
        autoTracking: {
            pageviewTemplate(route) {
                return {
                    page: 'default/' + route.path
                }
            }
        },
        // custom_map: {
        //     'dimension1': 'hashtag'
        // }
    })
}

// Remove the productionTip in dev tool console
Vue.config.productionTip = false;
Vue.prototype.$apis = new API();
Vue.prototype.$eventBus = EventBus;
Vue.prototype.$acl = Acl;

new Vue({
    i18n,
    el: '#app',
    router,
    store,
    render: h => h(App)
})
