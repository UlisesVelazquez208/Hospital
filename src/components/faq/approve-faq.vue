<template>
    <!--<div class="component-container">-->

    <component-container title="Approve FAQ">
        <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>

        <!-- Add FAQ Main Details -->
        <form v-else v-on:submit.prevent="" id="test-scroll">

            <div class="text-danger">{{errors.comments}}</div>

            <show-faq :faqModel="faqModel"></show-faq>

            <show-translations :languageContents="languageContents" v-if="languageContents.length > 0"></show-translations>

            <!-- Directory -->
            <show-directory :faqModel="faqModel" v-if="faqModel.directories"></show-directory>

            <!--Media Content-->
            <show-media-content :faqModel="faqModel"></show-media-content>

            <!--Hashtags-->
            <show-hashtag :faqModel="faqModel"></show-hashtag>

            <!--Social media-->
            <show-social-media :faqModel="faqModel"></show-social-media>

            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group text-right">
                        <loading-button
                                @click="onReturnWithComments"
                                buttonName="FAQ.ReturnWithComments"
                                :isLoading="loadingReturnWithComments"
                                classNames="btn faq-draft faq-submit btn-success"
                        >
                        </loading-button>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group text-left">
                        <loading-button
                                v-on:click="onPublish"
                                buttonName="FAQ.SaveAndPublish"
                                :isLoading="loadingPublish"
                                classNames="btn faq-submit btn-primary"
                        >
                        </loading-button>
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
        name: "approve-faq",
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
                // if(this.langLocale == theItem.acronym && theItem.is_default == 0) {
                    var langContent = {};
                    langContent.language_id = theItem.id;
                    langContent.label = theItem.name;
                    langContent.question_text ="";
                    langContent.answer = "";
                    // langContent.children = [];

                    this.languageContents.push(langContent);
                // }
            }
        },
        // ===Computed properties for the component
        created: function () {
            EventBus.$on('update-input-field', this.updateModel);
            EventBus.$on('update-multi-select', this.updateSelectModel);
            EventBus.$on('update-socialMediaLink', this.updateSocialLink);
        },

        // ===Component methods
        methods: {
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
                    '&with[]=directories.serviceCategories' +
                    '&with[]=translations' +
                    '&with[]=contacts' +
                    '&with[]=contacts.phones' +
                    '&with[]=contacts.workingHours' +
                    '&with[]=directories.contactForms' +
                    '&with[]=directories.directoryMedia' +
                    // '&with[]=directories.contactForms.phones' +
                    // '&with[]=directories.contactForms.workingHours' +
                    '&with[]=media' +
                    '&with[]=createdBy' +
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
                let faqTranslations = [];

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
            },
            getfailure() {
                this.$router.replace('/404');
            },
            updateModel: function (data) {
                switch (data.name) {
                    case "faq_section_comment":
                        this.comments[data.name] = {"section": "FAQ", "comment": data.value};
                        break;
                    case "directory_section_comment":
                        this.comments[data.name] = {"section": "DIRECTORY", "comment": data.value};
                        break;
                    case "media_section_comment":
                        this.comments[data.name] = {"section": "MEDIA", "comment": data.value};
                        break;
                    case "hashtag_section_comment":
                        this.comments[data.name] = {"section": "HASHTAGS", "comment": data.value};
                        break;
                    case "social_media_link_section_comment":
                        this.comments[data.name] = {"section": "SOCIAL_MEDIA_LINKS", "comment": data.value};
                        break;
                }
            },
            onReturnWithComments() {
                this.loadingReturnWithComments = true;
                let data = [];
                for (let key in this.comments) {
                    data.push(this.comments[key]);
                }
                let faqAPI = new API();
                faqAPI.createEntity({name: 'api/faq/' + this.getId() + '/comments?with[]=comments'});
                faqAPI.endpoints.create({
                    comments: data
                }).then(this.success('FAQ.CommentMade')).catch(this.failure);
            },
            onPublish() {
                this.loadingPublish = true;
                let faqAPI = new API();
                faqAPI.createEntity({name: 'api/faq/' + this.getId()});
                faqAPI.endpoints.create({
                    question: this.faqModel.question,
                    answer: this.faqModel.answer,
                    service_categories: this.faqModel.service_categories.map(item => item.id),
                    visible:this.faqModel.visible,
                    status: "PUBLISHED",
                    _method: "PATCH"
                }).then(this.success('FAQ.FAQPublished')).catch(this.failure);
            },
            success(msg) {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t(msg),
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    this.loadingPublish = false;
                    this.loadingReturnWithComments = false;
                    this.$router.replace('/faq/list');
                })
            },
            failure(error) {
                this.loadingPublish = false;
                this.loadingReturnWithComments = false;
                let errors = error.response.data.errors;
                let err, errs = [];
                for (err in errors) {
                    errs[err] = errors[err][0];
                }
                this.errors = errs;
                this.scrollToClass('.text-danger');
                this.$forceUpdate();
            },
            scrollToClass(className) {
                let el = this.$el.querySelector(className);
                let rect = el.getBoundingClientRect();
                window.scrollTo(rect.left, rect.top);
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
</style>
