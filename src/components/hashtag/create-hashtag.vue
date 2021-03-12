<template>
    <!--<div class="component-container">-->

    <component-container :title="CreatePageTitle" class="hashtag-containe">
        <loading-spinner v-if="loading" :isLoading="loading"></loading-spinner>
        <!-- Add FAQ Main Details -->
        <form v-else v-on:submit.prevent>
            <input-text name="hashtag" inputClass="hashtag"
                        inputId="hashtag_0" :placeholder="$t('Hashtag.HashtagPlaceholder')" :value="hashtagModel.hashtag"
                        inputLabel="Hashtag.Hashtag" :required="false" :errors="errors.hashtag" 
            ></input-text>
            <div v-for="(langItem, index) in languageContents" class="row" :key="index">
                <div class="col-lg-12">
                    <h5>{{ langItem.label }}</h5>
                    <input type="hidden" name="language_id" :index="(index+1)" v-model="langItem.language_id" value="langItem.language_id"/>
                    <input-text name="hashtag_0" inputClass="hashtag"
                                :inputId="'hashtag_'+(index+1)" 
                                :placeholder="$t('Hashtag.HashtagPlaceholder')" 
                                :value="langItem.name"
                                v-model="langItem.name"
                                inputLabel="Hashtag.Hashtag" 
                                :required="false" 
                                :index="(index+1)" 
                                :errors="errors.hashtag"
                                @input="updateModel(index+1, 'name', $event.target)"
                    ></input-text>
                </div>
            </div>
            <!-- Linked FAQs -->
            <div class="form-group row">
                <label class="col-lg-3 col-md-3 col-form-label">{{ $t('Hashtag.LinkedFAQs')}}</label>
                <div class="col-lg-9 col-md-9">
                    <data-list :componentName="getComponentName()"
                   :tableData="faqList" :sorting="sorting" :filters="filters" :templates="templates"
                   :columns="columns" :headings="headings" ref="faqList"
                   ></data-list>
                </div>
            </div>
            <!-- Linked FAQs End -->
            <div class="row">
                <div class="col-sm-12 col-lg-9 offset-lg-3 mt-3">
                    <router-link v-if="!isModal" tag="a" to="/hashtag/list"
                                 class="btn btn-cancel pull-left btn-lg ">{{$t('Common.Cancel')}}
                    </router-link>
                    <loading-button :buttonName="$t(submitBtnLabel)"
                                    v-on:click="onSaveHashtag"
                                    :isLoading="submitLoading"
                                    classNames="btn btn-hashtag btn-submit btn-success"
                                    :isShifted="true"
                                    :shiftSize="isModal? '-150px' : '-350px'">
                    </loading-button>
                </div>
            </div>
        </form>
    </component-container>

    <!--</div>-->
</template>
<script>
    import Vue from "vue";
    import componentContainer from '../pages/componentContainer.vue';
    import {EventBus} from '../../eventbus/event-bus.js';
    import API from "../APIs/AbstractAPIs";
    import inputText from "../core/form/partials/input-text/input-text.vue"
    import coreFormClass from "../core/form/script"
    import loadingButton from "../spinner/loading-button.vue"
    import LoadingSpinner from "../spinner/loading-spinner";
    import dataList from "./../core/list_data/list.vue";
    import actions from "./partials/actions.vue";
    import faqsService from './../../helpers/faqsService.js';

    let hashtagAPI = new API();
    let faqService = new faqsService();

    export default {
        // ===Component name
        name: "create-hashtag",
        // ===Props passed to component
        props: {
            isModal: {
                type: Boolean,
                default: false,
            }
        },
        // ===Components used by this component
        components: {
            LoadingSpinner,
            componentContainer,
            inputText,
            loadingButton,
            dataList
        },
        // ===component Data properties
        data() {
            return this.initialState();
        },
        // ===Code to be executed when Component is mounted
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-hashtag-create-edit');
            if (this.getId() && !this.isModal) {
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
                    langContent.name ="";

                    this.languageContents.push(langContent);
                }
            }
        },
        // ===Computed properties for the component
        created: function () {
            EventBus.$on('update-input-field', this.updateModel);
            EventBus.$on('clear-input-field', this.clearError);
            EventBus.$on('unlink-faq', this.unlinkFaq);
        },

        // ===Component methods
        methods: {
            initialState() {
                return {
                    errors:[],
                    CreatePageTitle: "Hashtag.CreatePageTitle",
                    submitBtnLabel: 'Common.Save',
                    hashtagModel: {
                        hashtag: "",
                    },
                    languageContents:[],
                    theLanguages:[],
                    faqList:[],
                    loading: false,
                    submitLoading: false,
                    columns: ["question", "actions"],
                    filters: ['question'],
                    headings: {
                        question: "FAQ",
                        actions: "Actions"
                    },
                    dateColumns: [],
                    sorting:['question'],
                    templates: {
                        actions:actions
                    },
                    bus: new Vue()
                };
            },
            clearError: function (data) {
                if (!this.isMyScope(data)) {
                    return;
                }
                if (this.errors[data.name]) {
                    this.errors[data.name] = '';
                    this.$forceUpdate();
                }
            },
            resetModel() {
                Object.assign(this.$data, this.initialState());
            },
            success() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('Hashtag.HashtagCreated'),
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    if(!this.isModal) {
                        this.$router.replace('/hashtag/list');
                    }
                    this.$emit('processDone');
                    this.resetModel();
                })
            },
            update() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('Hashtag.HashtagUpdated'),
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    if(!this.isModal) {
                        this.$router.replace('/hashtag/list');
                    }
                })
            },
            failure(error) {
                this.submitLoading = false;

                if (error.response.status == "401") {
                    this.$router.replace('/403');
                }

                let errors = error.response.data.errors;

                let err, errs = [];

                for (err in errors) {
                    errs[err] = errors[err][0];
                }

                this.errors = errs;
            },
            updateModel: function (data) {
                if (!this.isMyScope(data)) {
                    return;
                }
                this.hashtagModel[data.name] = data.value;
                
                if(data.index > 0) {
                    this.languageContents[data.index-1]['name'] = data.value;
                }
            },
            onSaveHashtag() {
                this.submitLoading = true;

                let langTranslations = [];

                let defaultLang = this.theLanguages.filter((item)=>{
                    return (item.is_default == 1);
                })[0];

                for(var i = 0; i < this.languageContents.length; i++) {
                    var theItem = this.languageContents[i];
                    var langTrans = {};

                    if(theItem.language_id !== defaultLang.id) {
                        langTrans.language_id = theItem.language_id;
                        langTrans.name = theItem.name;

                        langTranslations.push(langTrans);
                    }
                }

                langTranslations.push({language_id:defaultLang.id, name:this.hashtagModel.hashtag});
                
                if (this.getId() && !this.isModal) {
                    hashtagAPI.createEntity({name: 'api/hashtag/' + this.getId()});
                    hashtagAPI.endpoints.create({
                        hashtag: this.hashtagModel.hashtag,
                        translations: langTranslations,
                        _method: "PATCH"
                    }).then(this.update).catch(this.failure)
                }
                else {
                    hashtagAPI.createEntity({name: 'api/hashtag'});
                    hashtagAPI.endpoints.create({
                        hashtag: this.hashtagModel.hashtag,
                        translations: langTranslations,
                    }).then(this.success).catch(this.failure)
                }
            },
            getsuccess({data}) {
                this.loading = false;
                this.hashtagModel.hashtag = data.hashtag;
                this.faqList = data.faqs;

                let defaultLang = this.theLanguages.filter((item)=>{
                    return (item.is_default == 1);
                });

                let translations = data.translations;
                for(var i = 0; i < translations.length; i++) {
                    let theItem = translations[i];
                    for(var j = 0; j < this.languageContents.length; j++) {
                        if(defaultLang.length > 0 && defaultLang[0].id != this.languageContents[j].language_id &&  this.languageContents[j].language_id == theItem.language_id) {
                            this.languageContents[j].name = theItem.name;
                        }
                    }
                    
                }
            },
            getfailure() {
                this.$router.replace('/404');
            },
            getId() {
                if(this.$route.params.id)
                    this.title = 'Hashtag.UpdatePageTitle';
                return this.$route.params.id;
            },
            getModule() {
                return "hashtag";
            },
            retriveUpdateData() {
                this.CreatePageTitle = 'Edit Hashtag';
                this.submitBtnLabel = 'Common.Update';
                this.loading = true;
                coreFormClass.getData(this.getId(), this.getModule(), this.getsuccess, this.getfailure, '?with[]=faqs&with[]=translations');
            },
            getAPIUrl() {
                if (this.getId()) {
                    return env.API_URL + '/api/hashtag/' + this.getId();
                }
                return env.API_URL + '/api/hashtag';
            },
            isMyScope(data) {
                if (!data.hasOwnProperty("source_component")) {
                    return true;
                }

                if (data.source_component === "public") {
                    return true;
                }

                if (data.source_component === "create-hashtag") {
                    return true;
                }

                return false;
            },
            getComponentName(){
                return this.name;
            },
            unlinkFaq(id) {
                var itemIndex = 0
                var index = 0;
                for(var i = 0; i < this.faqList.length; i++) {
                    if(this.faqList[i].id == id) {
                        itemIndex = i;
                        break;
                    }
                }

                if(itemIndex > 0) {
                    faqService.getFAQ(id).then((data)=>{
                        let hashtags = data.hashtags.map((item)=>{
                            if(item.id != this.getId()) {
                                return item.id;
                            }
                        });
                        hashtags.splice(hashtags.indexOf(undefined), 1);

                        let faqAPI = new API();

                        faqAPI.createEntity({name: 'api/faq/'+id+'/unlink-hashtag'});
                        faqAPI.endpoints.post({
                            hashtags: hashtags,
                        }).then((faqItem) => {
                            this.faqList.splice(itemIndex, 1);
                        }).catch(function(e) {
                            console.log(e);
                        });
                    });                
                }
            }
        }
    };
</script>
<!-- styles -->

<!-- adding scoped attribute will apply the css to this component only -->
<style scoped type="text/css" lang="scss">
    .btn-hashtag {
        font-size: 19px;
        padding: 5px 74px;
    }

    .btn-submit {
        padding-left: 85px;
        padding-right: 85px;
        background-color: #0072BC;
    }

    .btn-cancel {
        background-color: #fff;
        border: 1px solid #0072BC;
        color: #0072BC;
        margin-right: 15px;
    }
</style>
