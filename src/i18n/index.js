import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enTranslations from './messages/english.json';
import arTranslations from './messages/arabic.json';


Vue.use(VueI18n);

let messages = {
    'en': enTranslations,
    'ar': arTranslations
};

let i18n = new VueI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages, // set locale messages
});

export default i18n;