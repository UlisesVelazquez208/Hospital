<template>
    <!--<div class="component-container">-->

    <component-container title="FAQ.ViewFAQ">
        <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>

        <!-- Add FAQ Main Details -->
        <form v-else v-on:submit.prevent="" id="test-scroll">

            <div class="text-danger">{{errors.comments}}</div>

            <show-faq :faqModel="faqModel" :showComment=false></show-faq>

            <show-translations :languageContents="languageContents" v-if="languageContents.length > 0"></show-translations>

            <!-- Directory -->
            <show-directory :faqModel="faqModel" :showComment=false></show-directory>

            <!--Media Content-->
            <show-media-content :faqModel="faqModel" :showComment=false></show-media-content>

            <!--Hashtags-->
            <show-hashtag :faqModel="faqModel" :showComment=false></show-hashtag>

            <!--Social media-->
            <show-social-media :faqModel="faqModel" :showComment=false></show-social-media>

            <div class="row pagination">
                <div class="col-sm-4">
                    <div class="form-group text-right" v-if="this.previousID!=0">
                        <span v-on:click="goPrevious()" class="btn faq-draft btn-nav btn-default btn-success">
                            <span> &laquo;</span>
                        </span>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="form-group text-center">
                        <div>
                        <button class="btn faq-draft faq-submit btn-success"
                                v-on:click="goBack" >
                            <i class='fa fa-angle-left'></i> {{ $t('Common.Return')}}
                        </button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="form-group text-left" v-if="this.nextID!=0">
                        <span v-on:click="goNext()" class="btn btn-nav faq-draft btn-default btn-success">
                            <span> &raquo;</span>
                        </span>
                    </div>
                </div>
            </div>
        </form>
    </component-container>

    <!--</div>-->
</template>
<script>
    import Vue from "vue"
    import env from "../../envs/Env-develop"
    import coreFormClass from "../core/form/script";
    import componentContainer from '../pages/componentContainer.vue'
    import showFAQ from './partials/showFAQ.vue'
    import showDirectory from './partials/showDirectory.vue'
    import showHashtag from './partials/showHashtags.vue'
    import showMediaContent from './partials/showMediaContent.vue'
    import showSocialMedia from './partials/showSocialMedia.vue'
    import showFAQTranslation from './partials/showFAQTranslation';
    import {EventBus} from '../../eventbus/event-bus.js';
    import API from "../APIs/AbstractAPIs";
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import LoadingButton from '../spinner/loading-button.vue'
    import LoadingSpinner from "../spinner/loading-spinner";

    export default {
        // ===Component name
        name: "view-faq",
        // ===Props passed to component
        props: {},
        // ===Components used by this component
        components: {
            LoadingSpinner,
            componentContainer,
            "show-faq": showFAQ,
            "show-directory": showDirectory,
            "show-hashtag": showHashtag,
            "show-media-content": showMediaContent,
            "show-social-media": showSocialMedia,
            'ClipLoader': ClipLoader,
            'loading-button': LoadingButton,
            "show-translations": showFAQTranslation
        },
        // ===component Data properties
        data() {
            return {
                faqModel: {
                    question: "",
                    answer: "",
                    service_categories: [],
                    nationality:[],
                    country: [],
                    visible: "",
                    directory: [],
                    hashtags: [],
                    media: [],
                    socialMediaLinks: [],
                    directories: [],
                },
                languageContents:[],
                theLanguages:[],
                previousID:0,
                nextID:0,
                loadingSpinner: false,
                comments: [],
                loadingReturnWithComments: false,
                loadingPublish: false,
                errors: []
            };
        },
        // ===Code to be executed when Component is mounted
        mounted() {
            if (this.getId()) {
                this.retriveUpdateData();
            }
            this.theLanguages = JSON.parse(localStorage.getItem('languages'));
            this.langLocale = localStorage.getItem('lang_locale');

            for(var i=0; i < this.theLanguages.length; i++) {
                var theItem = this.theLanguages[i];
                if(theItem.is_default == 0) {
                    var langContent = {};
                    langContent.language_id = theItem.id;
                    langContent.label = theItem.name;
                    langContent.question_text ="";
                    langContent.answer = "";
                    // langContent.children = [];

                    this.languageContents.push(langContent);
                }
            }
        },
        // ===Computed properties for the component
        created: function () {
        },

        // ===Component methods
        methods: {
            goBack() {
                return this.$router.go(-1);
            },
            getId() {
                return this.$route.params.id;
            },
            getModule() {
                return "faq"
            },
            retriveUpdateData() {
                this.loadingSpinner = true;
                coreFormClass.getData(this.getId(), this.getModule(), this.getSuccess, this.getfailure,
                    '?with[]=serviceCategories&with[]=nationalities&with[]=countries&with[]=directories' +
                    '&with[]=translations' +
                    '&with[]=contacts' +
                    '&with[]=contacts.phones' +
                    '&with[]=contacts.workingHours' +
                    '&with[]=directories.serviceCategories' +
                    '&with[]=directories.contactForms' +
                    '&with[]=directories.directoryMedia' +
                    // '&with[]=directories.contactForms.phones' +
                    // '&with[]=directories.contactForms.workingHours' +
                    '&with[]=media' +
                    '&with[]=media.meta' +
                    '&with[]=hashtags' +
                    '&with[]=socialMediaLinks' +
                    '&with[]=comments' +
                    '&with[]=comments.createdBy'
                );
            },
            getSuccess({data}) {
                this.loadingSpinner = false;
                this.faqModel = data;

                if(this.faqModel.translations.length > 0) {
                    for(var i = 0; i < this.faqModel.translations.length; i++) {
                        let theItem = this.faqModel.translations[i];
                        for(var j = 0; j < this.languageContents.length; j++) {
                            if(this.languageContents[j].language_id == theItem.language_id) {
                                this.languageContents[j].question_text = theItem.question;
                                this.languageContents[j].answer = theItem.answer;
                            }
                        }
                    }
                } else {
                    let langFilter = this.theLanguages.filter((item) => {
                        if(item.is_default == 1)
                            return item;
                    });

                    if(langFilter.length > 0) {
                        let defaultLang = langFilter[0];
                        let translation = {
                            language_id:0,
                            question_text:'',
                            answer:''
                        };
                        translation.language_id = defaultLang.id;
                        translation.question_text = this.faqModel.question;
                        translation.answer = this.faqModel.answer;

                        this.languageContents.push(translation);
                    }
                }

                let faqAPI = new API();

                faqAPI.createEntity({name:'api/faq/'+this.getId()+'/previous'});
                faqAPI.endpoints.get({}).then(this.getPrevious).catch(this.failure);

                faqAPI.createEntity({name:'api/faq/'+this.getId()+'/next'});
                faqAPI.endpoints.get({}).then(this.getNext).catch(this.failure);
            },
            goNext(){
                this.$router.replace('/faq/view/'+this.nextID);
            },
            goPrevious(){
                this.$router.replace('/faq/view/'+this.previousID);
            },
            getPrevious({data}) {
                if(data.id) {
                    this.previousID = data.id;
                }
            },
            getNext({data}) {
                if(data.id) {
                    this.nextID = data.id;
                }
            },
            getfailure() {
                this.$router.replace('/404');
            },
            getAPIUrl() {
                if (this.getId()) {
                    return env.API_URL + '/api/faq/' + this.getId();
                }
                return env.API_URL + '/api/faq';
            },
        }
    };
</script>
<!-- styles -->

<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">
    .white-section_details {
        padding: 25px 0 35px;

    }

    .faq-submit {
        font-size: 20px;
        padding: 10px 50px;
        background-color: #0072BC;
        border-color: #0072BC !important;
    }

    .faq-draft {
        font-size: 20px;
        padding: 10px 74px !important;
        background-color: #F9F9F9 !important;
        color: #0072BC !important;
        border-color: #0072BC !important;
    }
    .btn-nav {
        padding:10px 30px !important;
    }
</style>
