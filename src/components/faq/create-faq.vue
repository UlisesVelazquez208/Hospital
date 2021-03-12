<template>
    <!--<div class="component-container">-->

    <component-container :title="title">

        <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>

        <!-- Add FAQ Main Details -->
        <form v-else v-on:submit.prevent="" id="test-scroll">

            <add-faq :faqModel="faqModel" :serviceCategories="serviceCategories" :errors="errors"></add-faq>

            <faq-translations :languageContents="languageContents" v-if="languageContents.length > 0"></faq-translations>
            <!-- Directory -->
            <add-directory :faqModel="faqModel" :errors="errors"></add-directory>

            <!--Media Content-->
            <media-content :faqModel="faqModel" :errors="errors"></media-content>

            <!--Hashtags-->
            <add-hashtag :faqModel="faqModel" :errors="errors"></add-hashtag>

            <!--Social media-->

            <social-media :faqModel="faqModel" :errors="errors"></social-media>

            <div class="row">
                <div class="mx-auto button__container">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group text-center">
                                <button v-on:click="onSubmit('DRAFT')"
                                        type="submit"
                                        class="btn faq-draft faq-submit btn-success"
                                        value="Draft"
                                        :disabled="this.loading"
                                >
                                    <ClipLoader :loading="this.draftLoading"
                                                color="#0072BC"
                                                size="20px"
                                    >
                                    </ClipLoader>
                                    <span v-if="!this.draftLoading">{{ $t('FAQ.SaveAsDraft') }}</span>
                                </button>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group text-center">
                                <button v-on:click="onPreview()"
                                        type="submit"
                                        class="btn faq-draft faq-submit btn-success"
                                        value="Draft"
                                        :disabled="this.loading"
                                >
                                    </ClipLoader>
                                    <span v-if="!this.draftLoading">{{ $t('FAQ.Preview') }}</span>
                                </button>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group text-center">
                                <div>
                                    <button v-on:click="onSubmit('WAITING_FOR_APPROVAL')"
                                            type="submit"
                                            class="btn faq-submit btn-success"
                                            value="Submit"
                                            :disabled="this.loading"
                                    >
                                        <ClipLoader :loading="this.loading"
                                                    color="white"
                                                    size="20px"
                                        >
                                        </ClipLoader>
                                        <span v-if="!this.loading">{{ $t('FAQ.SubmitForApproval')}}</span>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <component-as-modal componentName="faqPreview" showModalButton="" buttonTag="" ref="modalBox"
                            @processDone="onProcessDone" :componentData="previewModel" :isShowModal="isShowModal"
        >
        </component-as-modal>
    </component-container>

    <!--</div>-->
</template>
<script>
    import Vue from "vue";
    // import env from "../../envs/Env-develop";
    import coreFormClass from "../core/form/script";
    import componentContainer from '../pages/componentContainer.vue';
    import addFAQ from './partials/addFAQ.vue';
    import faqTranslation from './partials/faqTranslation.vue';
    import addDirectory from './partials/addDirectory.vue';
    import addHashtags from './partials/addHashtags.vue';
    import addMediaContent from './partials/addMediaContent.vue';
    import addSocialMedia from './partials/addSocialMedia.vue';
    import {EventBus} from '../../eventbus/event-bus.js';
    import API from "../APIs/AbstractAPIs";
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
    import LoadingSpinner from "../spinner/loading-spinner";
    import store from "./../../store/store.js";
    import componentAsModal from "./../modal/component-as-modal.vue";


    export default {
        // ===Component name
        name: "create-faq",
        // ===Props passed to component
        props: {},
        // ===Components used by this component
        components: {
            LoadingSpinner,
            componentContainer,
            componentAsModal,
            "add-faq": addFAQ,
            "add-directory": addDirectory,
            "add-hashtag": addHashtags,
            "media-content": addMediaContent,
            "social-media": addSocialMedia,
            'ClipLoader': ClipLoader,
            "faq-translations": faqTranslation
        },
        // ===component Data properties
        data() {
            return {
                faqModel: {
                    question: "",
                    answer: "",
                    service_categories: [],
                    countries: [],
                    nationalities:[],
                    visible: "UNHCR_STAFF",
                    hashtags: [],
                    media: [],
                    socialMediaLinks: [],
                    directories: []
                },
                oldModel:{
                    question: "",
                    answer: "",
                },
                previewModel:{
                    question: "",
                    answer: "",
                    service_categories: [],
                    countries: [],
                    nationalities:[],
                    visible: "UNHCR_STAFF",
                    hashtags: [],
                    media: [],
                    socialMediaLinks: [],
                    directories: [],
                    contacts:[],
                    translations:[]
                },
                languageContents:[],
                theLanguages:[],
                previousID:0,
                nextID:0,
                serviceCategories:[],
                loading: false,
                draftLoading: false,
                loadingSpinner: false,
                errors: [],
                isShowModal:false,
                langLocale:'',
                selectedContacts:[],
                title: 'FAQ.CreateTitle'
            };
        },
        // ===Code to be executed when Component is mounted
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-faq-create_edit');

            if (this.getId()) {
                this.title = 'FAQ.EditTitle';
                this.retriveUpdateData();
            }

            this.theLanguages = JSON.parse(localStorage.getItem('languages'));
            this.langLocale = localStorage.getItem('lang_locale');

            for(var i=0; i < this.theLanguages.length; i++) {
                var theItem = this.theLanguages[i];
                if(this.langLocale == theItem.acronym && theItem.is_default == 0) {
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
            EventBus.$on('update-input-field', this.updateModel);
            EventBus.$on('update-multi-select', this.updateSelectModel);
            EventBus.$on('update-socialMediaLink', this.updateSocialLink);
            EventBus.$on('update-service-categories', this.updateServiceCategories);
            EventBus.$on('processDone', this.onProcessDone);
            EventBus.$on('contact-selected', this.updateSelectedContacts);
        },

        // ===Component methods
        methods: {
            updateSelectedContacts(event) {
                let theIndex = this.selectedContacts.indexOf(event);
                if(theIndex === -1)
                {
                    this.selectedContacts.push(event);
                } else {
                    this.selectedContacts.splice(theIndex, 1);
                }
            },
            updateContacts() {
                let directories = this.previewModel.directories;
                this.previewModel.contacts = [];
                let theContacts = [];

                if(directories !== null && directories.length > 0) {
                    for(var i = 0; i < directories.length; i++) {
                        let directoryContacts = directories[i].contact_forms;

                        for(var j = 0; j < directoryContacts.length; j++) {
                            for(var k = 0; k < this.selectedContacts.length; k++) {
                                if(directoryContacts[j].id == this.selectedContacts[k]) {
                                    theContacts.push(directoryContacts[j]);
                                    break;
                                }
                            }
                        }
                    }
                }
                this.previewModel.contacts = theContacts;
            },
            updateTranslations() {
                let langTranslations = this.faqModel.translations !== undefined && this.faqModel.translations!== null ?this.faqModel.translations.map((item)=>{
                    return {language_id:item.language_id, question_text:item.question, answer:item.answer};
                }):[];
                this.previewModel.translations = langTranslations;
            },
            success({data}) {
                    // this.$router.replace('/faq/list');
                var theTitle = this.getId() ? this.$parent.$t('FAQ.UpdatedSuccessfully') : this.$parent.$t('FAQ.CreatedSuccessfully');
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: theTitle,
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    this.$router.replace('/faq/list');
                });
            },
            update() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: 'FAQ.UpdatedSuccessfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then(function () {
                    // location.reload()
                    this.$router.replace('/faq/list');
                });
            },
            failure(error) {
                console.log(error);
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
            scrollToClass(className) {
                let el = this.$el.querySelector(className);
                let rect = el.getBoundingClientRect();
                window.scrollTo(rect.left, rect.top);
            },
            updateSelectModel(event) {
                if (!this.isMyScope(event)) {
                    return;
                }
                switch (event.name) {
                    case "hashtag-content":
                        this.faqModel.hashtags = event.value;
                        break;
                    case "media-content":
                        this.faqModel.media = event.value;
                        break;
                    case "directory-content":
                        this.faqModel.directories = event.value;
                        break;
                    // case "contact-information":
                    //     this.selectedContacts.push(event.value);
                    //     break;
                    default:
                }
                this.$forceUpdate();
            },
            updateSocialLink: function (data) {
                if (!this.isMyScope(data)) {
                    return;
                }
                this.faqModel.socialMediaLinks = data;
            },
            updateModel: function (data) {
                if (!this.isMyScope(data)) {
                    return;
                }
                if(data.name == 'serviceCategories') {
                    this.faqModel['service_categories'] = data.value;
                } else {
                    this.faqModel[data.name] = data.value;
                }
            },
            goNext(){
                this.$router.replace('/faq/update-faq/'+this.nextID);
            },
            goPrevious(){
                this.$router.replace('/faq/update-faq/'+this.previousID);
            },
            onPreview() {
                this.isShowModal = true;
                this.previewModel = this.faqModel;
                this.updateContacts();
                this.updateTranslations();
                this.$refs.modalBox.showModal();
            },
            onProcessDone() {

            },
            onSubmit(status) {

                if (status === 'DRAFT') {
                    this.draftLoading = true;
                } else {
                    this.loading = true;
                }

                let faqAPI = new API();
                let theCategories = this.faqModel.service_categories.length == 0 ?this.serviceCategories:this.faqModel.service_categories;

                let defaultLang = this.theLanguages.filter((item)=>{
                    return (item.is_default == 1);
                })[0];

                let langTranslations = [];

                // langTranslations = this.languageContents.map((item)=>{
                //     if(item.language_id !== defaultLang.id) {
                //         return {language_id:item.language_id, question:item.question_text, answer:item.answer};
                //     }
                // });

                for(var i = 0; i < this.languageContents.length; i++) {
                    let item = this.languageContents[i];

                    if(item.language_id !== defaultLang.id) {
                        if(item.question_text != '') {
                            langTranslations.push({language_id:item.language_id, question:item.question_text, answer:item.answer});
                        }
                    }
                }

                langTranslations.push({language_id:defaultLang.id, question:this.faqModel.question, answer:this.faqModel.answer});
                // if((this.oldModel.question !== this.faqModel.question) || (this.oldModel.answer !== this.faqModel.answer)) {
                // }

                if (this.getId()) {
                    faqAPI.createEntity({name: 'api/faq'});
                    faqAPI.endpoints.update({
                        id: this.getId(),
                        question: this.faqModel.question,
                        answer: this.faqModel.answer,
                        service_categories: theCategories === null ? [] : theCategories.map((a) => a.id),
                        countries: this.faqModel.countries === null ? [] : this.faqModel.countries.map((a) => a.id),
                        nationalities: this.faqModel.nationalities === null ? [] : this.faqModel.nationalities.map((a) => a.id),
                        visible: this.faqModel.visible,
                        hashtags: this.faqModel.hashtags === null ? [] : this.faqModel.hashtags.map((a) => a.id),
                        media: this.faqModel.media === null ? [] : this.faqModel.media.map((a) => a.id),
                        socialMediaLinks: this.faqModel.socialMediaLinks,
                        created_by:store.state.user.id,
                        directories: this.faqModel.directories === null ? [] : this.faqModel.directories.map((a) => a.id),
                        contacts: this.selectedContacts,
                        status: status,
                        translations:langTranslations,
                    }).then(this.success).catch(this.failure);
                } else {
                    faqAPI.createEntity({name: 'api/faq'});
                    faqAPI.endpoints.create({
                        question: this.faqModel.question,
                        answer: this.faqModel.answer,
                        service_categories: this.faqModel.service_categories.map((a) => a.id),
                        nationalities: this.faqModel.nationalities.map((a) => a.id),
                        countries: this.faqModel.countries.map((a) => a.id),
                        visible: this.faqModel.visible,
                        hashtags: this.faqModel.hashtags === null ? [] : this.faqModel.hashtags.map((a) => a.id),
                        media: this.faqModel.media === null ? [] : this.faqModel.media.map((a) => a.id),
                        socialMediaLinks: this.faqModel.socialMediaLinks,
                        directories: this.faqModel.directories === null ? [] : this.faqModel.directories.map((a) => a.id),
                        contacts: this.selectedContacts,
                        created_by:store.state.user.id,
                        status: status,
                        translations:langTranslations,
                    }).then(this.success).catch(this.failure);
                }

            },
            getSuccess({data}) {
                let r, tmp = {};
                for(r in data) {
                    if(r == 'service_categories') {
                        this.serviceCategories = data[r];
                    } else {
                        tmp[r] = data[r];
                    }
                }

                this.faqModel = tmp;
                this.oldModel.question = this.faqModel.question;
                this.oldModel.answer = this.faqModel.answer;
                this.loadingSpinner = false;
                this.selectedContacts = this.faqModel.contacts.map(item=>{
                    return item.id;
                });

                if(tmp.translations.length > 0) {
                    let langFilter = this.theLanguages.filter((item) => {
                        if(item.is_default == 1)
                            return item;
                    });
                    for(var i = 0; i < tmp.translations.length; i++) {
                        let theItem = tmp.translations[i];

                        for(var j = 0; j < this.languageContents.length; j++) {
                            if(langFilter.length > 0 && langFilter.id != this.languageContents[j].language_id && this.languageContents[j].language_id == theItem.language_id) {
                                this.languageContents[j].question_text = theItem.question;
                                this.languageContents[j].answer = theItem.answer;
                            }
                        }
                    }
                }

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
            getfailure(e) {
                console.log(e);
                this.$router.replace('/404');
            },
            getId() {
                return this.$route.params.fid;
            },
            getModule() {
                return "faq";
            },
            retriveUpdateData() {

                this.loadingSpinner = true;

                coreFormClass.getData(this.getId(), this.getModule(), this.getSuccess, this.getfailure,
                    '?with[]=serviceCategories'+
                    '&with[]=nationalities'+
                    '&with[]=countries' +
                    '&with[]=contacts' +
                    '&with[]=contacts.phones' +
                    '&with[]=contacts.workingHours' +
                    '&with[]=directories' +
                    '&with[]=directories.contactForms' +
                    '&with[]=directories.contactForms.directoryCountry' +
                    '&with[]=directories.directoryMedia' +
                    '&with[]=media' +
                    '&with[]=media.meta' +
                    '&with[]=socialMediaLinks' +
                    '&with[]=translations' +
                    '&with[]=comments' +
                    '&with[]=comments.createdBy' +
                    '&with[]=hashtags'
                );
            },
            getAPIUrl() {
                if (this.getId()) {
                    return env.API_URL + '/api/faq/' + this.getId();
                }
                return env.API_URL + '/api/faq';
            },
            isMyScope(data) {
                if (!data.hasOwnProperty("source_component")) {
                    return true;
                }

                if (data.source_component === "public") {
                    return true;
                }

                if (data.source_component === "create-faq") {
                    return true;
                }

                return false;
            },

        }
    };
</script>
<!-- styles -->

<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">

    .btn-success:focus{
        box-shadow: none;
    }

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
    .button__container{
        max-width: 80%;
        width: 100%;
        padding: 0 10px;
        .btn{
            width: 100%;
        }
    }
</style>
