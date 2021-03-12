
import Vue from "vue";
import {EventBus} from './../../eventbus/event-bus.js';
import LoadingSpinner from "./../spinner/loading-spinner";
import NotFound from "./../frontLine/partials/not-found";
import infiniteScroll from 'vue-infinite-scroll';
import componentContainer from './../pages/componentContainer.vue';
import smallSearchbox from './partials/small-search-box.vue';
import FaqsDetails from "./../frontLine/subCategoryFaqs/faqDetails.vue";
import faqsService from "./../../helpers/faqsService.js";
import directoriesService from "./../../helpers/directoriesService.js";
import mediaService from "./../../helpers/mediaService.js";
import directoryDetails from './../partials/directoryDetails.vue';
import mediaDetails from './../partials/mediaDetails.vue';
import directoryList from "./../partials/directory-list.vue";
import mediaList from "./../partials/media-list.vue";
import faqList from "./../partials/faq-list.vue";
import directoryCountryService from '../../helpers/directoryCountryService';

const directoryCountryServ = new directoryCountryService();

let faqService = new faqsService();
let directoryService = new directoriesService();
let serviceMedia = new mediaService();

var Result =  {
    name:"result-list",
    components: {
        LoadingSpinner,
        NotFound,
        FaqsDetails,
        directoryDetails,
        mediaDetails,
        componentContainer,
        "small-search-box":smallSearchbox,
        "directory-list":directoryList,
        "media-list":mediaList,
        "faq-list":faqList
    },
    directives: {infiniteScroll},
    data() {
        return {
            keyword:'',
            countryIds: [],
            countrySelect: [],
            countryOptions: [],
            searchOption:'',
            loading:false,
            catBusy:false,
            page: 1,
            total: -1,
            storeSubscription: false,
            scrollPosition: 700,
            section:'',
            resultItems:[],
            isFAQ:false,
            isDirectory:false,
            isMedia:false,
            mediaBusy: false,
            faqBusy: false,
            directoryBusy:false,
            singleFaq:null,
            singleDirectory:null,
            singleMedia:null
        };
    },
    created() {
        this.keyword = encodeURIComponent(this.$route.query.q);
        const countries = this.$route.query['countries[]'] || [];
        this.countryIds = Array.isArray(countries) ? countries : [countries];
        const directoryCountries = this.$route.query['directory_countries[]'] || [];
        this.countrySelect = Array.isArray(directoryCountries) ? directoryCountries : [directoryCountries];
        this.searchOption = this.$route.query.section;
        this.setSection();
        this.$store.commit('countries');
        this.getCountryList();
    },
    mounted(){
        this.keyword = encodeURIComponent(this.$route.query.q);
        const countries = this.$route.query['countries[]'] || [];
        this.countryIds = Array.isArray(countries) ? countries : [countries];
        const directoryCountries = this.$route.query['directory_countries[]'] || [];
        this.countrySelect = Array.isArray(directoryCountries) ? directoryCountries : [directoryCountries];
        this.searchOption = this.$route.query.section;
        this.setSection();
        this.performSearch();
        document.querySelector('body').setAttribute('class', 'page-search-results-list');

        EventBus.$off('show-directory', this.showDirectorySide);
        EventBus.$on('show-directory', this.showDirectorySide);
        EventBus.$off('show-media', this.showMediaSide);
        EventBus.$on('show-media', this.showMediaSide);
        EventBus.$off('show-faq', this.showFAQSide);
        EventBus.$on('show-faq', this.showFAQSide);
        EventBus.$off('update-section', this.updateSection);
        EventBus.$on('update-section', this.updateSection);
        EventBus.$off('perform-search', this.updateModel);
        EventBus.$on('perform-search', this.updateModel);
        EventBus.$off('update-input-field', this.updateFilterInput);
        EventBus.$on('update-input-field', this.updateFilterInput);
    },
    methods: {
        updateSection:function(event) {
            if(event) {
                this.searchOption = event;
            }
        },
        updateModel: function(event) {
            if(event) {
                this.keyword = event.keyword;
                this.performSearch();
            }
        },
        showMediaSide: function(mediaID) {
            if (this.singleMedia
                && (this.singleMedia.id == mediaID)) {
                return;
            }
            this.resetData('media');
            this.mediaBusy = true;
            this.catBusy = this.isMediaView() ?!this.catBusy:this.catBusy;
            this.remotelyFetchMedia(mediaID).then((data)=> {
                this.singleMedia = data;
                this.mediaBusy = false;

                if(this.isMediaView()) {
                    this.catBusy = false;
                    this.resultItems = [this.singleMedia];
                }
            }). catch((e)=>{
                console.log(e);
            });
        },
        showDirectorySide: function(directoryID) {
            if (this.singleDirectory
                && (this.singleDirectory.id == directoryID)) {
                return;
            }
            
            this.resetData('directory');
            this.directoryBusy = true;
            this.catBusy = this.isDirectoryView() ?!this.catBusy:this.catBusy;
            this.remotelyFetchDirectory(directoryID).then((data)=> {
                this.singleDirectory = data;
                this.directoryBusy = false;

                if(this.isDirectoryView()) {
                    this.catBusy = false;
                    this.resultItems = [this.singleDirectory];
                }
            }). catch((e)=>{
                console.log(e);
            });
        },
        showFAQSide: function(faqID) {
            // if the faq is already opened, ignore
            if (this.singleFaq
                && (this.singleFaq.id == faqID)) {
                return;
            }
            // remove faq
            this.resetData('faq');
            // set faq and cat busy flags
            this.faqBusy = true;
            this.catBusy = this.isFaqView() ? !this.catBusy : this.catBusy;
            // fetch faq
            this.remotelyFetchFAQ(faqID)
                .then((data) => {
                    //prepare faq data
                    let faq = {
                        id: data.id,
                        category_id: this.category_Id,
                        question: data.question,
                        answer: data.answer.substring(1, 150),
                        shortAnswer: data.short_answer,
                        completeAnswer: data.answer,
                        hashtags: data.hashtags,
                        socialLinks: data.social_media_links,
                        media: data.media == null ? [] : data.media,
                        directories: data.directories ? data.directories : [],
                        contactForms: data.directories ? data.directories.contact_forms : [],
                        contacts: data.contacts ? data.contacts : [],
                        translations:data.translations
                    };
                    // set current faq
                    this.singleFaq = faq;
                    this.faqBusy = false;
                    // set current category if faq view
                    if (this.isFaqView()) {
                        this.catBusy = false;
                        this.resultItems = [this.singleFaq];
                    }
                    // send faq view
                    this.trackPageView(this.singleFaq.id, this.singleFaq.category_id);
                })
                .catch((e) => {
                    // this.$router.replace("/404");
                })
        },
        resetData: function(type) {
            this.catBusy = false;
            this.mediaBusy = false;
            this.directoryBusy = false;
            this.faqBusy = false;
            
            if(type =='faq')
                this.singleFaq = null;
            else if(type =='directory') {
                this.singleDirectory = null;
            } else {
                this.singleMedia = null;
            }
        },
        remotelyFetchFAQ: function(faqId) {
            return faqService.getFAQ(faqId);
        },
        remotelyFetchDirectory: function(directoryID) {
            return directoryService.getDirectory(directoryID);
        },
        remotelyFetchMedia: function(mediaID) {
            return serviceMedia.getMedia(mediaID);
        },
        trackPageView: function(faq_id, category_id) {
            this.$ga.event({
                eventCategory: 'c_' + category_id,
                eventAction: 'f_' + faq_id,
                eventLabel: 'u_' + JSON.parse(localStorage.user).id
            })
        },
        isFaqView: function() {
            return this.$route.path.search(/frontline\/faq\/[0-9]/i) !== -1;
        },
        isDirectoryView: function() {
            return this.$route.path.search(/frontline\/directory\/[0-9]/i) !== -1;
        },
        isMediaView: function() {
            return this.$route.path.search(/frontline\/media\/[0-9]/i) !== -1;
        },
        setSection: function() {
            if(this.searchOption == 'faq') {
                this.section = 'faq';
                this.countryIds = this.countryIds || [];
            }
            if(this.searchOption == 'directories') {
                this.section = 'directories';
                this.countryIds = null;
            }
            if(this.searchOption == 'media') {
                this.section = 'media';
                this.countryIds = this.countryIds || [];
            }
        },
        performSearch:function() {
            if(this.keyword != '') {
                this.resetData();

                this.singleDirectory = null;
                this.singleFaq = null;
                this.singleMedia = null;

                this.catBusy = true;
                this.resultItems = [];

                let currentLocale = localStorage.getItem('locale') || 'en';
                let theLanguages = JSON.parse(localStorage.getItem('languages'));

                let selectedLang = theLanguages.filter((item) => {
                    if(item.acronym == currentLocale) {
                        return item;
                    }
                });

                const currentLanguage = selectedLang && Array.isArray(selectedLang) && selectedLang.length > 0 ?
                                            selectedLang[0].name : theLanguages[0].name;
                if(this.searchOption == 'faq') {
                    this.searchFAQ(currentLanguage);
                }
    
                if(this.searchOption == 'directories') {
                    this.searchDirectory(currentLanguage);
                }
    
                if(this.searchOption == 'media') {
                    this.searchMedia(currentLanguage);
                }
            }
        },
        searchMedia: function(lang) {
            this.isDirectory = false;
            this.isFAQ = false;
            this.isMedia = true;
            this.$apis.createEntity({
                name: `api/media/es-search?keywords=${this.keyword}${this.getStringQueryByCountry()}&lang=${lang}`
            });
            this.$apis.endpoints.getAll().then(this.listMedia).catch(this.failure);
        },
        searchDirectory: function (lang) {
            this.isDirectory = true;
            this.isFAQ = false;
            this.isMedia = false;
            this.$apis.createEntity({
                name: `api/directory/es-search?keywords=${this.keyword}${this.getStringQueryByCountry()}&lang=${lang}`
            });
            this.$apis.endpoints.getAll().then(this.listDirectories).catch(this.failure);
        },
        searchFAQ: function(lang) {
            this.isDirectory = false;
            this.isFAQ = true;
            this.isMedia = false;

            this.$apis.createEntity({
                name: `api/faq/es-search?keywords=${this.keyword}${this.getStringQueryByCountry()}&lang=${lang}`
            });
            this.$apis.endpoints.getAll().then(this.listFAQs).catch(this.failure);
        },
        listMedia: function({data}) {
            this.resultItems = data.entities;
            this.total = data.total;
            this.catBusy = false;
        },
        listDirectories: function({data}) {
            this.resultItems = data.entities;
            this.total = data.total;
            this.catBusy = false;
        },
        listFAQs:function({data}) {
            this.resultItems = data.entities;
            this.total = data.total;
            this.catBusy = false;
        },
        failure:function() {
            this.loading = false;
            this.draftLoading = false;
            let errors = error.response.data.errors;

            let err, errs = [];

            for (err in errors) {
                errs[err] = errors[err][0];
            }

            this.errors = errs;

            this.scrollToClass('.text-danger');

            this.$forceUpdate();
        },
        updateScroll() {
            let height = document.getElementsByClassName('tab-content')[0] ? document.getElementsByClassName('tab-content')[0].clientHeight : 0;
            this.scrollPosition = height > 600 ? height - 130 : 800;
        },
        updateFilterInput: function(data) {
            if(Array.isArray(data.value)) {
                if(data.value.length > 0 && this.searchOption !== 'directories'){
                    this.countryIds = data.value;
                    this.countrySelect = [];
                } else {
                    this.countrySelect = data.value;
                    this.countryIds = [];
                }
            }
        },
        getStringQueryByCountry: function() {
            let stringQueryCountry = '';
            const countryIds = (Array.isArray(this.countryIds) && this.countryIds.length > 0) ? this.countryIds : [];
            const countrySelect = (Array.isArray(this.countrySelect) && this.countrySelect.length > 0) ? this.countrySelect : [];
            const countryLists = countryIds.length > 0 ? countryIds : countrySelect.length > 0 ? countrySelect : [];
            if(countryLists.length > 0) {
                const queryArray = countryLists.map((countryId) => `countries[]=${countryId}`);
                stringQueryCountry = '&'+queryArray.join('&');
            }
            return stringQueryCountry;
        },
        getCountryList() {
            directoryCountryServ.getDirectoryCountries().then((data) => {
                this.countryOptions = data;
                this.$forceUpdate();
            });
        }
    }
};

export default Result;